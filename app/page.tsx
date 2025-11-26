"use client";
import ProductGrid from "@/components/ProductGrid";
import { getFeaturedProducts, getCategories, Category } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>("all");
  const featured = getFeaturedProducts(16);
  const allCats = ["all" as const, ...getCategories()];

  useEffect(() => {
    const onSearch = (e: Event) => {
      const anyE = e as CustomEvent<{ q: string }>;
      setQ(anyE.detail?.q || "");
    };
    window.addEventListener("search", onSearch as EventListener);
    return () => {
      window.removeEventListener("search", onSearch as EventListener);
    };
  }, []);

  const filtered = featured.filter((p) => {
    const matchesSearch = (p.title + p.description).toLowerCase().includes(q.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle pb-6">
      <div className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Elevate Your Lifestyle</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">Discover premium products curated for the modern lifestyle. Quality, style, and innovation in every item.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Explore Collections</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-b bg-background p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search products..."
            className="pl-9 w-full rounded-md border bg-background px-3 py-2"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-30">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {allCats.map((c) => (
              <Button key={c} variant={selectedCategory === c ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setSelectedCategory(c)}>
                {c === "all" ? "All" : c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{selectedCategory === "all" ? "All Products" : selectedCategory}</h2>
          <p className="text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'product' : 'products'} available</p>
        </div>

        <ProductGrid products={filtered} />
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}