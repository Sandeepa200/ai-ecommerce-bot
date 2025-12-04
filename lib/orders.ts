export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
export type Order = {
  id: string; // e.g., ORD-1001
  email?: string; // guest tracking
  userId?: string; // clerk user id
  items: { slug: string; title: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const KEY = "ecom_orders_v1";

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export const Orders = {
  all() {
    return read();
  },
  create(order: Order) {
    const orders = read();
    orders.push(order);
    write(orders);
    return order;
  },
  findById(id: string) {
    return read().find((o) => o.id === id) || null;
  },
  findByEmail(email: string) {
    return read().filter((o) => o.email === email);
  },
  findByUser(userId: string) {
    return read().filter((o) => o.userId === userId);
  },
  updateStatus(id: string, status: OrderStatus) {
    const orders = read();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      write(orders);
      return orders[idx];
    }
    return null;
  },
};
