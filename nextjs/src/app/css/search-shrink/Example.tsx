'use client'

import { cn } from '@/lib/utils'
import './search-shrink.css'

function Example() {
  return (
    <>
      {/* Application Icon */}
      <div
        className={cn(
          'text-2xl font-bold fixed',
          'transform',
          'top-[calc(var(--nav-height)*0.5)]',
          'animate-[fade-out-ja_0.5s_both_linear]',
          '[animation-timeline:scroll()]',
          '[animation-range:0_calc(var(--nav-height)*0.8)]',
          'logo'
        )}
      >
        <h1 className="text-3xl text-white">MyApp</h1>
      </div>

      <header
        className={cn(
          'container',
          'mx-auto',
          'flex justify-center items-center',
          'py-4',
          'text-gray-100',
          'sticky top-0 z-10',
          'h-[var(--nav-height)]',
          '[clip-path:inset(0_0_0_calc(100%_-_72px))]'
        )}
      >
        {/* Cart Icon */}
        <button
          type="button"
          aria-label="Cart"
          onClick={() => {}}
          className={cn('ml-auto', 'p-4', 'text-center')}
        >
          {/** biome-ignore lint/a11y/noSvgWithoutTitle: Example cart button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15a3 3 0 00-3-3m-12-8h15M5.106 5.106A2.25 2.25 0 016.001 4h12a2.25 2.25 0 012.243 2.106l-1.518 7.59A2.25 2.25 0 0116.98 14H5.106M14.25 17.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm5.508-10.542a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z"
            />
          </svg>
        </button>
      </header>

      {/* Search Wrapper */}
      <div
        className={cn(
          'bg-gray-800 container mx-auto',
          'flex flex-col justify-center',
          'z-5',
          'sticky top-0',
          'h-[var(--nav-height)]'
        )}
      >
        <input
          className={cn(
            'w-full px-4 py-2 rounded',
            ' text-gray-100 border',
            'border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary',
            'w-full',
            'relative',

            // shrink animation
            'animate-[shrink_1s_ease-in-out_both]',
            '[animation-timeline:scroll()]',
            '[animation-range:0_calc(var(--nav-height)*0.5)]'
          )}
          placeholder="Search..."
        />
      </div>
    </>
  )
}

export default Example
