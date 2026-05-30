'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Loader2, PencilLine, Trash2, BadgeCheck, Edit3 } from 'lucide-react'
import { deleteListing, getMyProducts } from '@/lib/marketplace'
import { Product } from '@/types'

export function ProfileListingsClient() {
  const { getToken } = useAuth()
  const [active, setActive] = useState<Product[]>([])
  const [sold, setSold] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const token = await getToken()
    const data = await getMyProducts(token ?? undefined)
    setActive(data.active)
    setSold(data.sold)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const handleDelete = async (product: Product) => {
    const token = await getToken()
    await deleteListing(product.id, token ?? undefined)
    await load()
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Listings</h1>
          <Link href="/sell-item" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Create new
          </Link>
        </div>
        <ListingGroup title="Active" items={active} onDelete={handleDelete} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sold</h2>
        <ListingGroup title="Sold" items={sold} onDelete={handleDelete} sold />
      </section>
    </div>
  )
}

function ListingGroup({
  title,
  items,
  onDelete,
  sold = false,
}: {
  title: string
  items: Product[]
  onDelete: (product: Product) => void
  sold?: boolean
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No {title.toLowerCase()} listings yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((product) => (
        <article key={product.id} className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm">
          <div className="relative h-56 bg-gray-100">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            ) : null}
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
              {sold ? 'Sold' : product.status}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
              </div>
              {product.seller.isVerified ? <BadgeCheck className="h-5 w-5 text-emerald-600" /> : null}
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/sell-item?edit=${product.id}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => onDelete(product)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
