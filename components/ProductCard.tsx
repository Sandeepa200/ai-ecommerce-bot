"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { Cart } from "@/lib/cart";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="rounded-xl border bg-white/60 dark:bg-gray-800/60 p-4 shadow-sm">
      <Link href={`/products/${product.slug}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-48 w-full object-cover rounded-lg"
          loading="lazy"
        />
        <div className="mt-3">
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
          <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={() =>
            Cart.add({
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
              qty: 1,
            })
          }
        >
          Add to Cart
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/products/${product.slug}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}