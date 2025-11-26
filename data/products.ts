export type Category =
  | "Electronics"
  | "Home & Kitchen"
  | "Fashion"
  | "Sports & Outdoors"
  | "Beauty & Personal Care";

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
  "Home & Kitchen",
  "Fashion",
  "Sports & Outdoors",
  "Beauty & Personal Care",
];

function makeImage(id: number) {
  return `https://picsum.photos/seed/ecom-${id}/800/800`;
}

function makeSpecs(category: Category): ProductSpec[] {
  switch (category) {
    case "Electronics":
      return [
        { key: "Brand", value: "Acme" },
        { key: "Model", value: "X" },
        { key: "Warranty", value: "1 year" },
      ];
    case "Home & Kitchen":
      return [
        { key: "Material", value: "Stainless steel" },
        { key: "Dimensions", value: "Standard" },
        { key: "Care", value: "Dishwasher safe" },
      ];
    case "Fashion":
      return [
        { key: "Material", value: "Cotton" },
        { key: "Fit", value: "Regular" },
        { key: "Care", value: "Machine wash cold" },
      ];
    case "Sports & Outdoors":
      return [
        { key: "Use", value: "Outdoor" },
        { key: "Weight", value: "Light" },
        { key: "Durability", value: "High" },
      ];
    case "Beauty & Personal Care":
      return [
        { key: "Skin Type", value: "All" },
        { key: "Volume", value: "100 ml" },
        { key: "Dermatology Tested", value: "Yes" },
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
    imageUrl: makeImage(id),
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