'use client'
import { Button } from '@/features/shared/components'
import { useCallback, useState } from 'react'
import ProductItem from './ProductItem'
import ProductList from './ProductList'

const hashObject = (obj: object): string => {
  return btoa(JSON.stringify(obj)).replace(/[^a-zA-Z0-9]/g, '')
}

const mockProducts = [
  { sku: '0001', name: 'iPhone 15', price: 999, category: 'Electronics' },
  { sku: '0002', name: 'MacBook Pro', price: 2499, category: 'Electronics' },
  { sku: '0003', name: 'AirPods Pro', price: 249, category: 'Electronics' },
  { sku: '0004', name: 'Nike Air Max', price: 150, category: 'Footwear' },
  { sku: '0005', name: "Levi's Jeans", price: 89, category: 'Clothing' },
  { sku: '0006', name: 'Coffee Mug', price: 15, category: 'Home' },
  { sku: '0007', name: 'Wireless Charger', price: 35, category: 'Electronics' },
  { sku: '0008', name: 'Running Shoes', price: 120, category: 'Footwear' },
].map(product => ({
  ...product,
  key: hashObject({ sku: product.sku, name: product.name }),
}))

export const Demo = () => {
  const [_, setData] = useState(mockProducts)

  const handleAddToCart = useCallback((productName: string) => {
    alert(`Added ${productName} to cart!`)
  }, [])

  const renderProductItem = useCallback(
    (product: (typeof mockProducts)[number]) => (
      <ProductItem
        id={product.key}
        product={product.name}
        price={product.price}
        priceDiscounted={product.price * 0.8} // 20% discount
        onAddToCart={handleAddToCart}
      />
    ),
    [handleAddToCart]
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-600 mb-8">Discover our amazing products</p>

        <ProductList items={mockProducts} renderItem={renderProductItem} />
      </div>
      <Button onClick={() => setData([])}>Refresh Products</Button>
    </div>
  )
}
