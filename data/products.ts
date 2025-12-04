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
};

const categories: Category[] = [
  "Electronics",
  "Accessories",
  "Home",
  "Fitness",
  "Footwear",
];

const brands = [
  "Acme",
  "NovaTech",
  "Zenith",
  "Orion",
  "Nimbus",
  "Apex",
  "TerraFit",
  "StrideCo",
  "HomeLux",
  "UrbanPeak",
];

function makeTypeName(category: Category, index: number) {
  const electronics = [
    "Wireless Mouse",
    "Mechanical Keyboard",
    "Bluetooth Headphones",
    "USB-C Hub",
    "Gaming Monitor",
    "Portable SSD",
    "HD Webcam",
    "Bluetooth Speaker",
    "LED Desk Lamp",
    "USB Microphone",
  ];
  const accessories = [
    "Travel Backpack",
    "Laptop Sleeve",
    "Leather Wallet",
    "Wrist Watch",
    "Sunglasses",
    "Phone Case",
    "Water Bottle",
    "Key Organizer",
    "Belt",
    "Cap",
  ];
  const home = [
    "Stainless Steel Kettle",
    "Chef Knife",
    "Ceramic Mug",
    "Cutting Board",
    "Frying Pan",
    "Coffee Maker",
    "Storage Container Set",
    "Bed Pillow",
    "Bath Towel",
    "Desk Organizer",
  ];
  const fitness = [
    "Yoga Mat",
    "Dumbbell Set",
    "Resistance Bands",
    "Foam Roller",
    "Jump Rope",
    "Fitness Tracker",
    "Protein Shaker",
    "Running Armband",
    "Exercise Ball",
    "Pull-Up Bar",
  ];
  const footwear = [
    "Running Shoes",
    "Hiking Boots",
    "Casual Sneakers",
    "Training Shoes",
    "Slip-on Loafers",
    "Sandals",
    "Trail Runners",
    "High-top Sneakers",
    "Walking Shoes",
    "Lightweight Trainers",
  ];
  const lists: Record<Category, string[]> = {
    Electronics: electronics,
    Accessories: accessories,
    Home: home,
    Fitness: fitness,
    Footwear: footwear,
  };
  const list = lists[category];
  return list[index % list.length];
}

