"use client";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="pt-24 container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-3">Orders</h1>
      <p>Account sign-in has been removed. Use guest tracking to find orders.</p>
      <Link className="underline" href="/orders/track">Track guest orders</Link>
    </div>
  );
}
