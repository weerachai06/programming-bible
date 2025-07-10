import { FlatCompat } from "@eslint/eslintrc";
import jsdoc from "eslint-plugin-jsdoc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error", 
        { "argsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-namespace": "off",
      "prefer-const": "error",
      "no-var": "error"
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off"
    },
  },
  {
    files: ["src/examples/**/*.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off"
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'warn',
      'jsdoc/check-syntax': 'error',
      // 'jsdoc/check-tag-names': ['error', {
      //   definedTags: ['fileoverview', 'constant', 'description'],
      //   jsxTags: true
      // }],
      'jsdoc/check-types': 'warn',
      'jsdoc/no-undefined-types': 'warn',
      'jsdoc/valid-types': 'error'
    }
  }
];

export default eslintConfig;
