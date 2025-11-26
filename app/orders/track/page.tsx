"use client";
import { useState } from "react";
import { Orders } from "@/lib/orders";

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(Orders.findByEmail(""));
  return (
    <div className="pt-24 container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-3">Track Guest Orders</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="rounded border px-2 py-1 flex-1"
          placeholder="Enter email used at checkout"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="px-3 py-1 rounded bg-purple-600 text-white"
          onClick={() => setResults(Orders.findByEmail(email))}
        >
          Search
        </button>
      </div>
      <div className="space-y-3">
        {results.map((o) => (
          <div key={o.id} className="border rounded p-2">
            <div className="font-semibold">Order {o.id}</div>
            <div className="text-sm">Status: {o.status}</div>
            <div className="text-sm">Total: ${o.total.toFixed(2)}</div>
          </div>
        ))}
        {results.length === 0 && <p>No orders found.</p>}
      </div>
    </div>
  );
}