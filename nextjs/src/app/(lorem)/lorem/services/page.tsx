export const metadata = { title: 'Services' }

const SERVICES = [
  { icon: '⚡', title: 'Lorem Ipsum', description: 'Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { icon: '🔧', title: 'Ut Enim Minim', description: 'Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.' },
  { icon: '📊', title: 'Irure Dolor', description: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.' },
  { icon: '🚀', title: 'Cupidatat Proident', description: 'Sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus.' },
  { icon: '🔒', title: 'Nemo Enim Ipsam', description: 'Voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos.' },
  { icon: '💡', title: 'Neque Porro', description: 'Quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam.' },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <p className="mt-2 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(s => (
          <div key={s.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition">
            <div className="mb-3 text-3xl">{s.icon}</div>
            <h2 className="mb-2 text-lg font-semibold text-gray-800">{s.title}</h2>
            <p className="text-sm text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ut Enim Ad Minim?</h2>
        <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.</p>
        <button type="button" className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Consectetur Adipiscing
        </button>
      </div>
    </div>
  )
}
