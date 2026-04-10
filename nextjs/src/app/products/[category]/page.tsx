import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/app/api/products/mock-data'
import type { Product, CategoryMeta } from '@/app/api/products/mock-data'
import ProductCard from './_component/ProductCard'
import ProductGridSkeleton from './_component/ProductGridSkeleton'

type ApiResponse = {
  data: Product[]
  meta: {
    category: CategoryMeta
    count: number
    timestamp: string
  }
}

/**
 * Server component that fetches products for a given category from the mock API.
 * Uses Next.js fetch with cache tags for fine-grained revalidation.
 */
async function ProductGrid({ category }: { category: string }) {
  const res = await fetch(
    `http://localhost:3000/api/products/${category}`,
    {
      next: {
        tags: [`products-${category}`],
        revalidate: 60,
      },
    },
  )

  if (!res.ok) {
    notFound()
  }

  const json: ApiResponse = await res.json()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        {json.meta.count} products &middot; Last updated:{' '}
        {new Date(json.meta.timestamp).toLocaleString('th-TH')}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {json.data.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

type Props = {
  params: Promise<{ category: string }>
}

/**
 * Dynamic product category page — /products/[category]
 *
 * Demonstrates:
 * - Dynamic routing with async params (Next.js 15+)
 * - Suspense with a skeleton fallback while the mock API responds
 * - generateStaticParams for known categories
 */
export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const meta = CATEGORIES.find(c => c.slug === category)

  return {
    title: meta ? `${meta.label} — Products` : 'Products',
    description: meta?.description ?? 'Browse our product catalogue.',
  }
}

export default async function ProductCategoryPage({ params }: Props) {
  const { category } = await params
  const meta = CATEGORIES.find(c => c.slug === category)

  if (!meta) notFound()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{meta.label}</h1>
        <p className="mt-1 text-gray-500">{meta.description}</p>
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <Link
            key={c.slug}
            href={`/products/${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              c.slug === category
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Product grid with Suspense */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid category={category} />
      </Suspense>
    </div>
  )
}
