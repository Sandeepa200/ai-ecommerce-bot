"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cart, type CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Store, ShoppingCart, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const HeaderBar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(Cart.get());
    refresh();
    const onOpenCart = () => setCartOpen(true);
    window.addEventListener("open-cart", onOpenCart);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("open-cart", onOpenCart);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">ModernShop</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              onChange={(e) => {
                const detail = { q: e.target.value };
                window.dispatchEvent(new CustomEvent("search", { detail }));
              }}
              className="pl-9"
            />
          </div>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.reduce((s, i) => s + i.qty, 0) > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
                <SheetDescription>
                  {items.reduce((s, i) => s + i.qty, 0) === 0 ? "Your cart is empty" : `${items.reduce((s, i) => s + i.qty, 0)} item${items.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''} in cart`}
                </SheetDescription>
              </SheetHeader>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
                  <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
                  <p>Start shopping to add items</p>
                </div>
              ) : (
                <>
                  <div className="h-[calc(100vh-250px)] pr-4 mt-6 overflow-y-auto">
                    <div className="space-y-4">
                      {items.map((i) => (
                        <div key={i.productId} className="flex gap-4 p-4 rounded-lg border bg-card">
                          <div className="relative w-20 h-20">
                            <Image src={i.imageUrl} alt={i.title} fill className="object-cover rounded-md" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{i.title}</h4>
                              <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1" onClick={() => { setItems(Cart.remove(i.productId)); }}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm font-bold text-primary">${i.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => { Cart.setQty(i.productId, Math.max(1, i.qty - 1)); setItems(Cart.get()); }}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{i.qty}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => { Cart.setQty(i.productId, i.qty + 1); setItems(Cart.get()); }}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">${subtotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => { setCartOpen(false); window.location.href = '/checkout'; }}>
                        Checkout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;