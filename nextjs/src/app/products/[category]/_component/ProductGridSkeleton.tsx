/**
 * Loading skeleton shown while product data is being fetched.
 * Mirrors the ProductCard grid layout with animated placeholders.
 */
export default function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            i
          }`}
          className="animate-pulse flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xs"
        >
          <div className="h-40 rounded-md bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="mt-auto h-9 rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
