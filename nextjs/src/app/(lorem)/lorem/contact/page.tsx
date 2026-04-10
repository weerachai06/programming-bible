export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">
            Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
          </p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li><span className="font-medium">Email:</span> lorem@ipsum.com</li>
            <li><span className="font-medium">Phone:</span> +1 (555) 000-0000</li>
            <li><span className="font-medium">Address:</span> 123 Lorem St, Ipsum City</li>
          </ul>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Lorem Ipsum" className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="lorem@ipsum.com" className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="message">Message</label>
            <textarea id="message" rows={4} placeholder="Consectetur adipiscing elit..." className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
