'use client'
import { Button } from '@/features/shared/components'
import { useCallback, useState } from 'react'
import { ActivityLog, CodeExample, ItemsList, type Item } from './components'

const mockItems: Item[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][i % 5],
  status: i % 3 === 0 ? 'inactive' : 'active',
}))

export default function EventDelegationPage() {
  const [items, setItems] = useState<Item[]>(mockItems)
  const [log, setLog] = useState<string[]>([])
  const [_stupidLog, setCount] = useState<number>(0)

  const addToLog = useCallback((message: string) => {
    setLog(prev => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 9),
    ])
  }, [])

  // Event delegation handler - single handler for all buttons
  const handleListClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      const button = target.closest('button')
      if (!button) return

      const action = button.dataset.action
      const itemId = button.dataset.itemId
      const item = items.find(i => i.id === Number(itemId))

      if (action === 'clear-log') {
        return setLog([])
      }

      if (!item) return

      switch (action) {
        case 'toggle':
          setItems(prev =>
            prev.map(i =>
              i.id === item.id
                ? {
                    ...i,
                    status: i.status === 'active' ? 'inactive' : 'active',
                  }
                : i
            )
          )
          addToLog(
            `Toggled ${item.name} to ${item.status === 'active' ? 'inactive' : 'active'}`
          )
          break
        case 'delete':
          setItems(prev => prev.filter(i => i.id !== item.id))
          addToLog(`Deleted ${item.name}`)
          break
        case 'edit': {
          const newName = prompt('Enter new name:', item.name)
          if (newName) {
            setItems(prev =>
              prev.map(i => (i.id === item.id ? { ...i, name: newName } : i))
            )
            addToLog(`Renamed item to ${newName}`)
          }
          break
        }
        case 'view': {
          addToLog(`Viewed details for ${item.name}`)
          alert(
            `Item Details:\nID: ${item.id}\nName: ${item.name}\nCategory: ${item.category}\nStatus: ${item.status}`
          )
          break
        }
        default:
          console.warn(`Unknown action: ${action}`)
          addToLog(`Unknown action: ${action} for item ${item.name}`)
          break
      }
    },
    [items, addToLog]
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Event Delegation Demo
          </h1>
          <p className="text-gray-600 mb-4">
            Single event handler manages all button clicks using event
            delegation
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
            <p className="text-blue-700 text-sm">
              Instead of adding individual event handlers to each button, we use
              a single click handler on the parent container that identifies
              which button was clicked using event bubbling and data attributes.
            </p>
          </div>
        </div>

        {/** biome-ignore lint/a11y/noStaticElementInteractions: Example */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: For example */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          onClick={handleListClick}
        >
          <ItemsList items={items} />
          <ActivityLog logs={log} />
        </div>

        <Button
          className="mt-8"
          onClick={() => setCount(latestValue => latestValue + 1)}
        >
          Re-Render
        </Button>

        <CodeExample />
      </div>
    </div>
  )
}
