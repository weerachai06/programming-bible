/**
 * Vulnerable Configuration - Contains intentional security misconfigurations
 * 
 * WARNING: This configuration contains intentional security vulnerabilities for testing purposes.
 * DO NOT use these patterns in production code!
 */

// VULNERABILITY 1: Hardcoded secrets
export const VULNERABLE_CONFIG = {
  // CodeQL should flag these as hardcoded credentials
  DATABASE_PASSWORD: 'admin123',
  JWT_SECRET: 'my_super_secret_key',
  API_KEY: 'sk_live_123456789abcdef',
  ENCRYPTION_KEY: 'hardcoded_encryption_key_123',
  ADMIN_PASSWORD: 'admin',
  
  // CodeQL should flag these as insecure configurations
  CORS_ORIGIN: '*',
  ALLOW_HTTP: true,
  DISABLE_CSRF: true,
  SKIP_AUTH: true,
  DEBUG_MODE: true,
  
  // CodeQL should flag these as information disclosure
  EXPOSE_STACK_TRACE: true,
  SHOW_DEBUG_INFO: true,
  LOG_SENSITIVE_DATA: true,
}

// VULNERABILITY 2: Insecure default settings
export const INSECURE_DEFAULTS = {
  // CodeQL should flag these as insecure defaults
  sessionTimeout: 0, // No session timeout
  passwordMinLength: 1, // Weak password requirement
  maxLoginAttempts: 999999, // No brute force protection
  requireHttps: false,
  enableSqlLogging: true,
  allowFileUploads: true,
  maxFileSize: Number.MAX_SAFE_INTEGER,
  allowedFileTypes: ['*'], // Allow all file types
  enableDirectoryListing: true,
}

// VULNERABILITY 3: Weak cryptographic settings
export const WEAK_CRYPTO_CONFIG = {
  // CodeQL should flag these as weak cryptographic settings
  hashAlgorithm: 'md5',
  encryptionAlgorithm: 'des',
  keyLength: 64, // Too short
  iterations: 1, // Too few iterations
  saltLength: 4, // Too short
  randomSeed: 12345, // Predictable seed
}

// VULNERABILITY 4: Unsafe database configuration
export const UNSAFE_DB_CONFIG = {
  // CodeQL should flag these as insecure database settings
  host: 'localhost',
  port: 27017,
  username: 'admin',
  password: 'password', // Hardcoded password
  database: 'myapp',
  ssl: false,
  authSource: 'admin',
  allowDiskUse: true,
  maxPoolSize: 1000,
  // CodeQL should flag this as SQL injection risk
  queryTimeout: 0, // No timeout
  enableQueryLogging: true,
  logSensitiveData: true,
}

// VULNERABILITY 5: Insecure HTTP headers
export const INSECURE_HEADERS = {
  // CodeQL should flag these as missing security headers
  'X-Frame-Options': 'ALLOWALL',
  'X-Content-Type-Options': 'none',
  'X-XSS-Protection': '0',
  'Strict-Transport-Security': 'max-age=0',
  'Content-Security-Policy': "default-src 'unsafe-inline' 'unsafe-eval' *",
  'Referrer-Policy': 'unsafe-url',
  'Permissions-Policy': 'geolocation=*, microphone=*, camera=*',
}

// VULNERABILITY 6: Exposed environment variables
export const EXPOSED_ENV_VARS = {
  // CodeQL should flag these as exposed sensitive information
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/myapp',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  API_KEYS: {
    stripe: process.env.STRIPE_SECRET_KEY || 'sk_test_fallback',
    google: process.env.GOOGLE_API_KEY || 'AIza_fallback',
    github: process.env.GITHUB_TOKEN || 'ghp_fallback',
  },
  ADMIN_CREDENTIALS: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  }
}

// VULNERABILITY 7: Unsafe middleware configuration
export const UNSAFE_MIDDLEWARE = {
  // CodeQL should flag these as insecure middleware settings
  bodyParser: {
    limit: '100mb', // Too large
    extended: true,
  },
  session: {
    secret: 'keyboard cat', // Weak secret
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Should be true in production
      httpOnly: false, // Should be true
      maxAge: 365 * 24 * 60 * 60 * 1000, // Too long
      sameSite: 'none', // Too permissive
    }
  },
  cors: {
    origin: '*', // Too permissive
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
  }
}

// VULNERABILITY 8: Insecure logging configuration
export const INSECURE_LOGGING = {
  // CodeQL should flag these as information disclosure risks
  level: 'debug',
  logPasswords: true,
  logApiKeys: true,
  logUserData: true,
  logSqlQueries: true,
  logStackTraces: true,
  logToConsole: true,
  logToFile: true,
  rotateDaily: false,
  maxFiles: 1000,
  maxSize: '100mb',
  format: 'json',
  includeMetadata: true,
  logRemoteAddr: true,
  logUserAgent: true,
  logReferer: true,
}

// VULNERABILITY 9: Unsafe file system permissions
export const UNSAFE_FILE_PERMISSIONS = {
  // CodeQL should flag these as insecure file permissions
  uploadDir: '/tmp/uploads',
  permissions: '0777', // Too permissive
  allowExecutable: true,
  allowSymlinks: true,
  allowHiddenFiles: true,
  maxFileSize: Number.MAX_SAFE_INTEGER,
  allowedMimeTypes: ['*/*'],
  scanForViruses: false,
  quarantineUploads: false,
}

// VULNERABILITY 10: Insecure network configuration
export const INSECURE_NETWORK = {
  // CodeQL should flag these as insecure network settings
  bindAddress: '0.0.0.0', // Binds to all interfaces
  port: 80, // Non-standard port
  enableHttp: true,
  enableHttps: false,
  httpsPort: 443,
  redirectToHttps: false,
  trustProxy: true,
  allowedIps: ['*'], // Allow all IPs
  rateLimiting: {
    enabled: false,
    maxRequests: 1000000,
    windowMs: 1,
  },
  ddosProtection: {
    enabled: false,
    maxConnections: 1000000,
    maxRequestsPerSecond: 1000000,
  }
}
