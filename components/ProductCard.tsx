"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { Cart } from "@/lib/cart";
import { toast } from "sonner";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const lowStock = product.inventory < 20;
  return (
    <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-3 right-3">
            <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-md">${product.price.toFixed(2)}</span>
          </div>
          {lowStock && (
            <div className="absolute top-3 left-3">
              <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">Low Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</span>
          <h3 className="font-semibold text-lg mt-1 mb-2 hover:text-primary transition-colors">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-accent" />
              <span className="font-medium">4.5</span>
              <span className="text-muted-foreground">(128)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{product.inventory} in stock</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-0 flex gap-2">
        <Button
          aria-label={`Add ${product.title} to cart`}
          onClick={() => {
            const existing = Cart.get().find((i) => i.productId === product.id);
            Cart.add({
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
              qty: 1,
            });
            if (existing) toast.success("Updated quantity in cart");
            else toast.success("Added to cart");
            window.dispatchEvent(new Event("cart-updated"));
          }}
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}