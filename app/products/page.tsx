"use client";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts, getCategories, type Category } from "@/data/products";

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const cats = getCategories();
  const products = useMemo(() => searchProducts(q, category), [q, category]);

  return (
    <div className="min-h-screen pt-24 pb-4">
      <Navbar onSearch={setQ} />
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button className={`px-3 py-1 rounded ${!category ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => setCategory(undefined)}>All</button>
          {cats.map((c) => (
            <button key={c} className={`px-3 py-1 rounded ${category === c ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}