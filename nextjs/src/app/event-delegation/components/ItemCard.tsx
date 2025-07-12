import type { Item } from './types'

interface ItemCardProps {
  item: Item
}

export const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all duration-200 ${
        item.status === 'active'
          ? 'bg-white border-gray-200'
          : 'bg-gray-100 border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{item.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-600">{item.category}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            data-action="view"
            data-item-id={item.id}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View
          </button>
          <button
            type="button"
            data-action="edit"
            data-item-id={item.id}
            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            data-action="toggle"
            data-item-id={item.id}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              item.status === 'active'
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            data-action="delete"
            data-item-id={item.id}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
