export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
  qty: number;
};

const KEY = "ecom_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const Cart = {
  get(): CartItem[] {
    return read();
  },
  add(item: CartItem) {
    const items = read();
    const idx = items.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      items[idx].qty += item.qty;
    } else {
      items.push(item);
    }
    write(items);
    return items;
  },
  remove(productId: number) {
    const items = read().filter((i) => i.productId !== productId);
    write(items);
    return items;
  },
  setQty(productId: number, qty: number) {
    const items = read();
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      items[idx].qty = Math.max(1, qty);
      write(items);
    }
    return items;
  },
  clear() {
    write([]);
    return [];
  },
  subtotal() {
    return read().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
};