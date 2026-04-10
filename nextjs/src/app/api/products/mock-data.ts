/**
 * Mock data for product categories.
 * Simulates a database of products grouped by category slug.
 */

export type Product = {
  id: string
  name: string
  price: number
  rating: number
  reviewCount: number
  image: string
  badge?: string
}

export type CategoryMeta = {
  slug: string
  label: string
  description: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'electronics',
    label: 'Electronics',
    description: 'Latest gadgets, devices, and tech accessories.',
  },
  {
    slug: 'clothing',
    label: 'Clothing',
    description: 'Trendy apparel for every occasion.',
  },
  {
    slug: 'books',
    label: 'Books',
    description: 'Bestsellers, textbooks, and hidden gems.',
  },
  {
    slug: 'home',
    label: 'Home & Living',
    description: 'Furniture, decor, and everyday essentials.',
  },
]

const MOCK_PRODUCTS: Record<string, Product[]> = {
  electronics: [
    { id: 'e1', name: 'Wireless Noise-Cancelling Headphones', price: 2990, rating: 4.8, reviewCount: 1243, image: '/placeholder-product.png', badge: 'Best Seller' },
    { id: 'e2', name: 'Mechanical Keyboard TKL', price: 1490, rating: 4.6, reviewCount: 872, image: '/placeholder-product.png' },
    { id: 'e3', name: '4K Ultra-Slim Monitor 27"', price: 9900, rating: 4.7, reviewCount: 534, image: '/placeholder-product.png', badge: 'New' },
    { id: 'e4', name: 'USB-C Hub 10-in-1', price: 890, rating: 4.5, reviewCount: 2105, image: '/placeholder-product.png' },
    { id: 'e5', name: 'Portable SSD 1TB', price: 2490, rating: 4.9, reviewCount: 689, image: '/placeholder-product.png', badge: 'Top Rated' },
    { id: 'e6', name: 'Webcam 4K Autofocus', price: 1990, rating: 4.4, reviewCount: 318, image: '/placeholder-product.png' },
  ],
  clothing: [
    { id: 'c1', name: 'Classic Fit Oxford Shirt', price: 790, rating: 4.5, reviewCount: 432, image: '/placeholder-product.png' },
    { id: 'c2', name: 'Slim Chino Pants', price: 990, rating: 4.3, reviewCount: 287, image: '/placeholder-product.png', badge: 'New' },
    { id: 'c3', name: 'Merino Wool Sweater', price: 1490, rating: 4.7, reviewCount: 198, image: '/placeholder-product.png', badge: 'Best Seller' },
    { id: 'c4', name: 'Running Shorts Pro', price: 590, rating: 4.6, reviewCount: 763, image: '/placeholder-product.png' },
    { id: 'c5', name: 'Waterproof Jacket', price: 2990, rating: 4.8, reviewCount: 521, image: '/placeholder-product.png', badge: 'Top Rated' },
    { id: 'c6', name: 'Casual Linen Tee', price: 390, rating: 4.2, reviewCount: 145, image: '/placeholder-product.png' },
  ],
  books: [
    { id: 'b1', name: 'Clean Code', price: 590, rating: 4.9, reviewCount: 3210, image: '/placeholder-product.png', badge: 'Best Seller' },
    { id: 'b2', name: 'The Pragmatic Programmer', price: 620, rating: 4.8, reviewCount: 2187, image: '/placeholder-product.png' },
    { id: 'b3', name: 'Designing Data-Intensive Applications', price: 750, rating: 4.9, reviewCount: 1854, image: '/placeholder-product.png', badge: 'Top Rated' },
    { id: 'b4', name: 'System Design Interview', price: 490, rating: 4.7, reviewCount: 1432, image: '/placeholder-product.png' },
    { id: 'b5', name: 'You Don\'t Know JS', price: 420, rating: 4.6, reviewCount: 978, image: '/placeholder-product.png' },
    { id: 'b6', name: 'Atomic Habits', price: 350, rating: 4.8, reviewCount: 5621, image: '/placeholder-product.png', badge: 'New' },
  ],
  home: [
    { id: 'h1', name: 'Bamboo Desk Organizer', price: 490, rating: 4.5, reviewCount: 234, image: '/placeholder-product.png' },
    { id: 'h2', name: 'Smart LED Floor Lamp', price: 1990, rating: 4.6, reviewCount: 412, image: '/placeholder-product.png', badge: 'New' },
    { id: 'h3', name: 'Linen Duvet Cover Set', price: 1490, rating: 4.7, reviewCount: 318, image: '/placeholder-product.png', badge: 'Best Seller' },
    { id: 'h4', name: 'Pour-Over Coffee Set', price: 890, rating: 4.8, reviewCount: 765, image: '/placeholder-product.png', badge: 'Top Rated' },
    { id: 'h5', name: 'Ceramic Planter Set (3pcs)', price: 690, rating: 4.4, reviewCount: 189, image: '/placeholder-product.png' },
    { id: 'h6', name: 'Weighted Blanket 7kg', price: 1290, rating: 4.9, reviewCount: 543, image: '/placeholder-product.png' },
  ],
}

/**
 * Simulates an async API call with artificial latency.
 * @param category - The product category slug to fetch
 * @returns Products for the given category, or null if not found
 */
export async function fetchProductsByCategory(
  category: string,
): Promise<{ products: Product[]; meta: CategoryMeta } | null> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600))

  const meta = CATEGORIES.find(c => c.slug === category)
  const products = MOCK_PRODUCTS[category]

  if (!meta || !products) return null

  return { products, meta }
}
