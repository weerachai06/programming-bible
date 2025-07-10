import { NextResponse } from 'next/server'

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  department: string
  isActive: boolean
  joinedDate: string
  lastActivity: string
}

const departments = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
]
const roles = ['Senior', 'Junior', 'Lead', 'Manager', 'Director', 'Intern']

const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = [
      'John',
      'Jane',
      'Mike',
      'Sarah',
      'David',
      'Lisa',
      'Tom',
      'Anna',
    ][Math.floor(Math.random() * 8)]
    const lastName = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
    ][Math.floor(Math.random() * 8)]
    const name = `${firstName} ${lastName}`

    return {
      id: i + 1,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(
        ' ',
        ''
      )}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      isActive: Math.random() > 0.2,
      joinedDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
      lastActivity: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '25')
  const delay = parseInt(searchParams.get('delay') || '0')

  // Simulate network delay
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  console.log(`🚀 API: Generating ${count} users with ${delay}ms delay`)

  return NextResponse.json(
    {
      data: generateMockUsers(count),
      meta: {
        timestamp: new Date().toISOString(),
        count,
        delay,
        cache: 'miss',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        'X-API-Type': 'users',
      },
    }
  )
}
