import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    // SQL injection vulnerability - unsafe query construction
    const unsafeQuery = `SELECT * FROM users WHERE username = '${query}'`
    
    // Command injection vulnerability
    const command = `ls -la ${query}`
    
    // Information disclosure
    const response = {
      success: true,
      unsafeQuery,
      command,
      userInput: query,
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
      },
      // Exposing environment variables
      environment: process.env.NODE_ENV
    }

    return NextResponse.json(response)
  } catch (error) {
    // Information disclosure through error messages
    return NextResponse.json(
      { 
        error: 'Server error',
        details: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  // SQL injection vulnerability
  const query = `SELECT * FROM users WHERE id = ${userId}`
  
  // Path traversal vulnerability
  const filePath = `/app/data/${searchParams.get('file')}`
  
  return NextResponse.json({
    query,
    filePath,
    userId
  })
}
