import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-blue-500', 'bg-red-500')
    expect(result).toBe('text-blue-500 bg-red-500')
  })

  it('should handle conditional class names', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
    expect(result).toBe('base-class conditional-class')
  })

  it('should handle tailwind merge conflicts', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle undefined and null values', () => {
    const result = cn('valid-class', undefined, null, 'another-class')
    expect(result).toBe('valid-class another-class')
  })
})