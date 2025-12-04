"use client";
import { useEffect, useState } from "react";
import { Cart, type CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    setItems(Cart.get());
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="pt-24 container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input className="w-full rounded border px-2 py-1" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded border px-2 py-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded border px-2 py-1" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-2 py-1" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <input className="w-32 rounded border px-2 py-1" placeholder="Postal" value={postal} onChange={(e) => setPostal(e.target.value)} />
          </div>
          <input className="w-full rounded border px-2 py-1" placeholder="Payment details (mock)" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </div>
        <div>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <div>{i.title} x{i.qty}</div>
                <div>${(i.qty * i.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
          <Button
            className="mt-3"
            onClick={() => {
              const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
              const order = {
                id,
                email: email || undefined,
                userId: undefined,
                items: items.map((i) => ({ slug: i.slug, title: i.title, qty: i.qty, price: i.price })),
                total: subtotal,
                status: "pending" as const,
                createdAt: new Date().toISOString(),
              };
              Promise.resolve().then(() => import("@/lib/orders")).then(({ Orders }) => {
                Orders.create(order);
                Cart.clear();
                alert(`Order placed! Confirmation sent (mock). Your ID is ${id}`);
                window.location.href = `/orders/${id}`;
              });
            }}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
