"use client";
import { useEffect, useMemo, useState } from "react";
import { Cart } from "@/lib/cart";
import { getProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
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
  const [sending, setSending] = useState(false);
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
    setSending(true);

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
    setSending(false);
  }, [input, baseContext, user]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open && e.key === "Enter") send();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, send]);

  return (
    <>
      {!open && (
        <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl" onClick={() => setOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative sm:max-w-[500px] w-[92%] md:w-[500px] h-[600px] rounded-2xl border bg-card text-card-foreground shadow-2xl flex flex-col">
            <div className="p-4 border-b">
              <div className="text-lg font-semibold">Shopping Assistant</div>
              <div className="text-sm text-muted-foreground">Ask me anything about our products or your order!</div>
            </div>
            <div className="flex-1 pr-4 p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "bot" ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${m.role === "bot" ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4 border-t p-4">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              />
              <Button onClick={send} size="icon" disabled={sending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}