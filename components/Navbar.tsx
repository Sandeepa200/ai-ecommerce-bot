"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { getCategories } from "@/data/products";
import ThemeToggler from "@/components/ThemeToggler";

export default function Navbar({ onSearch }: { onSearch: (q: string) => void }) {
  const cats = getCategories();
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">
        <button className="md:hidden" onClick={() => setOpen((s) => !s)}>☰</button>
        <div className="hidden md:flex gap-3">
          {cats.map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="text-sm">
              {c}
            </Link>
          ))}
        </div>
        <div className="flex-1" />
        <SearchBar onSearch={onSearch} />
        <div className="ml-3"><ThemeToggler /></div>
        <Link href="/cart" className="ml-3 font-semibold">Cart</Link>
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