'use client'

import { useState } from 'react'

interface CounterProps {
  initialValue?: number
  step?: number
}

/**
 * A simple counter component for testing purposes.
 *
 * @component
 * @param {CounterProps} props - Component props
 * @param {number} props.initialValue - Initial counter value (default: 0)
 * @param {number} props.step - Step value for increment/decrement (default: 1)
 * @returns {ReactElement} The rendered counter component
 *
 * @example
 * // Basic usage
 * <Counter />
 *
 * // With custom initial value and step
 * <Counter initialValue={10} step={5} />
 *
 * @since 1.0.0
 */
export default function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(prev => prev + step)
  const decrement = () => setCount(prev => prev - step)
  const reset = () => setCount(initialValue)

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Counter</h2>
      <div
        className="text-4xl font-mono font-bold text-blue-600"
        data-testid="counter-value"
      >
        {count}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          data-testid="decrement-btn"
        >
          -
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          data-testid="reset-btn"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          data-testid="increment-btn"
        >
          +
        </button>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Step: {step} | Initial: {initialValue}
      </div>
    </div>
  )
}
