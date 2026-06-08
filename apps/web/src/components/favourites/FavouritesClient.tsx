'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Loader2, Heart, ArrowRight } from 'lucide-react'
import { getMyFavourites, removeFavourite } from '@/lib/marketplace'
import { Favourite } from '@/types'

export function FavouritesClient() {
  const { getToken } = useAuth()
  const [items, setItems] = useState<Favourite[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      setItems(await getMyFavourites(token ?? undefined))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    const refresh = () => {
      void load()
    }
    window.addEventListener('favourites-updated', refresh)
    return () => window.removeEventListener('favourites-updated', refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken])

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      const token = await getToken()
      await removeFavourite(productId, token ?? undefined)
      setItems((current) => current.filter((item) => item.productId !== productId))
      window.dispatchEvent(new Event('favourites-updated'))
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border-default bg-surface p-6">
          <div className="h-8 w-40 animate-pulse rounded-2xl bg-gray-200" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[1.75rem] border border-border-default bg-surface">
              <div className="h-52 animate-pulse bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-4/5 animate-pulse rounded-2xl bg-gray-200" />
                <div className="h-5 w-1/3 animate-pulse rounded-2xl bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-2xl bg-gray-200" />
                <div className="flex items-center justify-between gap-3">
                  <div className="h-10 flex-1 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-10 flex-1 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border-default bg-surface p-6">
        <h1 className="text-2xl font-semibold text-primary">Favourites</h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-border-default bg-surface p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover">
            <Heart className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-primary">No favourites yet</h2>
          <p className="mt-2 text-sm text-secondary">Tap the heart on any listing to save it here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[1.75rem] border border-border-default bg-surface">
              <div className="relative h-52 bg-surface-hover">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-secondary">No image</div>
                )}
                <div className="absolute right-3 top-3 rounded-full bg-surface/95 p-2 shadow-sm">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-primary">{item.product.title}</h3>
                <p className="mt-1 text-lg font-bold text-primary">₹{item.product.price}</p>
                <p className="mt-1 text-sm text-secondary">Seller: {item.product.seller.name}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => void handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:bg-surface-hover"
                  >
                    {removingId === item.productId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Remove
                  </button>
                  <Link
                    href={`/listings/${item.productId}`}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Open listing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
