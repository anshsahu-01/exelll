'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { AlertCircle, Loader2, PencilLine, Trash2, BadgeCheck, Edit3, X } from 'lucide-react'
import { deleteListing, getMyProducts } from '@/lib/marketplace'
import { Product } from '@/types'

type Notice = { type: 'success' | 'error'; message: string } | null

export function ProfileListingsClient() {
  const { getToken } = useAuth()
  const [active, setActive] = useState<Product[]>([])
  const [sold, setSold] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<Notice>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setNotice(null)
    try {
      const token = await getToken()
      await deleteListing(deleteTarget.id, token ?? undefined)
      setNotice({ type: 'success', message: 'Listing deleted successfully.' })
      setDeleteTarget(null)
      await load()
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not delete listing.',
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link href="/sell-item" className="text-sm font-medium text-gray-500 transition hover:text-gray-950">
          Create new
        </Link>
      </div>

      {notice ? (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice.message}</p>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Listings</h1>
        </div>
        <ListingGroup title="Active" items={active} onDelete={setDeleteTarget} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sold</h2>
        <ListingGroup title="Sold" items={sold} onDelete={setDeleteTarget} sold />
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-950">Delete listing?</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  This listing will be permanently removed from the marketplace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gray-100">
                {deleteTarget.images[0] ? (
                  <Image src={deleteTarget.images[0]} alt={deleteTarget.title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950">{deleteTarget.title}</p>
                <p className="truncate text-sm text-gray-500">{deleteTarget.category.name}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {deleting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
