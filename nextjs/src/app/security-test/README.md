# Security Test Page - CodeQL Vulnerability Detection

⚠️ **WARNING**: This directory contains intentional security vulnerabilities for CodeQL testing purposes. **DO NOT** use these patterns in production code!

## Overview

This security test page was created to intentionally trigger GitHub CodeQL security scan findings. It demonstrates various common security vulnerabilities that CodeQL should detect and report.

## Files Created

### 1. `/src/app/security-test/page.tsx`
Main security test page with server-side vulnerabilities:
- XSS via `dangerouslySetInnerHTML`
- Code injection via `eval()`
- SQL injection patterns
- Unsafe dynamic imports
- ReDoS (Regular Expression Denial of Service)

### 2. `/src/app/security-test/client-vulnerabilities.tsx`
Client-side component with browser-specific vulnerabilities:
- XSS via DOM manipulation
- Unsafe `postMessage` handling
- SSRF via user-controlled fetch URLs
- Unsafe cookie operations
- Script injection
- localStorage vulnerabilities

### 3. `/src/app/api/unsafe-query/route.ts`
API route with server-side vulnerabilities:
- SQL injection in query construction
- Command injection patterns
- Path traversal vulnerabilities
- Information disclosure
- Unsafe deserialization
- Missing input validation

### 4. `/src/app/security-test/vulnerable-utils.ts`
Utility functions with security issues:
- Insufficient input sanitization
- Weak cryptographic implementations
- Unsafe JWT handling
- Prototype pollution vulnerabilities
- Hardcoded credentials

### 5. `/src/app/security-test/vulnerable-config.ts`
Configuration with security misconfigurations:
- Hardcoded secrets and API keys
- Insecure default settings
- Weak cryptographic configurations
- Overly permissive CORS settings
- Missing security headers

## Expected CodeQL Findings

The CodeQL security scanner should detect and report the following categories of vulnerabilities:

### High Severity
- **Cross-site Scripting (XSS)**: Multiple instances of unsafe HTML injection
- **Code Injection**: Use of `eval()` with user input
- **SQL Injection**: Direct query construction with user input
- **Command Injection**: Unsafe command construction
- **Path Traversal**: Unsafe file path construction

### Medium Severity
- **Information Disclosure**: Exposing sensitive server information
- **Unsafe Deserialization**: Parsing untrusted data
- **SSRF (Server-Side Request Forgery)**: User-controlled fetch URLs
- **Prototype Pollution**: Unsafe property access
- **ReDoS**: Catastrophic backtracking in regex

### Low Severity
- **Hardcoded Credentials**: API keys and secrets in code
- **Weak Cryptography**: Use of MD5, DES, and weak random generators
- **Missing Security Headers**: Insufficient security configurations
- **Insecure Defaults**: Overly permissive settings

## Usage

1. **Access the page**: Navigate to `/security-test` in your Next.js application
2. **Test vulnerabilities**: Use the interactive buttons to trigger various security issues
3. **Monitor CodeQL**: Push changes to GitHub to trigger CodeQL security scanning
4. **Review findings**: Check the GitHub Security tab for detected vulnerabilities

## Test Payloads

Try these payloads in the input fields to trigger vulnerabilities:

### XSS Payloads
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
```

### SQL Injection Payloads
```sql
' OR '1'='1
'; DROP TABLE users; --
' UNION SELECT * FROM admin_users --
```

### Code Injection Payloads
```javascript
alert('Code Injection')
fetch('/api/sensitive-data')
document.cookie
```

### Path Traversal Payloads
```
../../../etc/passwd
..\\..\\..\\windows\\system32\\config\\sam
../../../../app/config/secrets.json
```

## Development Notes

- The build process shows expected warnings about "Critical dependency" - this is intentional
- ESLint warnings are suppressed with `eslint-disable-line` comments where necessary
- All vulnerabilities are clearly marked with comments for CodeQL detection
- The page includes visual warnings about the security issues

## Security Recommendations

For production applications, always:
1. ✅ Sanitize all user input
2. ✅ Use parameterized queries
3. ✅ Validate file uploads
4. ✅ Implement proper CORS policies
5. ✅ Use strong cryptography
6. ✅ Never hardcode secrets
7. ✅ Implement security headers
8. ✅ Follow principle of least privilege

## CodeQL Integration

This page is designed to work with GitHub's CodeQL security scanning:
- Supports both JavaScript and TypeScript analysis
- Covers OWASP Top 10 vulnerabilities
- Includes both client-side and server-side issues
- Provides clear examples for security training

---

**Remember**: These vulnerabilities are intentional for testing purposes. Always follow security best practices in production code!
