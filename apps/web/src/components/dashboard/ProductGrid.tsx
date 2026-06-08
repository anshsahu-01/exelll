'use client'

import { Product } from '@/types'
import ProductCard from './ProductCard'

// cols prop lets dashboard use a 2-column layout while listings uses more
export default function ProductGrid({
  products = [],
  cols = 3,
}: {
  products?: Product[]
  cols?: 2 | 3 | 4
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-sm font-medium">No products found</p>
      </div>
    )
  }

  const gridClass = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  }[cols]

  return (
    <div className={gridClass}>
      {products.map((product, index) => (
        <ProductCard key={product.id ?? index} product={product} />
      ))}
    </div>
  )
}
