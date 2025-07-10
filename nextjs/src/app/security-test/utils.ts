// Vulnerable utility functions for security testing

// Hardcoded credentials - CodeQL should detect this
export const API_KEYS = {
  secret: 'sk_test_123456789',
  database: 'mongodb://admin:password@localhost:27017/myapp',
  jwt: 'super_secret_key_123'
}

// Unsafe HTML sanitization
export function unsafeHtmlSanitize(html: string): string {
  // Insufficient sanitization - CodeQL should flag this
  return html.replace(/<script>/g, '').replace(/<\/script>/g, '')
}

// Unsafe SQL query builder
export function buildQuery(table: string, userInput: string): string {
  // SQL injection vulnerability
  return `SELECT * FROM ${table} WHERE name = '${userInput}'`
}

// Unsafe file path construction
export function getFilePath(fileName: string): string {
  // Path traversal vulnerability
  return `/uploads/${fileName}`
}

// Weak password hashing
export function hashPassword(password: string): string {
  // Weak hashing - CodeQL should detect this
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i)
    hash = hash & hash
  }
  return hash.toString()
}

// Unsafe deserialization
export function deserializeUserData(data: string): any {
  // Unsafe eval usage
  return eval(`(${data})`) // eslint-disable-line no-eval
}

// Unsafe random token generation
export function generateToken(): string {
  // Weak random number generation
  return Math.random().toString(36).substring(2, 15)
}
