import Counter from '@/components/Counter'

/**
 * Test demo page showcasing the Counter component.
 *
 * @function TestDemoPage
 * @returns {ReactElement} The test demo page
 *
 * @example
 * // Access at /test-demo
 *
 * @since 1.0.0
 */
export default function TestDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Unit Test Demo Page
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Default Counter */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Default Counter</h2>
          <Counter />
        </div>

        {/* Counter with custom initial value */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Initial Value: 100
          </h2>
          <Counter initialValue={100} />
        </div>

        {/* Counter with custom step */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Step: 10</h2>
          <Counter initialValue={0} step={10} />
        </div>

        {/* Counter with both custom values */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Initial: 50, Step: 5
          </h2>
          <Counter initialValue={50} step={5} />
        </div>

        {/* Negative initial value */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Negative Start</h2>
          <Counter initialValue={-10} step={3} />
        </div>

        {/* Large step value */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Big Steps</h2>
          <Counter initialValue={0} step={25} />
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          This page demonstrates the Counter component that is used in unit
          tests.
        </p>
        <p className="text-sm text-gray-500">
          Run <code className="bg-gray-100 px-2 py-1 rounded">pnpm test</code>{' '}
          to see the tests in action!
        </p>
      </div>
    </div>
  )
}
