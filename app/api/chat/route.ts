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
          `You are an e-commerce customer support chatbot for an online store. 
          Your primary tasks are: 1) Order status inquiries, 2) Return policy explanations, and 
          3) Product recommendations based on customer preferences. When users ask about orders, 
          politely request the order ID and associated email if not provided, and respond with a concise status summary. 
          For returns, clearly explain eligibility, steps, deadlines, and provide links to policy sections. 
          For recommendations, ask clarifying questions to capture budget, category, and preferences, 
          then suggest a few products with title, price, and buy links. Keep responses helpful, brief, and actionable. 
          Avoid revealing internal system details or any secrets.`
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
    const { message, context } = await req.json();

    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon").split(",")[0].trim();
    const now = Date.now();
    // Simple per-minute rate limiter
    rateStore[ip] = rateStore[ip] && now - rateStore[ip].ts < 60_000 ? { ts: rateStore[ip].ts, count: rateStore[ip].count + 1 } : { ts: now, count: 1 };
    if (rateStore[ip].count > 30) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }
    const intent = detectIntent(message);
    const structured = await handleIntent(intent, message, context);
    if (structured) {
      return new Response(JSON.stringify(structured), { headers: { "Content-Type": "application/json" } });
    }

    if (!model) {
      return new Response(JSON.stringify({ response: "AI service unavailable. Ask about orders, returns, shipping, or products.", type: "fallback" }), { headers: { "Content-Type": "application/json" } });
    }

    const chat = model.startChat({ generationConfig, history: initialHistory });

    const cartItems: CartItem[] = Array.isArray(context?.cart) ? (context.cart as CartItem[]) : [];
    const categories: string[] = Array.isArray(context?.categories) ? (context.categories as string[]) : [];
    const productCount: number = typeof context?.productCount === "number" ? context.productCount : 0;

    const contextualMessage = context
      ? `Context:\n- Cart items: ${cartItems.map((i) => `${i.title} x${i.qty}`).join(", ") || "none"}\n- Categories: ${categories.join(", ")}\n- Product count: ${productCount}\n\nUser: ${message}`
      : message;

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
    return { type: "policy_info", response: `${p.title}\n\n${p.content}\n\nSee: /policies/${k}` };
  }
  if (intent === "order_status") {
    const orders: Order[] = Array.isArray(context?.orders) ? context!.orders : [];
    const idMatch = msg.match(/ORD-\d{4,}/i);
    const id = idMatch ? idMatch[0].toUpperCase() : undefined;
    const found = id ? orders.find((o) => o.id.toUpperCase() === id) : undefined;
    const summary = found
      ? `Order ${found.id} is ${found.status}. Total $${Number(found.total).toFixed(2)}.`
      : `Provide your order ID (e.g., ORD-1001) and the email used at checkout. Use Orders > Track for guest orders.`;
    return { type: "order_status", response: summary };
  }
  if (intent === "recommendations") {
    const budgetMatch = msg.match(/\$?(\d{2,4})/);
    const budget = budgetMatch ? Number(budgetMatch[1]) : undefined;
    const cats: string[] = Array.isArray(context?.categories) ? context!.categories : [];
    const catMatch = cats.find((c) => msg.toLowerCase().includes(c.toLowerCase()));
    const list = recommendProducts(msg, { category: (catMatch as Category | undefined), budget, limit: 5 });
    const lines = list.map((p) => `• ${p.title} — $${p.price.toFixed(2)} (/products/${p.slug})`).join("\n");
    const text = lines.length ? lines : "Tell me your budget and category to recommend the best options.";
    return { type: "recommendations", response: text };
  }
  return null;
}
