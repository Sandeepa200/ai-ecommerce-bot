"use client";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import { getFeaturedProducts } from "@/data/products";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const featured = getFeaturedProducts();
  const products = q ? featured.filter((p) => (p.title + p.description).toLowerCase().includes(q.toLowerCase())) : featured;
  return (
    <div className="min-h-screen bg-background pt-24 pb-6">
      <Navbar onSearch={setQ} />
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl p-6 bg-secondary">
          <h1 className="text-3xl font-bold tracking-tight">Featured Products</h1>
          <p className="text-sm text-secondary-foreground/80">Discover popular items across categories</p>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}