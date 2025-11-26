"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const trigger = (value: string) => {
    setLoading(true);
    onSearch(value);
    setTimeout(() => setLoading(false), 300);
  };
  return (
    <div className="w-full md:w-96 flex items-center gap-2">
      <Input
        placeholder="Search products..."
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
        }}
        onKeyDown={(e) => { if (e.key === 'Enter') trigger(q); }}
        aria-label="Search products"
      />
      <Button onClick={() => trigger(q)} aria-label="Search" disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Searching
          </span>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
}