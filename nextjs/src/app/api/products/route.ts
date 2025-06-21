import { NextResponse } from "next/server";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: string;
}

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
];
const productPrefixes = [
  "Ultra",
  "Pro",
  "Smart",
  "Premium",
  "Eco",
  "Advanced",
  "Compact",
  "Deluxe",
];
const productTypes = [
  "Phone",
  "Laptop",
  "Headphones",
  "Watch",
  "Camera",
  "Tablet",
  "Speaker",
  "Monitor",
];

const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const prefix =
      productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
    const name = `${prefix} ${type} ${i + 1}`;

    return {
      id: i + 1,
      name,
      description: `High-quality ${type.toLowerCase()} with advanced features and premium build quality.`,
      price: Math.floor(Math.random() * 2000 + 50),
      currency: "USD",
      category,
      image: `https://picsum.photos/400/300?random=${i + 1}`,
      inStock: Math.random() > 0.15,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      reviews: Math.floor(Math.random() * 500 + 10),
      tags: [
        category.toLowerCase(),
        prefix.toLowerCase(),
        type.toLowerCase(),
        ...(Math.random() > 0.5 ? ["featured"] : []),
        ...(Math.random() > 0.7 ? ["bestseller"] : []),
      ],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get("count") || "20");
  const category = searchParams.get("category");
  const delay = parseInt(searchParams.get("delay") || "500");

  // Simulate network delay
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  let products = generateMockProducts(count);

  // Filter by category if specified
  if (category) {
    products = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  console.log(
    `🛍️ API: Generating ${products.length} products with ${delay}ms delay`
  );

  return NextResponse.json(
    {
      data: products,
      meta: {
        timestamp: new Date().toISOString(),
        count: products.length,
        delay,
        filter: category ? { category } : null,
        cache: "miss",
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-API-Type": "products",
      },
    }
  );
}
