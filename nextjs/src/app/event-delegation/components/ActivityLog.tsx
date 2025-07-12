interface ActivityLogProps {
  log: string[]
  onClearLog: () => void
}

export const ActivityLog = ({ log, onClearLog }: ActivityLogProps) => {
  return (
    <div className="lg:col-span-1">
      <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {log.map((entry, index) => (
              <div
                key={`log-${Date.now()}-${index}`}
                className="p-2 bg-gray-50 rounded text-sm border-l-2 border-blue-500"
              >
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClearLog}
        className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Clear Log
      </button>
    </div>
  )
}
