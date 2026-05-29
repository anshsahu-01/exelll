import { getProductById, getProducts } from '@/lib/services'
import { ProductGallery } from '@/components/listings/ProductGallery'
import { SellerInfo } from '@/components/listings/SellerInfo'
import { Heart, MapPin, Share2, AlertCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ListingCard } from '@/components/listings/ListingCard'

export const dynamic = 'force-dynamic';

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let listing = null
  let relatedListings = []
  
  try {
    listing = await getProductById(id)
    if (!listing) {
      notFound()
    }
    
    // Fetch related listings based on category
    const res = await getProducts({ categoryId: listing.categoryId, limit: 5 })
    relatedListings = res.products.filter((l) => l.id !== id).slice(0, 4)
  } catch (error) {
    console.error("Failed to fetch product", error)
    notFound()
  }

  const timeAgo = new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-6">
        <Link href="/listings" className="hover:text-black transition-colors">Marketplace</Link>
        <span className="mx-2">/</span>
        <span className="hover:text-black transition-colors cursor-pointer">{listing.category?.name || 'Uncategorized'}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Gallery & Description */}
        <div className="lg:col-span-2 space-y-8">
          <ProductGallery images={listing.images} title={listing.title} />
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right Column - Product Info, Actions & Seller */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{listing.title}</h1>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-3xl font-bold text-gray-900">${listing.price}</div>
            
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                {listing.condition}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                {listing.category?.name || 'Uncategorized'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Seller location</span>
            </div>
            <div className="text-sm text-gray-400">
              Posted {timeAgo}
            </div>

            <div className="h-px bg-gray-100 my-2" />

            <div className="flex flex-col gap-3 mt-2">
              <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Buy Now
              </button>
              <button className="w-full bg-white text-black border-2 border-gray-200 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:border-black transition-colors">
                <Heart className="w-5 h-5" />
                Add to Favourites
              </button>
            </div>
          </div>

          <SellerInfo seller={listing.seller} />

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-200">
            <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p>
              Meet in person at a public campus location to exchange items. Never send money in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Related Listings */}
      {relatedListings.length > 0 && (
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">More like this</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedListings.map((related) => (
              <ListingCard key={related.id} listing={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
