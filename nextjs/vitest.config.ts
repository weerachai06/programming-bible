import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'test/**',
        '**/*.d.ts',
        '**/*.config.*',
        'public/**',
        'scripts/**',
        '.next/**',
        'docs/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      include: [
        'src/**/*.{ts,tsx,js,jsx}',
        // เอาให้รอด
        // 'src/components/Counter.tsx',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
