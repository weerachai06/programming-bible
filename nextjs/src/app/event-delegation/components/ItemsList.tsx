import { ItemCard } from './ItemCard'
import type { Item } from './types'

interface ItemsListProps {
  items: Item[]
  onListClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

export const ItemsList = ({ items, onListClick }: ItemsListProps) => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Event delegation demo - single handler pattern */}
      {/** biome-ignore lint/a11y/useSemanticElements: Event delegation demo */}
      <div
        className="space-y-3"
        onClick={onListClick}
        role="group"
        aria-label="Items list with event delegation"
      >
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
