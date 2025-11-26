"use client";
import { useEffect, useState } from "react";
import { getProductBySlug } from "@/data/products";
import { Cart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { History } from "@/lib/history";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    if (product) {
      History.push({ slug: product.slug, title: product.title, viewedAt: new Date().toISOString() });
    }
  }, [slug, product]);

  if (!product) {
    return <div className="pt-24 container mx-auto">Product not found</div>;
  }

  return (
    <div className="pt-24 container mx-auto max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.imageUrl} alt={product.title} className="w-full rounded-xl" />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="mt-3">{product.description}</p>
          <div className="mt-3 space-y-1">
            {product.specifications.map((s) => (
              <div key={s.key} className="text-sm">
                <span className="font-medium">{s.key}:</span> {s.value}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-sm">Inventory: {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}</p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
              className="w-20 rounded border px-2 py-1 bg-background"
            />
            <Button
              onClick={() =>
                Cart.add({
                  productId: product.id,
                  slug: product.slug,
                  title: product.title,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  qty,
                })
              }
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}