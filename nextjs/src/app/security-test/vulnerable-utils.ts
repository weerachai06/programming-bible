/**
 * Vulnerable Utility Functions - Contains intentional security vulnerabilities
 * 
 * WARNING: These functions contain intentional security vulnerabilities for testing purposes.
 * DO NOT use these patterns in production code!
 */

// VULNERABILITY 1: Unsafe HTML sanitization
export function unsafeHtmlSanitize(html: string): string {
  // CodeQL should flag this as insufficient HTML sanitization
  return html.replace(/<script>/g, '').replace(/<\/script>/g, '')
}

// VULNERABILITY 2: Unsafe URL validation
export function unsafeUrlValidation(url: string): boolean {
  // CodeQL should flag this as insufficient URL validation
  return url.startsWith('http://') || url.startsWith('https://')
}

// VULNERABILITY 3: Unsafe SQL query builder
export function buildUnsafeQuery(table: string, conditions: Record<string, any>): string {
  // CodeQL should flag this as SQL injection vulnerability
  const whereClause = Object.entries(conditions)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(' AND ')
  
  return `SELECT * FROM ${table} WHERE ${whereClause}`
}

// VULNERABILITY 4: Unsafe file path construction
export function buildUnsafeFilePath(userInput: string): string {
  // CodeQL should flag this as path traversal vulnerability
  return `/app/uploads/${userInput}`
}

// VULNERABILITY 5: Unsafe command construction
export function buildUnsafeCommand(userInput: string): string {
  // CodeQL should flag this as command injection vulnerability
  return `ls -la ${userInput}`
}

// VULNERABILITY 6: Unsafe regex construction
export function createUnsafeRegex(pattern: string): RegExp {
  // CodeQL should flag this as ReDoS vulnerability
  return new RegExp(`(${pattern})+`)
}

// VULNERABILITY 7: Unsafe deserialization
export function unsafeDeserialize(data: string): any {
  // CodeQL should flag this as unsafe deserialization
  return eval(`(${data})`) // eslint-disable-line no-eval
}

// VULNERABILITY 8: Unsafe template string construction
export function buildUnsafeTemplate(template: string, data: Record<string, any>): string {
  // CodeQL should flag this as template injection
  let result = template
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  return result
}

// VULNERABILITY 9: Unsafe dynamic property access
export function unsafePropertyAccess(obj: any, path: string): any {
  // CodeQL should flag this as prototype pollution vulnerability
  return path.split('.').reduce((current, prop) => {
    return current[prop]
  }, obj)
}

// VULNERABILITY 10: Unsafe cookie parser
export function parseUnsafeCookie(cookieString: string): Record<string, string> {
  // CodeQL should flag this as unsafe cookie parsing
  const cookies: Record<string, string> = {}
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      // Potential XSS if cookie values are not properly sanitized
      cookies[name] = decodeURIComponent(value)
    }
  })
  return cookies
}

// VULNERABILITY 11: Unsafe JWT implementation
export function unsafeJwtDecode(token: string): any {
  // CodeQL should flag this as unsafe JWT handling
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }
  
  // Missing signature verification - major security vulnerability
  const payload = parts[1]
  const decoded = atob(payload)
  return JSON.parse(decoded)
}

// VULNERABILITY 12: Unsafe password hashing
export function unsafePasswordHash(password: string): string {
  // CodeQL should flag this as weak password hashing
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

// VULNERABILITY 13: Unsafe XML parsing
export function parseUnsafeXML(xmlString: string): Document {
  // CodeQL should flag this as XXE vulnerability
  const parser = new DOMParser()
  return parser.parseFromString(xmlString, 'text/xml')
}

// VULNERABILITY 14: Unsafe random number generation
export function unsafeRandomToken(): string {
  // CodeQL should flag this as cryptographically weak random number generation
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// VULNERABILITY 15: Unsafe CORS configuration
export const unsafeCorsConfig = {
  origin: '*', // CodeQL should flag this as overly permissive CORS
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}

// VULNERABILITY 16: Unsafe encryption
export function unsafeEncrypt(data: string, key: string): string {
  // CodeQL should flag this as weak encryption
  let encrypted = ''
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return btoa(encrypted)
}

// VULNERABILITY 17: Unsafe input validation
export function validateInput(input: string): boolean {
  // CodeQL should flag this as insufficient input validation
  return input.length > 0 && input.length < 1000
}

// VULNERABILITY 18: Unsafe session management
export class UnsafeSessionManager {
  private sessions: Record<string, any> = {}
  
  createSession(userId: string): string {
    // CodeQL should flag this as predictable session ID
    const sessionId = `session_${Date.now()}_${userId}`
    this.sessions[sessionId] = { userId, createdAt: Date.now() }
    return sessionId
  }
  
  getSession(sessionId: string): any {
    // CodeQL should flag this as missing session validation
    return this.sessions[sessionId]
  }
}

// VULNERABILITY 19: Unsafe file upload validation
export function validateFileUpload(fileName: string): boolean {
  // CodeQL should flag this as insufficient file validation
  const allowedExtensions = ['.jpg', '.png', '.gif']
  return allowedExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

// VULNERABILITY 20: Unsafe API key exposure
export const unsafeApiKeys = {
  // CodeQL should flag these as hardcoded credentials
  googleApi: 'AIzaSyDemoKey123456789',
  stripeSecret: 'sk_test_demo_key_123456789',
  jwtSecret: 'super_secret_jwt_key_123',
  databaseUrl: 'mongodb://admin:password@localhost:27017/myapp'
}
