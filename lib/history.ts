export type ViewedItem = { slug: string; title: string; viewedAt: string };

const KEY = "ecom_history_v1";

function read(): ViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ViewedItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: ViewedItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(-50)));
}

export const History = {
  push(item: ViewedItem) {
    const items = read();
    items.push(item);
    write(items);
    return items;
  },
  get(): ViewedItem[] {
    return read();
  },
  clear() {
    write([]);
  },
};