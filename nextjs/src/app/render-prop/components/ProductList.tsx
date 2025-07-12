import { memo, ReactNode } from 'react'

interface ProductListProps<TItem> {
  items: TItem[]
  renderItem: (item: TItem) => React.ReactNode
}

const ProductList = memo(
  <TItem,>({ items, renderItem }: ProductListProps<TItem>) => {
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: For simplicity, using index as key
          <div key={index} className="p-4 border rounded-lg">
            {renderItem(item)}
          </div>
        ))}
      </div>
    )
  }
) as <TItem>(props: ProductListProps<TItem>) => ReactNode

export default ProductList
