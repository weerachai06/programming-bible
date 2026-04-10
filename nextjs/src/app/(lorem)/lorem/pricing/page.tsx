export const metadata = { title: 'Pricing' }

const PLANS = [
  {
    name: 'Starter',
    price: '$9',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    features: ['Ut enim ad minim veniam', 'Quis nostrud exercitation', 'Ullamco laboris nisi'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit.',
    features: ['Everything in Starter', 'Excepteur sint occaecat', 'Cupidatat non proident', 'Sunt in culpa officia'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur.',
    features: ['Everything in Pro', 'Neque porro quisquam', 'Dolorem ipsum quia dolor', 'Ut labore et dolore'],
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pricing</h1>
        <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlighted
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className={`mt-1 text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
              {plan.description}
            </p>
            <p className="mt-4 text-4xl font-bold">{plan.price}<span className="text-base font-normal">/mo</span></p>
            <ul className="mt-6 flex flex-col gap-2 text-sm flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-6 rounded-md py-2 text-sm font-medium transition ${
                plan.highlighted
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get started
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
