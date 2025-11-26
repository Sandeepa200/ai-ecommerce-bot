"use client";
import { Orders } from "@/lib/orders";
import Link from "next/link";

export default function OrderStatusClient({ id }: { id: string }) {
  const order = Orders.findById(id);
  if (!order) {
    return (
      <div className="pt-24 container mx-auto">
        <p>Order not found.</p>
        <Link className="underline" href="/">Go home</Link>
      </div>
    );
  }
  return (
    <div className="pt-24 container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Order {order.id}</h1>
      <p className="mb-4">Status: <span className="font-semibold">{order.status}</span></p>
      <div className="space-y-2">
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between">
            <div>{i.title} x{i.qty}</div>
            <div>${(i.qty * i.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 font-bold">Total: ${order.total.toFixed(2)}</div>
      <p className="mt-2 text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleString()}</p>
    </div>
  );
}