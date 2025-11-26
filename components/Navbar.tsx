"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { getCategories } from "@/data/products";
// Theme toggle removed from navbar per new design

export default function Navbar({ onSearch }: { onSearch: (q: string) => void }) {
  const cats = getCategories();
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-16 z-40 bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">
        <button className="md:hidden" onClick={() => setOpen((s) => !s)}>☰</button>
        <div className="hidden md:flex gap-3">
          {cats.map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="text-sm hover:text-primary">
              {c}
            </Link>
          ))}
        </div>
        <div className="flex-1" />
        <SearchBar onSearch={onSearch} />
        <button
          className="ml-3 text-sm font-semibold px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => window.dispatchEvent(new Event("open-cart"))}
        >
          Cart
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-2 flex flex-col gap-2">
          {cats.map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="text-sm">
              {c}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}