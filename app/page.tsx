"use client";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import { getFeaturedProducts } from "@/data/products";
import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  const [q, setQ] = useState("");
  const featured = getFeaturedProducts();
  const products = q ? featured.filter((p) => (p.title + p.description).toLowerCase().includes(q.toLowerCase())) : featured;
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-4">
      <Navbar onSearch={setQ} />
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Featured Products</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Discover popular items across categories</p>
        </div>
        <ProductGrid products={products} />
      </div>
      <ChatWidget />
    </div>
  );
}