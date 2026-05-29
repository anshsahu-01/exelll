'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types'

interface ListingCardProps {
  listing: Product
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null
  const fallbackImage = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'
  const timeAgo = new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 relative"
    >
      <div className="aspect-[4/3] w-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
        <img 
          src={imageUrl || fallbackImage} 
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500 transition-colors z-10 shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </button>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md">
          <span className="text-xs font-medium text-white">{listing.condition}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
          <span className="font-bold text-gray-900">${listing.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{listing.category?.name || 'Uncategorized'}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {listing.seller.profileImage ? (
              <img 
                src={listing.seller.profileImage} 
                alt={listing.seller.name} 
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                {listing.seller.name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-gray-700">{listing.seller.name}</span>
          </div>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}
