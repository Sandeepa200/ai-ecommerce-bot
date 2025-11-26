"use client";
import Link from "next/link";
import ThemeToggler from "@/components/ThemeToggler";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Cart, type CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-xl font-semibold hover:text-primary transition-colors"
            >
              Ecom Support Bot
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            
            <ThemeToggler />
            <UserButton afterSignOutUrl="/" />
            <Button onClick={() => setCartOpen(true)}>Cart</Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        aria-hidden={!cartOpen}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Side Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 z-[70] h-full w-full md:w-[380px] bg-background shadow-xl border-l transform transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Your Cart</div>
          <button aria-label="Close cart" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-140px)]">
          {items.length === 0 && <p className="text-sm text-gray-600">Your cart is empty.</p>}
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between gap-3 border rounded p-2">
              <div className="flex-1">
                <div className="font-medium text-sm">{i.title}</div>
                <div className="text-xs text-gray-600">${i.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => { Cart.setQty(i.productId, Math.max(1, i.qty - 1)); setItems(Cart.get()); }}
                  aria-label={`Decrease quantity of ${i.title}`}
                >
                  -
                </button>
                <span className="w-6 text-center text-sm" aria-live="polite">{i.qty}</span>
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => { Cart.setQty(i.productId, i.qty + 1); setItems(Cart.get()); }}
                  aria-label={`Increase quantity of ${i.title}`}
                >
                  +
                </button>
              </div>
              <button
                className="text-xs underline"
                onClick={() => { Cart.remove(i.productId); setItems(Cart.get()); }}
                aria-label={`Remove ${i.title} from cart`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => { setCartOpen(false); window.location.href = '/checkout'; }}>Checkout</Button>
            <Button variant="outline" className="flex-1" onClick={() => { setCartOpen(false); window.location.href = '/cart'; }}>View Cart</Button>
          </div>
        </div>
      </aside>
    </header>
  );
};

export default HeaderBar;