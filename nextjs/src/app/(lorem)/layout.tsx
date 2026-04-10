import Link from 'next/link'

const LOREM_PAGES = [
  { slug: 'about', label: 'About' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'pricing', label: 'Pricing' },
  { slug: 'services', label: 'Services' },
  { slug: 'team', label: 'Team' },
  { slug: 'terms', label: 'Terms' },
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'careers', label: 'Careers' },
]

export default function LoremLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 text-sm">
            <Link
              href="/"
              className="shrink-0 rounded px-3 py-1.5 font-semibold text-gray-800 hover:bg-gray-100"
            >
              ← Home
            </Link>
            <span className="text-gray-300">|</span>
            {LOREM_PAGES.map(page => (
              <Link
                key={page.slug}
                href={`/lorem/${page.slug}`}
                className="shrink-0 rounded px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl px-4 py-10">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        Lorem ipsum — mock content pages
      </footer>
    </div>
  )
}
