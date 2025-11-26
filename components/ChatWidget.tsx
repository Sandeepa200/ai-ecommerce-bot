"use client";
import { useEffect, useMemo, useState } from "react";
import { Cart } from "@/lib/cart";
import { getProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { History } from "@/lib/history";
import { useUser } from "@clerk/nextjs";
import type { CartItem } from "@/lib/cart";
import type { ViewedItem } from "@/lib/history";
import type { Order } from "@/lib/orders";
import { useCallback } from "react";

type Msg = { role: "user" | "bot"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{
    role: "bot",
    content: "Hi! I can recommend products, explain returns, and assist with orders."
  }]);
  const [input, setInput] = useState("");
  const products = useMemo(() => getProducts(), []);
  const { user } = useUser();

  const baseContext = useMemo(() => ({
    productCount: products.length,
    categories: Array.from(new Set(products.map((p) => p.category))),
  }), [products]);

  type ChatContext = {
    productCount: number;
    categories: string[];
    cart: CartItem[];
    history: ViewedItem[];
    orders: Order[];
    page: string;
  };

  const send = useCallback(async () => {
    const userMsg: Msg = { role: "user", content: input.trim() };
    if (!userMsg.content) return;
    setMessages((m) => [...m, userMsg]);

    // Simple local intent: order status requests if message contains "order"
    if (/order|status|track/i.test(userMsg.content)) {
      const reply = "For demo, order status is stored locally. Provide your order ID (e.g., ORD-1001) and email if a guest.";
      setMessages((m) => [...m, { role: "bot", content: reply }]);
      setInput("");
      return;
    }

    try {
      const cart = Cart.get();
      const history = History.get();
      const orders = user?.id
        ? (await import("@/lib/orders")).Orders.findByUser(user.id)
        : [];
      const page = typeof window !== "undefined" ? window.location.pathname : "/";
      const context: ChatContext = { ...baseContext, cart, history, orders, page };
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, context }),
      });
      const data = await resp.json();
      setMessages((m) => [...m, { role: "bot", content: data.response }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", content: "Sorry, I couldn't process that." }]);
    }
    setInput("");
  }, [input, baseContext, user]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open && e.key === "Enter") send();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, send]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <Button className="rounded-full" onClick={() => setOpen(true)}>Chat</Button>
      ) : (
        <div className="w-80 h-96 rounded-xl border bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          <div className="p-2 border-b flex items-center justify-between">
            <div className="font-semibold">Support Bot</div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-2 py-1 rounded ${m.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}>{m.content}</span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 rounded border px-2 py-1 bg-white dark:bg-gray-800"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products or returns..."
            />
            <Button onClick={send}>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
}