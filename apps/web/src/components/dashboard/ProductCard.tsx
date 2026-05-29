'use client';

import Link from 'next/link';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] || '';

  return (
    <Link href={`/products/${product.id}`} className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-48 bg-gray-100 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {product.isSold && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            SOLD
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{product.title}</h3>
        <p className="text-lg font-bold mt-1">₹{product.price}</p>
        <p className="text-xs text-gray-500 mt-1">{product.category?.name}</p>
        <p className="text-xs text-gray-400 mt-1">by {product.seller?.name}</p>
      </div>
    </Link>
  );
}
