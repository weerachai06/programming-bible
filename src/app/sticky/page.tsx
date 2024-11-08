"use client";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
}

export const dynamic = "force-dynamic";

const BlogCard = ({ title, date, excerpt }: Omit<BlogPost, "id">) => {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <time className="text-sm text-gray-500 mb-4 block">{date}</time>
      <p className="text-gray-700">{excerpt}</p>
      <button className="mt-4 text-blue-600 hover:text-blue-800">
        Read more
      </button>
    </article>
  );
};

const BlogList = () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      title: "Getting Started with React",
      date: "2024-03-20",
      excerpt:
        "Learn the basics of React and how to build your first component...",
    },
    {
      id: 2,
      title: "Understanding TypeScript",
      date: "2024-03-19",
      excerpt: "A comprehensive guide to TypeScript and its benefits...",
    },
    {
      id: 3,
      title: "Tailwind CSS Best Practices",
      date: "2024-03-18",
      excerpt: "Tips and tricks for using Tailwind CSS effectively...",
    },
    {
      id: 4,
      title: "Advanced React Hooks",
      date: "2024-03-17",
      excerpt: "Deep dive into React Hooks and custom hook patterns...",
    },
    {
      id: 5,
      title: "Responsive Design Patterns",
      date: "2024-03-16",
      excerpt: "Modern approaches to building responsive web layouts...",
    },
    {
      id: 6,
      title: "State Management in React",
      date: "2024-03-15",
      excerpt: "Comparing different state management solutions in React...",
    },
    {
      id: 7,
      title: "CSS Grid Layout",
      date: "2024-03-14",
      excerpt: "Mastering CSS Grid for complex layouts...",
    },
    {
      id: 8,
      title: "React Performance Tips",
      date: "2024-03-13",
      excerpt: "Optimize your React applications for better performance...",
    },
    {
      id: 9,
      title: "Modern JavaScript Features",
      date: "2024-03-12",
      excerpt: "Essential ES6+ features for modern web development...",
    },
    {
      id: 10,
      title: "Testing React Components",
      date: "2024-03-11",
      excerpt: "Best practices for testing React applications...",
    },
    {
      id: 11,
      title: "Web Accessibility",
      date: "2024-03-10",
      excerpt: "Making your React apps accessible to everyone...",
    },
    {
      id: 12,
      title: "React Server Components",
      date: "2024-03-09",
      excerpt: "Understanding the future of React with server components...",
    },
    {
      id: 13,
      title: "CSS Animation Tips",
      date: "2024-03-08",
      excerpt: "Creating smooth animations with CSS transitions...",
    },
    {
      id: 14,
      title: "React Design Patterns",
      date: "2024-03-07",
      excerpt: "Common design patterns for React applications...",
    },
    {
      id: 15,
      title: "GraphQL Basics",
      date: "2024-03-06",
      excerpt: "Introduction to GraphQL with React applications...",
    },
    {
      id: 16,
      title: "Next.js Development",
      date: "2024-03-05",
      excerpt: "Building production-ready apps with Next.js...",
    },
    {
      id: 17,
      title: "React Security",
      date: "2024-03-04",
      excerpt: "Security best practices for React applications...",
    },
    {
      id: 18,
      title: "Code Splitting",
      date: "2024-03-03",
      excerpt: "Optimizing bundle size with code splitting...",
    },
    {
      id: 19,
      title: "React Native Basics",
      date: "2024-03-02",
      excerpt: "Getting started with mobile development using React Native...",
    },
    {
      id: 20,
      title: "Version Control Tips",
      date: "2024-03-01",
      excerpt: "Advanced Git techniques for development teams...",
    },
  ];

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          title={post.title}
          date={post.date}
          excerpt={post.excerpt}
        />
      ))}
    </div>
  );
};

const HeaderSearch = () => {
  return (
    <div className="flex justify-between items-center mb-4 container mx-auto">
      <h1 className="text-xl font-bold">Logo</h1>
      <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="absolute right-3 top-2.5">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="col-span-2 bg-gray-800 text-white p-4 sticky top-0 c">
      <ul className="flex gap-4 container mx-auto">
        <li>
          <a href="#" className="hover:text-gray-300">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            About
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            Services
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-full min-h-0">
      <section className="sticky top-[calc(var(--header)+((164px+16px)*0)+16px)] bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li>React</li>
          <li>TypeScript</li>
          <li>CSS</li>
        </ul>
      </section>

      <section className="sticky top-[calc(var(--header)+((164px+16px)*1)+16px)] bg-white shadow-md rounded p-4 mt-10">
        <h2 className="text-xl font-bold mb-4">Tags</h2>
        <ul className="space-y-2">
          <li>React</li>
          <li>TypeScript</li>
          <li>CSS</li>
        </ul>
      </section>

      <section className="sticky top-[calc(var(--header)+((164px+16px)*2)+16px)] bg-white shadow-md rounded p-4 mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
        <ul className="space-y-2">
          <li>Getting Started with React</li>
          <li>Understanding TypeScript</li>
          <li>Tailwind CSS Best Practices</li>
        </ul>
      </section>
    </aside>
  );
};

const Page = () => {
  return (
    <div className="grid grid-cols-[1fr] grid-rows-[auto] min-h-screen bg-slate-100">
      <header className="bg-gray-800 text-white p-4 col-span-2">
        <HeaderSearch />
      </header>

      <Navigation />

      <div className="grid grid-cols-[300px_1fr] container mx-auto gap-8 mt-8">
        <Sidebar />

        <main className="bg-white p-6">
          <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
          <BlogList />
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 col-span-2">Footer</footer>
    </div>
  );
};

export default Page;
