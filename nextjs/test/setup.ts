import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

// extends Vitest's expect
expect.extend(matchers)

// cleanup after each test case
afterEach(() => {
  cleanup()
})
