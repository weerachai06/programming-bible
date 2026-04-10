export const metadata = { title: 'Blog' }

const POSTS = [
  { title: 'Lorem Ipsum Dolor Sit Amet', date: 'Jan 12, 2026', excerpt: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.' },
  { title: 'Ut Enim Ad Minim Veniam', date: 'Feb 3, 2026', excerpt: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.' },
  { title: 'Duis Aute Irure Dolor', date: 'Feb 18, 2026', excerpt: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.' },
  { title: 'Excepteur Sint Occaecat', date: 'Mar 5, 2026', excerpt: 'Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis.' },
  { title: 'Nemo Enim Ipsam Voluptatem', date: 'Mar 22, 2026', excerpt: 'Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.' },
]

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="flex flex-col gap-6">
        {POSTS.map(post => (
          <article
            key={post.title}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-xs"
          >
            <p className="mb-1 text-xs text-gray-400">{post.date}</p>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <button type="button" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
              Read more →
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
