"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Cart, type CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setItems(Cart.get());
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="pt-24 container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3 border rounded p-2">
              <Image src={i.imageUrl} alt={i.title} width={64} height={64} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm">${i.price.toFixed(2)}</div>
              </div>
              <input
                className="w-20 rounded border px-2 py-1"
                type="number"
                min={1}
                value={i.qty}
                onChange={(e) => {
                  const qty = Math.max(1, parseInt(e.target.value || "1", 10));
                  setItems(Cart.setQty(i.productId, qty));
                }}
              />
              <Button variant="outline" onClick={() => setItems(Cart.remove(i.productId))}>Remove</Button>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <div className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Email for guest order"
                className="rounded border px-2 py-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={() => { window.location.href = "/checkout"; }}>Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}