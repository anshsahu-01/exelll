import { getProductById, getProducts } from '@/lib/services'
import { ProductGallery } from '@/components/listings/ProductGallery'
import { SellerInfo } from '@/components/listings/SellerInfo'
import { Heart, MapPin, Share2, AlertCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ListingCard } from '@/components/listings/ListingCard'
import { PageBackButton } from '@/components/ui/PageBackButton'
import { AddToCartButton } from '@/components/listings/AddToCartButton'
import { BuyNowButton, ListingActions } from '@/components/listings/ListingActions'
import { formatINR } from '@/lib/format'
import { auth } from '@clerk/nextjs/server'
import { getMe } from '@/lib/marketplace'

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

  const authObj = await auth()
  const token = await authObj.getToken()
  let currentUserId = null
  if (token) {
    try {
      const me = await getMe(token)
      currentUserId = me.id
    } catch (e) {}
  }

  const isOwner = currentUserId === listing.seller.id

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

      <nav className="mb-6 flex text-sm text-secondary">
        <span>Marketplace</span>
        <span className="mx-2">/</span>
        <span>{listing.category?.name || 'Uncategorized'}</span>
        <span className="mx-2">/</span>
        <span className="max-w-[200px] truncate text-primary">{listing.title}</span>
      </nav>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ProductGallery images={listing.images} title={listing.title} />
          <div className="rounded-xl border border-border-default bg-surface p-6">
            <h2 className="mb-4 text-xl font-bold text-primary">Description</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-secondary">{listing.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-tight text-primary">{listing.title}</h1>
              <button className="shrink-0 rounded-full p-2 text-secondary transition-colors hover:bg-surface-hover">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="text-3xl font-bold text-primary">{formatINR(listing.price)}</div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-surface-hover px-3 py-1 font-medium text-primary">
                {listing.condition}
              </span>
              <span className="rounded-full bg-surface-hover px-3 py-1 font-medium text-primary">
                {listing.category?.name || 'Uncategorized'}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-secondary">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Seller location</span>
            </div>
            <div className="text-sm text-secondary">Posted {timeAgo}</div>

            <div className="my-2 h-px bg-surface-hover" />

            <div className="flex flex-col gap-3">
              {isOwner ? (
                <div className="w-full text-center py-3 bg-surface-hover border border-border-default rounded-xl text-secondary font-medium">
                  This is your listing
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <AddToCartButton productId={listing.id} />
                  <BuyNowButton productId={listing.id} />
                </div>
              )}
              <ListingActions productId={listing.id} />
            </div>
          </div>

          <SellerInfo
            seller={listing.seller}
            productId={listing.id}
            hideContact={isOwner}
          />

          <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-hover p-4 text-sm text-secondary">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <p>
              Meet in person at a public campus location to exchange items. Never send money in advance.
            </p>
          </div>
        </div>
      </div>

      {relatedListings.length > 0 && (
        <div className="border-t border-border-default pt-8">
          <h2 className="mb-6 text-xl font-bold text-primary">More like this</h2>
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
