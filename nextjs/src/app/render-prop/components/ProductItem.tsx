type Props = {
  id: string
  product: string
  price: number
  priceDiscounted?: number
  onAddToCart: (product: string) => void
}

function ProductItem({
  onAddToCart,
  product,
  id,
  priceDiscounted,
  price,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-4xl">📱</div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product}</h3>
        <p className="text-gray-600 text-sm mb-4">Product ID: {id}</p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            {priceDiscounted}
          </span>
          <span className="text-sm text-gray-500 line-through">{price}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(4)}
            {'☆'.repeat(1)}
          </div>
          <span className="text-sm text-gray-600 ml-2">(4.0)</span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductItem
