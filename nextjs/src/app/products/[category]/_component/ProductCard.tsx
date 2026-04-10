import type { Product } from '@/app/api/products/mock-data'

type Props = {
  product: Product
}

/**
 * Displays a single product card with name, price, rating, and an optional badge.
 */
export default function ProductCard({ product }: Props) {
  const stars = Math.round(product.rating)

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition hover:shadow-md">
      {product.badge && (
        <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}

      {/* Placeholder image */}
      <div className="flex h-40 items-center justify-center rounded-md bg-gray-100 text-4xl">
        🛍️
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-gray-800 leading-snug">
          {product.name}
        </h2>

        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          {'★'.repeat(stars)}
          {'☆'.repeat(5 - stars)}
          <span className="ml-1 text-xs text-gray-500">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <p className="text-lg font-bold text-gray-900">
          ฿{product.price.toLocaleString()}
        </p>
      </div>

      <button
        type="button"
        className="mt-auto w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}
