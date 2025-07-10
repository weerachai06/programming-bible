import { NextRequest, NextResponse } from 'next/server'

// Simulated database connection (vulnerable)
const db = {
  query: (sql: string) => {
    // This simulates actual database execution
    return { sql, results: [] }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    // SQL injection vulnerability - direct concatenation
    const unsafeQuery = `SELECT * FROM users WHERE username = '${query}'`
    
    // Simulate database execution - CodeQL should catch this
    const result = db.query(unsafeQuery)
    
    // Command injection vulnerability
    const command = `ls -la ${query}`
    
    // More SQL injection patterns
    const deleteQuery = `DELETE FROM users WHERE id = ${query}`
    const updateQuery = `UPDATE users SET password = '${query}' WHERE id = 1`
    
    // Execute multiple vulnerable queries
    const deleteResult = db.query(deleteQuery)
    const updateResult = db.query(updateQuery)
    
    // Information disclosure
    const response = {
      success: true,
      unsafeQuery,
      command,
      userInput: query,
      queryResult: result,
      deleteResult,
      updateResult,
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
  const table = searchParams.get('table') || 'users'
  
  // Multiple SQL injection vulnerabilities
  const selectQuery = `SELECT * FROM ${table} WHERE id = ${userId}`
  const countQuery = `SELECT COUNT(*) FROM ${table} WHERE status = '${searchParams.get('status')}'`
  const searchQuery = `SELECT * FROM ${table} WHERE name LIKE '%${searchParams.get('search')}%'`
  
  // Execute vulnerable queries
  const selectResult = db.query(selectQuery)
  const countResult = db.query(countQuery)
  const searchResult = db.query(searchQuery)
  
  // Path traversal vulnerability
  const filePath = `/app/data/${searchParams.get('file')}`
  
  // Command injection in GET
  const grepCommand = `grep -r "${searchParams.get('pattern')}" /var/log/`
  
  return NextResponse.json({
    selectQuery,
    countQuery,
    searchQuery,
    selectResult,
    countResult,
    searchResult,
    filePath,
    grepCommand,
    userId,
    // More information disclosure
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    method: request.method
  })
}
