'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toggleFavourite } from '@/lib/marketplace'
import { formatINR } from '@/lib/format'

interface ListingCardProps {
  listing: Product
}

export function ListingCard({ listing }: ListingCardProps) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(listing.isFavourite ?? false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    setIsFavorite(listing.isFavourite ?? false)
  }, [listing.isFavourite])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !isFavorite
    setIsFavorite(next)
    setIsToggling(true)
    try {
      const token = await getToken()
      const result = await toggleFavourite(listing.id, token ?? undefined)
      setIsFavorite(result.favourited)
      window.dispatchEvent(new Event('favourites-updated'))
      router.refresh()
    } catch {
      setIsFavorite(listing.isFavourite ?? false)
    } finally {
      setIsToggling(false)
    }
  }

  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null
  const fallbackImage = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'
  const timeAgo = new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-surface rounded-xl border border-border-default overflow-hidden hover:shadow-md transition-all duration-300 relative"
    >
      <div className="aspect-[4/3] w-full relative bg-surface-hover overflow-hidden flex items-center justify-center">
        <img 
          src={imageUrl || fallbackImage} 
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={handleFavoriteClick}
          disabled={isToggling}
          className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-sm hover:bg-surface text-secondary hover:text-red-500 transition-colors z-10 shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-secondary'}`} 
          />
        </button>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md">
          <span className="text-xs font-medium text-white">{listing.condition}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-primary line-clamp-1">{listing.title}</h3>
          <span className="font-bold text-primary">{formatINR(listing.price)}</span>
        </div>
        
        <p className="text-sm text-secondary mb-4 line-clamp-1">{listing.category?.name || 'Uncategorized'}</p>
        
        <div className="mt-auto pt-3 border-t border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2">
            {listing.seller.profileImage ? (
              <img 
                src={listing.seller.profileImage} 
                alt={listing.seller.name} 
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-secondary">
                {listing.seller.name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-secondary">{listing.seller.name}</span>
          </div>
          <span className="text-xs text-secondary">{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}
