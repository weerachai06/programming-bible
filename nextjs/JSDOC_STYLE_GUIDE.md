# JSDoc Style Guide

This document outlines the JSDoc documentation standards for this project.

## General Guidelines

### 1. All public functions, classes, and modules must have JSDoc comments
### 2. Use proper grammar and spelling
### 3. Keep descriptions concise but comprehensive
### 4. Include examples for complex functions
### 5. Use consistent formatting

## JSDoc Tags

### Required Tags for Functions

```javascript
/**
 * Brief description of what the function does.
 * 
 * @param {Type} paramName - Description of the parameter
 * @returns {Type} Description of the return value
 * @throws {ErrorType} Description of when this error is thrown
 * @example
 * // Example usage
 * const result = functionName(parameter);
 * console.log(result); // Expected output
 * 
 * @since 1.0.0
 */
function functionName(paramName) {
  // Implementation
}
```

### Required Tags for Classes

```javascript
/**
 * Brief description of the class and its purpose.
 * 
 * @class
 * @example
 * // Example usage
 * const instance = new ClassName(options);
 * instance.method();
 * 
 * @since 1.0.0
 */
class ClassName {
  /**
   * Constructor description.
   * 
   * @param {Object} options - Configuration options
   * @param {string} options.name - The name property
   * @param {number} options.value - The value property
   */
  constructor(options) {
    // Implementation
  }
}
```

### Required Tags for Interfaces (TypeScript)

```typescript
/**
 * Brief description of the interface.
 * 
 * @interface
 * @example
 * // Example usage
 * const config: ConfigInterface = {
 *   name: 'example',
 *   value: 42
 * };
 * 
 * @since 1.0.0
 */
interface ConfigInterface {
  /** The name property */
  name: string;
  /** The value property */
  value: number;
}
```

### Required Tags for Constants

```javascript
/**
 * Brief description of the constant.
 * 
 * @constant
 * @type {string}
 * @default 'default-value'
 * @readonly
 * @since 1.0.0
 */
const CONSTANT_NAME = 'default-value';
```

## React Component Documentation

### Functional Components

```javascript
/**
 * Brief description of the component.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {ReactNode} props.children - Child elements
 * @param {Function} props.onClick - Click handler function
 * @returns {ReactElement} The rendered component
 * 
 * @example
 * // Example usage
 * <MyComponent 
 *   title="Hello World"
 *   onClick={() => console.log('clicked')}
 * >
 *   <p>Child content</p>
 * </MyComponent>
 * 
 * @since 1.0.0
 */
function MyComponent({ title, children, onClick }) {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Class Components

```javascript
/**
 * Brief description of the class component.
 * 
 * @component
 * @extends React.Component
 * @example
 * // Example usage
 * <MyClassComponent 
 *   initialCount={0}
 *   onCountChange={(count) => console.log(count)}
 * />
 * 
 * @since 1.0.0
 */
class MyClassComponent extends React.Component {
  /**
   * Component constructor.
   * 
   * @param {Object} props - Component props
   * @param {number} props.initialCount - Initial count value
   * @param {Function} props.onCountChange - Callback for count changes
   */
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }

  /**
   * Increment the count by one.
   * 
   * @method
   * @returns {void}
   */
  increment() {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  }
}
```

## API Route Documentation

```javascript
/**
 * Handle GET requests to fetch user data.
 * 
 * @async
 * @function GET
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with user data
 * @throws {Error} When user is not found
 * 
 * @example
 * // Example request
 * fetch('/api/users/123')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 * 
 * @since 1.0.0
 */
export async function GET(request) {
  // Implementation
}
```

## Custom Hooks Documentation

```javascript
/**
 * Custom hook for managing local storage state.
 * 
 * @hook
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function]} Tuple of [value, setValue]
 * 
 * @example
 * // Example usage
 * const [name, setName] = useLocalStorage('username', 'Anonymous');
 * 
 * @since 1.0.0
 */
function useLocalStorage(key, initialValue) {
  // Implementation
}
```

## Type Definitions

```typescript
/**
 * Configuration options for the API client.
 * 
 * @typedef {Object} ApiConfig
 * @property {string} baseUrl - The base URL for API requests
 * @property {string} apiKey - The API key for authentication
 * @property {number} timeout - Request timeout in milliseconds
 * @property {boolean} retryOnError - Whether to retry failed requests
 * 
 * @example
 * // Example configuration
 * const config: ApiConfig = {
 *   baseUrl: 'https://api.example.com',
 *   apiKey: 'your-api-key',
 *   timeout: 5000,
 *   retryOnError: true
 * };
 * 
 * @since 1.0.0
 */
```

## Validation Rules

### TypeScript JSDoc Validation

The project uses TypeScript's built-in JSDoc validation. Key rules:

1. **@param tags must match function parameters**
2. **@returns tag required for functions with return values**
3. **Type annotations must be valid TypeScript types**
4. **Examples must be syntactically correct**

### Custom Validation Script

You can create a validation script to check JSDoc consistency:

```javascript
// scripts/validate-jsdoc.js
/**
 * Validate JSDoc comments in the project.
 * 
 * @since 1.0.0
 */
const fs = require('fs');
const path = require('path');

// Implementation would check for:
// - Missing JSDoc on public functions
// - Invalid @param/@returns tags
// - Missing examples on complex functions
// - Inconsistent formatting
```

## Tools and Extensions

### Recommended VS Code Extensions

1. **TypeScript and JavaScript JSDoc**: Built-in VS Code support
2. **Document This**: Auto-generate JSDoc comments
3. **JSDoc Markdown**: Preview JSDoc as markdown

### Integration with TypeDoc

The project uses TypeDoc for documentation generation. Ensure your JSDoc comments are compatible with TypeDoc syntax.

### Biome Integration

While Biome doesn't have built-in JSDoc linting, you can use TypeScript's JSDoc validation alongside Biome for comprehensive code quality.

## Best Practices

1. **Write JSDoc before implementing the function**
2. **Update JSDoc when changing function signatures**
3. **Use meaningful parameter and return descriptions**
4. **Include realistic examples**
5. **Keep descriptions under 80 characters per line**
6. **Use proper English grammar and punctuation**
7. **Be consistent with tag ordering**
8. **Include version information with @since**

## Common Mistakes to Avoid

1. **Don't describe obvious things** (e.g., "Gets the name" for `getName()`)
2. **Don't use vague descriptions** (e.g., "Does something with data")
3. **Don't forget to update JSDoc when changing code**
4. **Don't mix JSDoc with regular comments**
5. **Don't use @param without type information**
