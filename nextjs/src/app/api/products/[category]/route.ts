import { type NextRequest, NextResponse } from 'next/server'
import { fetchProductsByCategory } from '../mock-data'

/**
 * GET /api/products/[category]
 *
 * Returns mock products for the given category slug.
 * Simulates a real API with artificial latency built into the data layer.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params
  const result = await fetchProductsByCategory(category)

  if (!result) {
    return NextResponse.json(
      { error: `Category "${category}" not found` },
      { status: 404 },
    )
  }

  return NextResponse.json({
    data: result.products,
    meta: {
      category: result.meta,
      count: result.products.length,
      timestamp: new Date().toISOString(),
    },
  })
}
