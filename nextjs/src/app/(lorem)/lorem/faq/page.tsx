export const metadata = { title: 'FAQ' }

const FAQS = [
  {
    q: 'Lorem ipsum dolor sit amet consectetur?',
    a: 'Adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.',
  },
  {
    q: 'Ut enim ad minim veniam quis nostrud?',
    a: 'Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  },
  {
    q: 'Duis aute irure dolor in reprehenderit?',
    a: 'In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.',
  },
  {
    q: 'Excepteur sint occaecat cupidatat non proident?',
    a: 'Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  },
  {
    q: 'Nemo enim ipsam voluptatem quia voluptas?',
    a: 'Sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.',
  },
  {
    q: 'Neque porro quisquam est qui dolorem?',
    a: 'Ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.',
  },
]

export default function FaqPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="flex flex-col gap-4">
        {FAQS.map(faq => (
          <details
            key={faq.q}
            className="rounded-lg border border-gray-200 bg-white px-5 py-4 open:shadow-sm"
          >
            <summary className="cursor-pointer font-medium text-gray-800 list-none flex justify-between items-center">
              {faq.q}
              <span className="ml-4 text-gray-400 text-lg">+</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
