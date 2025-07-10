import { NextRequest, NextResponse } from 'next/server'

/**
 * Unsafe API Route - Contains intentional vulnerabilities for CodeQL testing
 * 
 * WARNING: This API route contains intentional security vulnerabilities for testing purposes.
 * DO NOT use these patterns in production code!
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    // VULNERABILITY 1: SQL injection - Direct query construction
    // CodeQL should flag this as SQL injection vulnerability
    const unsafeQuery = `SELECT * FROM users WHERE id = ${query}`
    
    // VULNERABILITY 2: Command injection simulation
    // CodeQL should flag this as command injection
    const command = `ls -la ${query}`
    
    // VULNERABILITY 3: Path traversal vulnerability
    // CodeQL should flag this as path traversal
    const filePath = `/tmp/uploads/${query}`
    
    // VULNERABILITY 4: Unsafe deserialization pattern
    // CodeQL should flag this as unsafe deserialization
    let deserializedData
    try {
      deserializedData = JSON.parse(query)
    } catch (error) {
      deserializedData = null
    }

    // VULNERABILITY 5: Information disclosure
    // CodeQL should flag this as information disclosure
    const response = {
      success: true,
      query: unsafeQuery,
      command: command,
      filePath: filePath,
      deserializedData: deserializedData,
      // Exposing sensitive server information
      env: process.env,
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd(),
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    // VULNERABILITY 6: Information disclosure via error messages
    // CodeQL should flag this as information disclosure
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (error as Error).message,
        stack: (error as Error).stack,
        // Exposing internal server details
        serverState: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          env: process.env
        }
      },
      { status: 500 }
    )
  }
}

// VULNERABILITY 7: Missing input validation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  // CodeQL should flag this as SQL injection
  const query = `SELECT * FROM users WHERE id = '${userId}'`
  
  // VULNERABILITY 8: Unsafe file operations
  // CodeQL should flag this as path traversal
  const fileName = searchParams.get('file')
  const filePath = `/app/data/${fileName}`
  
  return NextResponse.json({
    query,
    filePath,
    // Exposing system information
    system: {
      platform: process.platform,
      version: process.version,
      env: process.env
    }
  })
}

// VULNERABILITY 9: Unsafe HTTP methods
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tableName = searchParams.get('table')
  
  // CodeQL should flag this as SQL injection
  const deleteQuery = `DROP TABLE ${tableName}`
  
  return NextResponse.json({
    message: 'Table deletion attempted',
    query: deleteQuery
  })
}
