// Vulnerable utility functions for security testing

// Hardcoded credentials - CodeQL should detect this
export const API_KEYS = {
  secret: 'sk_test_123456789',
  database: 'mongodb://admin:password@localhost:27017/myapp',
  jwt: 'super_secret_key_123'
}

// Simulated database for SQL injection testing
export const executeQuery = (query: string) => {
  // This simulates actual database execution
  console.log('Executing query:', query)
  return { query, executed: true }
}

// Unsafe HTML sanitization
export function unsafeHtmlSanitize(html: string): string {
  // Insufficient sanitization - CodeQL should flag this
  return html.replace(/<script>/g, '').replace(/<\/script>/g, '')
}

// Multiple SQL injection patterns
export function buildQuery(table: string, userInput: string): string {
  // Direct SQL injection vulnerability
  const query = `SELECT * FROM ${table} WHERE name = '${userInput}'`
  executeQuery(query) // Execute the vulnerable query
  return query
}

export function buildDeleteQuery(table: string, id: string): string {
  // SQL injection in DELETE statement
  const query = `DELETE FROM ${table} WHERE id = ${id}`
  executeQuery(query)
  return query
}

export function buildUpdateQuery(table: string, column: string, value: string, id: string): string {
  // SQL injection in UPDATE statement
  const query = `UPDATE ${table} SET ${column} = '${value}' WHERE id = ${id}`
  executeQuery(query)
  return query
}

export function buildInsertQuery(table: string, data: Record<string, string>): string {
  // SQL injection in INSERT statement
  const columns = Object.keys(data).join(', ')
  const values = Object.values(data).map(v => `'${v}'`).join(', ')
  const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`
  executeQuery(query)
  return query
}

// Dynamic query builder - very vulnerable
export function buildDynamicQuery(userQuery: string): string {
  // Direct execution of user input as SQL
  const query = userQuery
  executeQuery(query)
  return query
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
