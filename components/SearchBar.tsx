"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="w-full md:w-80">
      <Input
        placeholder="Search products..."
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onSearch(v);
        }}
      />
    </div>
  );
}