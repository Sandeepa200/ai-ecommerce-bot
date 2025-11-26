"use client";
import { useUser } from "@clerk/nextjs";
import { Orders } from "@/lib/orders";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useUser();
  const orders = user?.id ? Orders.findByUser(user.id) : [];
  if (!user) {
    return (
      <div className="pt-24 container mx-auto">
        <p>Please sign in to view your orders.</p>
        <Link className="underline" href="/sign-in">Sign in</Link>
      </div>
    );
  }
  return (
    <div className="pt-24 container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-3">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border rounded p-2">
              <div className="font-semibold">Order {o.id}</div>
              <div className="text-sm">Status: {o.status}</div>
              <div className="text-sm">Total: ${o.total.toFixed(2)}</div>
              <Link className="underline" href={`/orders/${o.id}`}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}