/**
 * JSDoc Configuration and Guidelines
 *
 * This file contains JSDoc configuration and linting rules to ensure
 * consistent documentation across the project.
 *
 * For JSDoc linting, we recommend using TypeScript's built-in JSDoc
 * validation combined with TypeDoc for documentation generation.
 */

/**
 * @fileoverview JSDoc linting configuration and rules
 * @author Your Name
 * @version 1.0.0
 */

// JSDoc Tags that should be used consistently across the project
const REQUIRED_JSDOC_TAGS = {
  // Functions and methods
  FUNCTIONS: [
    '@description', // Brief description of what the function does
    '@param', // Parameters with types and descriptions
    '@returns', // Return value type and description
    '@throws', // Exceptions that may be thrown
    '@example', // Usage examples
    '@since', // Version when added
  ],

  // Classes
  CLASSES: [
    '@description', // Brief description of the class
    '@example', // Usage examples
    '@since', // Version when added
  ],

  // Interfaces and Types
  INTERFACES: [
    '@description', // Brief description of the interface
    '@example', // Usage examples
    '@since', // Version when added
  ],

  // Constants and Variables
  CONSTANTS: [
    '@description', // Brief description
    '@readonly', // For constants
    '@since', // Version when added
  ],
}

// JSDoc formatting rules
const JSDOC_FORMATTING_RULES = {
  // Use proper capitalization
  USE_PROPER_CAPITALIZATION: true,

  // End descriptions with periods
  END_WITH_PERIOD: true,

  // Use consistent parameter descriptions
  PARAMETER_DESCRIPTIONS: {
    format: '@param {Type} paramName - Description of the parameter',
    required: true,
  },

  // Use consistent return descriptions
  RETURN_DESCRIPTIONS: {
    format: '@returns {Type} Description of the return value',
    required: true,
  },

  // Use consistent example formatting
  EXAMPLE_FORMATTING: {
    format: '@example\n// Example usage\nconst result = functionName(param);',
    required: true,
  },
}

// Export for use in other files
export { JSDOC_FORMATTING_RULES, REQUIRED_JSDOC_TAGS }
