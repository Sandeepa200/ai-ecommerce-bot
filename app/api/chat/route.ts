import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CartItem } from "@/lib/cart";
import type { ViewedItem } from "@/lib/history";
import type { Order } from "@/lib/orders";
import type { PolicyKey } from "@/lib/policies";
import type { Category } from "@/data/products";
import { Policies } from "@/lib/policies";
import { recommendProducts } from "@/data/products";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const model = genAI ? genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" }) : null;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const initialHistory = [
  {
    role: "user",
    parts: [
      {
        text:
          `You are an e-commerce customer support assistant.
          Capabilities:
          1) Track order status and summarize with total, status, placed date, and a direct link.
          2) Explain policies with specific sections and provide direct links.
          3) Recommend products from the provided catalog with clickable links.
          4) Handle sentiment: detect frustration or confusion; respond empathetically, apologize when appropriate, and offer calm, actionable steps.
          5) Use multi-turn context: incorporate recent chat history, cart items, viewed products, and current page; avoid repeating already given information; ask one concise follow-up at a time.
          6) Escalate gracefully: when the user requests human help or you cannot resolve, link to the relevant page (e.g., [/policies/faq](/policies/faq) or [/policies/returns](/policies/returns)) and outline the next steps.

          Rules for responses:
          - Be concise and helpful; use plain language and a friendly, professional tone.
          - When listing items, use markdown bullets with clickable links, e.g. "- [Acme Running Shoes — $27.50](/products/acme-running-shoes-41)".
          - When referring to a page, include a markdown link, e.g. "[/policies/returns](/policies/returns)" or "[View order](/orders/ORD-1001)".
          - For order tracking: if no order ID is given, ask for ID and email; if only email is provided, list all matching orders as bullets with links; never assume a latest order.
          - If an order or product cannot be found, say so clearly, suggest alternatives, and include a helpful link (e.g., "[Track Order](/orders/track)").
          - Respect safety and privacy: never ask for payment card numbers, CVV, passwords, or other sensitive data; request only email and order ID for tracking.
          - Keep follow-up questions minimal and targeted (budget, category, preference); ask one at a time.
          - Keep formatting clean; avoid raw HTML; use only markdown.`
      }
    ]
  },
  {
    role: "model",
    parts: [
      {
        text:
          `Hi! I am your e-commerce support assistant. I can help with orders, returns, or product recommendations. 
          What would you like to do?`
      }
    ]
  }
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message: string; context?: ChatContext };
    const { message, context } = body;

    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").split(",")[0].trim();
    const now = Date.now();
    // Simple per-minute rate limiter
    rateStore[ip] = rateStore[ip] && now - rateStore[ip].ts < 60_000 ? { ts: rateStore[ip].ts, count: rateStore[ip].count + 1 } : { ts: now, count: 1 };
    if (rateStore[ip].count > 30) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }
    let intent = detectIntent(message);
    const emailOnly = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(message);
    if (emailOnly && inOrderFlow(context?.chatHistory)) {
      intent = "order_status";
    } else if (intent === "none" && Array.isArray(context?.chatHistory) && hasSupportCue(message)) {
      const recentUser = context!.chatHistory.filter((m) => m.role === "user").slice(-3).map((m) => m.content).join(" \n");
      intent = detectIntent(`${recentUser}\n${message}`);
    }
    const structured = await handleIntent(intent, message, context);
    if (structured) {
      return new Response(JSON.stringify(structured), { headers: { "Content-Type": "application/json" } });
    }

    if (!model) {
      return new Response(JSON.stringify({ response: "AI service unavailable. Ask about orders, returns, shipping, or products.", type: "fallback" }), { headers: { "Content-Type": "application/json" } });
    }

    const persisted: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = Array.isArray(context?.chatHistory)
      ? (context!.chatHistory as Array<{ role: string; content: string }>).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }))
      : [];
    const history = [...initialHistory, ...persisted];
    const chat = model.startChat({ generationConfig, history });

    const cartItems: CartItem[] = Array.isArray(context?.cart) ? (context.cart as CartItem[]) : [];
    const categories: string[] = Array.isArray(context?.categories) ? (context.categories as string[]) : [];
    const productCount: number = typeof context?.productCount === "number" ? context.productCount : 0;

    const hints: string[] = [];
    let topicDecision: "switch" | "continue" | "unknown" = "unknown";
    if (intent === "none" && !hasSupportCue(message)) {
      topicDecision = await classifyTopic(message, context?.chatHistory);
    }
    if (topicDecision === "switch") {
      hints.push(
        "User changed topic; provide a friendly overview of capabilities with markdown links: [/orders/track](/orders/track), [/policies/returns](/policies/returns), [/policies/shipping](/policies/shipping), [/policies/privacy](/policies/privacy), [/policies/faq](/policies/faq). Ask one concise follow-up."
      );
    }
    const hintText = hints.length ? `\n\nAssistant directive:\n- ${hints.join("\n- ")}` : "";

    const contextualMessage = context
      ? `Context:\n- Cart items: ${cartItems.map((i) => `${i.title} x${i.qty}`).join(", ") || "none"}\n- Categories: ${categories.join(", ")}\n- Product count: ${productCount}\n\nUser: ${message}${hintText}`
      : `${message}${hintText}`;

    const url = new URL(req.url);
    const stream = url.searchParams.get("stream") === "1";
    if (!stream) {
      const result = await chat.sendMessage(contextualMessage);
      const response = await result.response;
      const text = response.text();
      return new Response(JSON.stringify({ response: text, type: "model" }), { headers: { "Content-Type": "application/json" } });
    } else {
      const enc = new TextEncoder();
      const rs = new ReadableStream({
        start: async (controller) => {
          try {
            const result = await chat.sendMessage(contextualMessage);
            const response = await result.response;
            const text = response.text();
            const parts = text.split(/(\n\n|\n)/);
            for (const part of parts) {
              controller.enqueue(enc.encode(part));
              await new Promise((r) => setTimeout(r, 60));
            }
            controller.close();
          } catch {
            controller.enqueue(enc.encode("Error"));
            controller.close();
          }
        },
      });
      return new Response(rs, { headers: { "Content-Type": "text/plain" } });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

type Intent = "policy_info" | "order_status" | "recommendations" | "none";

const rateStore: Record<string, { ts: number; count: number }> = {};

function detectIntent(msg: string): Intent {
  const m = msg.toLowerCase();
  if (/return|refund|exchange/.test(m)) return "policy_info";
  if (/ship|shipping|delivery/.test(m)) return "policy_info";
  if (/privacy|gdpr|data/.test(m)) return "policy_info";
  if (/terms|service|conditions/.test(m)) return "policy_info";
  if (/order|status|track/.test(m)) return "order_status";
  if (/ord-\d{4,}/.test(m)) return "order_status";
  if (/recommend|suggest|looking for|find/.test(m)) return "recommendations";
  return "none";
}

type ChatContext = {
  productCount: number;
  categories: string[];
  cart: CartItem[];
  history: ViewedItem[];
  orders: Order[];
  page: string;
  chatHistory?: Array<{ role: "user" | "bot"; content: string }>;
};

async function handleIntent(intent: Intent, msg: string, context: ChatContext | undefined): Promise<{ type: string; response: string } | null> {
  if (intent === "policy_info") {
    const k: PolicyKey = /return|refund|exchange/.test(msg.toLowerCase())
      ? "returns"
      : /ship|shipping|delivery/.test(msg.toLowerCase())
      ? "shipping"
      : /privacy|gdpr|data/.test(msg.toLowerCase())
      ? "privacy"
      : /terms|service|conditions/.test(msg.toLowerCase())
      ? "terms"
      : "faq";
    const p = Policies.get(k);
    return { type: "policy_info", response: `${p.title}\n\n${p.content}\n\nSee: [/policies/${k}](/policies/${k})` };
  }
  if (intent === "order_status") {
    const orders: Order[] = Array.isArray(context?.orders) ? context!.orders : [];
    const idMatch = msg.match(/ORD-\d{4,}/i);
    const id = idMatch ? idMatch[0].toUpperCase() : undefined;
    const emailMatch = msg.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : undefined;
    if (id) {
      const found = orders.find((o) => o.id.toUpperCase() === id);
      const summary = found
        ? `Order ${found.id} — ${found.status}. Total $${Number(found.total).toFixed(2)}. Placed ${new Date(found.createdAt).toLocaleDateString()}. [View details](/orders/${found.id}).`
        : `I couldn't find order ${id}. Please verify the ID or use [Track Order](/orders/track).`;
      return { type: "order_status", response: summary };
    }
    if (email) {
      const list = orders.filter((o) => (o.email || "").toLowerCase() === email.toLowerCase());
      if (list.length > 0) {
        const lines = list
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((o) => `- [${o.id} — ${o.status} — $${o.total.toFixed(2)}](/orders/${o.id})`)
          .join("\n");
        return { type: "order_status", response: `Orders for ${email}:\n\n${lines}` };
      }
      return { type: "order_status", response: `No orders found for ${email}. Please check the email or use [Track Order](/orders/track).` };
    }
    return { type: "order_status", response: `Please provide your order ID (e.g., ORD-1001) or the email used at checkout. You can also use [Track Order](/orders/track).` };
  }
  if (intent === "recommendations") {
    const budgetMatch = msg.match(/\$?(\d{2,4})/);
    const budget = budgetMatch ? Number(budgetMatch[1]) : undefined;
    const cats: string[] = Array.isArray(context?.categories) ? context!.categories : [];
    const catMatch = cats.find((c) => msg.toLowerCase().includes(c.toLowerCase()));
    const list = recommendProducts(msg, { category: (catMatch as Category | undefined), budget, limit: 5 });
    const lines = list.map((p) => `- [${p.title} — $${p.price.toFixed(2)}](/products/${p.slug})`).join("\n");
    const text = lines.length ? lines : "Tell me your budget and category to recommend the best options.";
    return { type: "recommendations", response: text };
  }
  return null;
}
function isTopicSwitch(msg: string): boolean {
  return /what\s+can\s+you\s+do|what\s+else\s+can\s+you\s+do|who\s+are\s+you|help\b|capabilit|menu\b|options\b|how\s+can\s+you\s+assist/i.test(msg.toLowerCase());
}
function hasSupportCue(msg: string): boolean {
  return /order|status|track|return|refund|exchange|ship|shipping|delivery|privacy|terms|recommend|suggest|looking for|find/i.test(msg.toLowerCase());
}
function inOrderFlow(history?: Array<{ role: "user" | "bot"; content: string }>): boolean {
  if (!Array.isArray(history)) return false;
  const text = history.slice(-6).map((m) => m.content.toLowerCase()).join(" ");
  return /track|status|order/.test(text) || /provide .*order id/.test(text) || /email used at checkout/.test(text) || /ord-\d{4,}/.test(text);
}
async function classifyTopic(message: string, history?: Array<{ role: "user" | "bot"; content: string }>): Promise<"switch" | "continue" | "unknown"> {
  if (!model) return isTopicSwitch(message) ? "switch" : "unknown";
  const recent = Array.isArray(history) ? history.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n") : "";
  const prompt = [
    "You are a classifier for an e-commerce assistant.",
    "Decide if the user is changing topic away from the current thread.",
    "Return one word: SWITCH, CONTINUE, or UNKNOWN.",
    `User: ${message}`,
    recent ? `Recent:\n${recent}` : "",
  ].join("\n");
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toUpperCase();
    if (text.includes("SWITCH")) return "switch";
    if (text.includes("CONTINUE")) return "continue";
    return "unknown";
  } catch {
    return isTopicSwitch(message) ? "switch" : "unknown";
  }
}
