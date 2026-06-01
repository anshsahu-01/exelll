'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Product } from '@/types'
import { toggleFavourite } from '@/lib/marketplace'
import { formatINR } from '@/lib/format'

export default function ProductCard({ product }: { product: Product }) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [isFavourite, setIsFavourite] = useState(product.isFavourite ?? false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    setIsFavourite(product.isFavourite ?? false)
  }, [product.isFavourite])

  const handleFavouriteToggle = async () => {
    const nextFavourite = !isFavourite
    setIsFavourite(nextFavourite)
    setIsToggling(true)
    const token = await getToken()
    try {
      const result = await toggleFavourite(product.id, token ?? undefined)
      setIsFavourite(result.favourited)
      window.dispatchEvent(new Event('favourites-updated'))
      router.refresh()
    } catch {
      setIsFavourite(product.isFavourite ?? false)
    } finally {
      setIsToggling(false)
    }
  }

  const imageUrl = product.images?.[0] || ''

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <button
          type="button"
          onClick={handleFavouriteToggle}
          disabled={isToggling}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition hover:scale-105"
          aria-label={isFavourite ? 'Remove favourite' : 'Add favourite'}
          title={isFavourite ? 'Remove favourite' : 'Add favourite'}
        >
          <Heart className={`h-4 w-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
        {product.isSold ? (
          <div className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
            SOLD
          </div>
        ) : null}
      </div>

      <Link href={`/listings/${product.id}`} className="block p-3">
        <h3 className="truncate text-sm font-semibold">{product.title}</h3>
        <p className="mt-1 text-lg font-bold">{formatINR(product.price)}</p>
        <p className="mt-1 text-xs text-gray-500">{product.category?.name}</p>
        <p className="mt-1 text-xs text-gray-400">by {product.seller?.name}</p>
      </Link>
    </div>
  )
}
