import { memo } from 'react'
import { ItemCard } from './ItemCard'
import type { Item } from './types'

interface ItemsListProps {
  items: Item[]
}

export const ItemsList = memo(({ items }: ItemsListProps) => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
      {/** biome-ignore lint/a11y/useSemanticElements: Event delegation demo */}
      <div
        className="space-y-3"
        role="group"
        aria-label="Items list with event delegation"
      >
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
})
