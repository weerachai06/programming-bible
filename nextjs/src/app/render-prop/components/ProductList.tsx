import { memo, Key as ReactKey, ReactNode } from 'react'

type KeyProp = {
  key: ReactKey
}

interface ProductListProps<TItem extends KeyProp> {
  items: TItem[]
  renderItem: (item: TItem) => React.ReactNode
}

const ProductList = memo(
  <TItem extends KeyProp>({ items, renderItem }: ProductListProps<TItem>) => {
    return (
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.key} className="p-4 border rounded-lg">
            {renderItem(item)}
          </div>
        ))}
      </div>
    )
  }
) as <TItem extends KeyProp>(props: ProductListProps<TItem>) => ReactNode

export default ProductList