function makeImage(category: Category, typeName: string, index: number) {
  const fmt = (url: string) => {
    if (!url.includes("images.unsplash.com")) return url;
    return url.includes("?") ? `${url}&auto=format&fit=crop` : `${url}?auto=format&fit=crop`;
  };
  const byType: Record<string, string[]> = {
    "Bluetooth Headphones": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    ],
    "Mechanical Keyboard": [
      "https://images.unsplash.com/photo-1515879218367-8466bb0a2638?w=800&q=80",
    ],
    "Wireless Mouse": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    ],
    "USB-C Hub": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    ],
    "Gaming Monitor": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    ],
    "Portable SSD": [
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=80",
    ],
    "HD Webcam": [
      "https://images.unsplash.com/photo-1518770660432-463222c0c8d0?w=800&q=80",
    ],
    "Bluetooth Speaker": [
      "https://images.unsplash.com/photo-1494232415701-1333f7f25324?w=800&q=80",
    ],
    "LED Desk Lamp": [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
    ],
    "USB Microphone": [
      "https://images.unsplash.com/photo-1496864133267-13d4f6e1ede8?w=800&q=80",
    ],

    "Travel Backpack": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    "Laptop Sleeve": [
      "https://images.unsplash.com/photo-1527689368864-3a2f3401fd77?w=800&q=80",
    ],
    "Leather Wallet": [
      "https://images.unsplash.com/photo-1542990253-0d0ccf2f8b18?w=800&q=80",
    ],
    "Wrist Watch": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
    "Sunglasses": [
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    ],
    "Phone Case": [
      "https://images.unsplash.com/photo-1552422535-8dcf03a733ab?w=800&q=80",
    ],
    "Water Bottle": [
      "https://images.unsplash.com/photo-1526401485004-2fda9f4f45f7?w=800&q=80",
    ],
    "Key Organizer": [
      "https://images.unsplash.com/photo-1567099162020-2a2b152d3c76?w=800&q=80",
    ],
    "Belt": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f6843?w=800&q=80",
    ],
    "Cap": [
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80",
    ],

    "Stainless Steel Kettle": [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    ],
    "Chef Knife": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    ],
    "Ceramic Mug": [
      "https://images.unsplash.com/photo-1517686467765-1393aac62f24?w=800&q=80",
    ],
    "Cutting Board": [
      "https://images.unsplash.com/photo-1486591978616-3307dcf11f5f?w=800&q=80",
    ],
    "Frying Pan": [
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&q=80",
    ],
    "Coffee Maker": [
      "https://images.unsplash.com/photo-1461988091159-192b6df7051b?w=800&q=80",
    ],
    "Storage Container Set": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    ],
    "Bed Pillow": [
      "https://images.unsplash.com/photo-1511436656642-2d01b0b48f00?w=800&q=80",
    ],
    "Bath Towel": [
      "https://images.unsplash.com/photo-1601134467661-93781b51a0fe?w=800&q=80",
    ],
    "Desk Organizer": [
      "https://images.unsplash.com/photo-1527430253228-e9368866bfbe?w=800&q=80",
    ],

    "Yoga Mat": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    "Dumbbell Set": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    "Resistance Bands": [
      "https://images.unsplash.com/photo-1549060278-b6ae9c7f02cd?w=800&q=80",
    ],
    "Foam Roller": [
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80",
    ],
    "Jump Rope": [
      "https://images.unsplash.com/photo-1549041885-8b34e6b8e4d1?w=800&q=80",
    ],
    "Fitness Tracker": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
    "Protein Shaker": [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    ],
    "Running Armband": [
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&q=80",
    ],
    "Exercise Ball": [
      "https://images.unsplash.com/photo-1598550881320-cdbe2f20828d?w=800&q=80",
    ],
    "Pull-Up Bar": [
      "https://images.unsplash.com/photo-1526401485004-2fda9f4f45f7?w=800&q=80",
    ],

    "Running Shoes": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Hiking Boots": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Casual Sneakers": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Training Shoes": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Slip-on Loafers": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Sandals": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Trail Runners": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "High-top Sneakers": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Walking Shoes": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    "Lightweight Trainers": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
  };
  const typeList = byType[typeName];
  if (typeList && typeList.length) return fmt(typeList[index % typeList.length]);
  const byCat: Record<Category, string[]> = {
    Electronics: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      "https://images.unsplash.com/photo-1515879218367-8466bb0a2638?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660432-463222c0c8d0?w=800&q=80",
    ],
    Accessories: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1527689368864-3a2f3401fd77?w=800&q=80",
      "https://images.unsplash.com/photo-1542990253-0d0ccf2f8b18?w=800&q=80",
    ],
    Home: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1517686467765-1393aac62f24?w=800&q=80",
      "https://images.unsplash.com/photo-1461988091159-192b6df7051b?w=800&q=80",
    ],
    Fitness: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1549060278-b6ae9c7f02cd?w=800&q=80",
    ],
    Footwear: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1528701800489-20f5cb56f42f?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
  };
  const list = byCat[category];
  return fmt(list[index % list.length]);
}

function makeSpecs(category: Category, brand: string, typeName: string): ProductSpec[] {
  switch (category) {
    case "Electronics":
      return [
        { key: "Brand", value: brand },
        { key: "Model", value: `${typeName.split(" ")[0]}-${100 + ((brand.length + typeName.length) % 50)}` },
        { key: "Warranty", value: "1 year" },
      ];
    case "Home":
      return [
        { key: "Brand", value: brand },
        { key: "Material", value: "Stainless steel" },
        { key: "Dimensions", value: "Standard" },
        { key: "Care", value: "Dishwasher safe" },
      ];
    case "Accessories":
      return [
        { key: "Brand", value: brand },
        { key: "Material", value: "Polyester" },
        { key: "Capacity", value: "20L" },
        { key: "Care", value: "Wipe clean" },
      ];
    case "Fitness":
      return [
        { key: "Brand", value: brand },
        { key: "Thickness", value: "6mm" },
        { key: "Grip", value: "Non-slip" },
        { key: "Durability", value: "High" },
      ];
    case "Footwear":
      return [
        { key: "Brand", value: brand },
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
  const index = id - 1;
  const brand = brands[index % brands.length];
  const typeName = makeTypeName(category, index);
  const title = `${brand} ${typeName}`;
  return {
    id,
    slug: `${toSlug(title)}-${id}`,
    title,
    description: `${title} crafted for everyday use and reliability in the ${category.toLowerCase()} category.`,
    specifications: makeSpecs(category, brand, typeName),
    price: Number((20 + (id % 10) * 7.5).toFixed(2)),
    imageUrl: makeImage(category, typeName, id),
    category,
    inventory: 10 + (id % 15),
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
  const lists = categories.map((cat) => allProducts.filter((p) => p.category === cat));
  const result: Product[] = [];
  let i = 0;
  while (result.length < limit) {
    let added = false;
    for (const list of lists) {
      if (i < list.length) {
        result.push(list[i]);
        added = true;
        if (result.length >= limit) break;
      }
    }
    if (!added) break;
    i++;
  }
  return result;
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
