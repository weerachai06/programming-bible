'use client'

import Example from './Example'

const SearchShrinkPage = () => {
  return (
    <main className="min-h-screen bg-gray-800 transition-colors [--nav-height:6rem]">
      <Example />

      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-100 mt-8 mb-4">Products</h2>

        {/* Skeleton Loader */}
        <div className="flex flex-col gap-4">
          {[...Array(200)].map((_, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: for demo purposes only
              key={idx}
              className="animate-pulse flex space-x-4 bg-gray-700 dark:bg-gray-900 rounded p-4"
            >
              <div className="rounded bg-gray-600 dark:bg-gray-800 h-16 w-16" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-600 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-600 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default SearchShrinkPage
