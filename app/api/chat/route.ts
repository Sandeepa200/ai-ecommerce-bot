import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CartItem } from "@/lib/cart";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-lite-latest",
});

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
    const chat = model.startChat({
      generationConfig,
      history: initialHistory,
    });

    const cartItems: CartItem[] = Array.isArray(context?.cart) ? (context.cart as CartItem[]) : [];
    const categories: string[] = Array.isArray(context?.categories) ? (context.categories as string[]) : [];
    const productCount: number = typeof context?.productCount === "number" ? context.productCount : 0;

    const contextualMessage = context
      ? `Context:\n- Cart items: ${cartItems.map((i) => `${i.title} x${i.qty}`).join(", ") || "none"}\n- Categories: ${categories.join(", ")}\n- Product count: ${productCount}\n\nUser: ${message}`
      : message;

    const result = await chat.sendMessage(contextualMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
