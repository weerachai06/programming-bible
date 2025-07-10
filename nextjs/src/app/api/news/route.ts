import { NextResponse } from 'next/server'

export interface NewsArticle {
  id: number
  title: string
  summary: string
  content: string
  author: string
  category: string
  publishedAt: string
  readTime: number
  image: string
  tags: string[]
  views: number
  likes: number
}

const categories = [
  'Technology',
  'Business',
  'Science',
  'Sports',
  'Entertainment',
  'Health',
  'Politics',
  'Travel',
]
const authors = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Wilson',
  'David Brown',
  'Lisa Davis',
  'Tom Miller',
  'Anna Garcia',
]

const generateMockNews = (count: number): NewsArticle[] => {
  const techTitles = [
    'Revolutionary AI Breakthrough Changes Everything',
    'New Programming Language Takes Dev World by Storm',
    'Quantum Computing Reaches New Milestone',
    'Cybersecurity Threats Evolve in 2025',
    'Cloud Computing Trends to Watch',
  ]

  const businessTitles = [
    'Market Analysis: Tech Stocks Soar',
    'Startup Funding Reaches Record High',
    'Remote Work Culture Transformation',
    'Economic Forecast for Next Quarter',
    'Digital Transformation Success Stories',
  ]

  const allTitles = [...techTitles, ...businessTitles]

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const title =
      allTitles[Math.floor(Math.random() * allTitles.length)] +
      ` - Part ${i + 1}`
    const author = authors[Math.floor(Math.random() * authors.length)]

    return {
      id: i + 1,
      title,
      summary: `${title.slice(
        0,
        60
      )}... This comprehensive article explores the latest developments and their impact on the industry.`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
      author,
      category,
      publishedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      readTime: Math.floor(Math.random() * 10 + 2), // 2-12 minutes
      image: `https://picsum.photos/800/400?random=${i + 100}`,
      tags: [
        category.toLowerCase(),
        'trending',
        ...(Math.random() > 0.5 ? ['featured'] : []),
        ...(Math.random() > 0.7 ? ['breaking'] : []),
      ],
      views: Math.floor(Math.random() * 10000 + 100),
      likes: Math.floor(Math.random() * 500 + 10),
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '15')
  const category = searchParams.get('category')
  const delay = parseInt(searchParams.get('delay') || '800')

  // Simulate network delay
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  let articles = generateMockNews(count)

  // Filter by category if specified
  if (category) {
    articles = articles.filter(
      article => article.category.toLowerCase() === category.toLowerCase()
    )
  }

  console.log(
    `📰 API: Generating ${articles.length} news articles with ${delay}ms delay`
  )

  return NextResponse.json(
    {
      data: articles,
      meta: {
        timestamp: new Date().toISOString(),
        count: articles.length,
        delay,
        filter: category ? { category } : null,
        cache: 'miss',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60',
        'X-API-Type': 'news',
      },
    }
  )
}
