export type Category =
  | "Electronics"
  | "Accessories"
  | "Home"
  | "Fitness"
  | "Footwear";

export type ProductSpec = { key: string; value: string };

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  specifications: ProductSpec[];
  price: number;
  imageUrl: string;
  category: Category;
  inventory: number;
  featured?: boolean;
};

const categories: Category[] = [
  "Electronics",
  "Accessories",
  "Home",
  "Fitness",
  "Footwear",
];

function makeImage(category: Category, index: number) {
  const byCat: Record<Category, string[]> = {
    Electronics: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    ],
    Accessories: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    Home: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    ],
    Fitness: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    Footwear: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
  };
  const list = byCat[category];
  return list[index % list.length];
}

function makeSpecs(category: Category): ProductSpec[] {
  switch (category) {
    case "Electronics":
      return [
        { key: "Brand", value: "Acme" },
        { key: "Model", value: "X" },
        { key: "Warranty", value: "1 year" },
      ];
    case "Home":
      return [
        { key: "Material", value: "Stainless steel" },
        { key: "Dimensions", value: "Standard" },
        { key: "Care", value: "Dishwasher safe" },
      ];
    case "Accessories":
      return [
        { key: "Material", value: "Polyester" },
        { key: "Capacity", value: "20L" },
        { key: "Care", value: "Wipe clean" },
      ];
    case "Fitness":
      return [
        { key: "Thickness", value: "6mm" },
        { key: "Grip", value: "Non-slip" },
        { key: "Durability", value: "High" },
      ];
    case "Footwear":
      return [
        { key: "Use", value: "Running" },
        { key: "Cushioning", value: "Responsive" },
        { key: "Weight", value: "Light" },
      ];
  }
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeProduct(id: number, category: Category): Product {
  const title = `${category} Item ${id % 10 === 0 ? 10 : id % 10}`;
  return {
    id,
    slug: `${toSlug(category)}-${id}`,
    title,
    description: `High-quality ${category.toLowerCase()} product crafted for everyday use and reliability.`,
    specifications: makeSpecs(category),
    price: Number((20 + (id % 10) * 7.5).toFixed(2)),
    imageUrl: makeImage(category, id),
    category,
    inventory: 10 + (id % 15),
    featured: id % 10 === 1,
  };
}

const allProducts: Product[] = (() => {
  const items: Product[] = [];
  let id = 1;
  for (const cat of categories) {
    for (let i = 0; i < 10; i++) {
      items.push(makeProduct(id++, cat));
    }
  }
  return items;
})();

export function getProducts() {
  return allProducts;
}

export function getCategories() {
  return categories;
}

export function getFeaturedProducts(limit = 8) {
  const featured = allProducts.filter((p) => p.featured);
  return featured.length >= limit ? featured.slice(0, limit) : allProducts.slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return allProducts.find((p) => p.slug === slug) || null;
}

export function searchProducts(query: string, category?: Category) {
  const q = query.trim().toLowerCase();
  return allProducts.filter((p) => {
    const inCategory = category ? p.category === category : true;
    const text = `${p.title} ${p.description}`.toLowerCase();
    return inCategory && (q.length === 0 || text.includes(q));
  });
}