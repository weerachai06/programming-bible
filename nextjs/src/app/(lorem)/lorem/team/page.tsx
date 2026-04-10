export const metadata = { title: 'Our Team' }

const MEMBERS = [
  { name: 'Lorem Ipsum', role: 'Chief Executive Officer', avatar: '🧑‍💼', bio: 'Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.' },
  { name: 'Dolor Sit Amet', role: 'Chief Technology Officer', avatar: '👩‍💻', bio: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.' },
  { name: 'Consectetur Elit', role: 'Head of Design', avatar: '🧑‍🎨', bio: 'Ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit.' },
  { name: 'Adipiscing Tempor', role: 'Head of Marketing', avatar: '👩‍📣', bio: 'Esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.' },
  { name: 'Incididunt Labore', role: 'Lead Engineer', avatar: '🧑‍🔧', bio: 'Sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis.' },
  { name: 'Dolore Magna', role: 'Product Manager', avatar: '👩‍🏫', bio: 'Iste natus error sit voluptatem accusantium doloremque laudantium nemo enim ipsam.' },
]

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
        <p className="mt-2 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map(m => (
          <div key={m.name} className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-xs">
            <div className="mb-3 text-5xl">{m.avatar}</div>
            <h2 className="text-lg font-semibold text-gray-800">{m.name}</h2>
            <p className="text-sm font-medium text-blue-600">{m.role}</p>
            <p className="mt-3 text-sm text-gray-500">{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
