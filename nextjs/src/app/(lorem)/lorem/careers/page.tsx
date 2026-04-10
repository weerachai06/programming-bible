export const metadata = { title: 'Careers' }

const JOBS = [
  { title: 'Lorem Ipsum Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Dolor Sit Designer', dept: 'Design', location: 'Ipsum City', type: 'Full-time' },
  { title: 'Amet Consectetur Manager', dept: 'Product', location: 'Remote', type: 'Full-time' },
  { title: 'Adipiscing Elit Analyst', dept: 'Data', location: 'Hybrid', type: 'Contract' },
  { title: 'Eiusmod Tempor Specialist', dept: 'Marketing', location: 'Remote', type: 'Part-time' },
]

export default function CareersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
        <p className="mt-2 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Join our team and help us build something great.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-100 p-6">
        <h2 className="text-xl font-semibold text-blue-900">Why Lorem Ipsum?</h2>
        <p className="mt-2 text-blue-700">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Open Positions</h2>
        {JOBS.map(job => (
          <div
            key={job.title}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-xs hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.dept} · {job.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {job.type}
              </span>
              <button type="button" className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
