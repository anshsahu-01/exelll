import { getProductById, getProducts } from '@/lib/services'
import { ProductGallery } from '@/components/listings/ProductGallery'
import { SellerInfo } from '@/components/listings/SellerInfo'
import { Heart, MapPin, Share2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ListingCard } from '@/components/listings/ListingCard'
import { PageBackButton } from '@/components/ui/PageBackButton'
import { AddToCartButton } from '@/components/listings/AddToCartButton'
import { formatINR } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let listing = null
  let relatedListings = []

  try {
    listing = await getProductById(id)
    if (!listing) {
      notFound()
    }

    const res = await getProducts({ categoryId: listing.categoryId, limit: 5 })
    relatedListings = res.products.filter((l) => l.id !== id).slice(0, 4)
  } catch (error) {
    console.error('Failed to fetch product', error)
    notFound()
  }

  const timeAgo = new Date(listing.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <PageBackButton href="/listings" label="Listings" />
      </div>

      <nav className="mb-6 flex text-sm text-gray-500">
        <span>Marketplace</span>
        <span className="mx-2">/</span>
        <span>{listing.category?.name || 'Uncategorized'}</span>
        <span className="mx-2">/</span>
        <span className="max-w-[200px] truncate text-gray-900">{listing.title}</span>
      </nav>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ProductGallery images={listing.images} title={listing.title} />
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Description</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{listing.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-tight text-gray-900">{listing.title}</h1>
              <button className="shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-900">{formatINR(listing.price)}</div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-800">
                {listing.condition}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-800">
                {listing.category?.name || 'Uncategorized'}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Seller location</span>
            </div>
            <div className="text-sm text-gray-400">Posted {timeAgo}</div>

            <div className="my-2 h-px bg-gray-100" />

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <AddToCartButton productId={listing.id} />
                <Link
                  href={`/checkout?productId=${listing.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white py-3 font-medium text-black transition-colors hover:border-black"
                >
                  Buy Now
                </Link>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 font-medium text-black transition-colors hover:border-black">
                <Heart className="h-5 w-5" />
                Add to Favourites
              </button>
            </div>
          </div>

          <SellerInfo
            seller={listing.seller}
            productId={listing.id}
          />

          <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
            <p>
              Meet in person at a public campus location to exchange items. Never send money in advance.
            </p>
          </div>
        </div>
      </div>

      {relatedListings.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">More like this</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedListings.map((related) => (
              <ListingCard key={related.id} listing={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
