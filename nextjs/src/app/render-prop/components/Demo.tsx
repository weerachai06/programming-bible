'use client'
import { Button } from '@/features/shared/components'
import { useCallback, useState } from 'react'
import ProductItem from './ProductItem'
import ProductList from './ProductList'

const hashObject = (obj: object): string => {
  return btoa(JSON.stringify(obj)).replace(/[^a-zA-Z0-9]/g, '')
}

const mockProducts = [
  { id: 1, name: 'iPhone 15', price: 999, category: 'Electronics' },
  { id: 2, name: 'MacBook Pro', price: 2499, category: 'Electronics' },
  { id: 3, name: 'AirPods Pro', price: 249, category: 'Electronics' },
  { id: 4, name: 'Nike Air Max', price: 150, category: 'Footwear' },
  { id: 5, name: "Levi's Jeans", price: 89, category: 'Clothing' },
  { id: 6, name: 'Coffee Mug', price: 15, category: 'Home' },
  { id: 7, name: 'Wireless Charger', price: 35, category: 'Electronics' },
  { id: 8, name: 'Running Shoes', price: 120, category: 'Footwear' },
].map(product => ({
  ...product,
  id: hashObject(product),
}))
console.log('Mock Products:', mockProducts)

export const Demo = () => {
  const [_, setData] = useState(mockProducts)

  const handleAddToCart = useCallback((productName: string) => {
    alert(`Added ${productName} to cart!`)
  }, [])

  const renderProductItem = useCallback(
    (product: (typeof mockProducts)[number]) => (
      <ProductItem
        id={product.id}
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
