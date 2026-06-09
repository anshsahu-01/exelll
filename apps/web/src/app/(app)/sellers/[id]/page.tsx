import { notFound } from 'next/navigation'
import { getSellerById } from '@/lib/services'
import { ListingCard } from '@/components/listings/ListingCard'
import { SoldProductCard } from '@/components/sellers/SoldProductCard'
import { User as UserIcon, Calendar, MessageCircle } from 'lucide-react'
import { ContactSellerButton } from '@/components/sellers/ContactSellerButton'
import { getMe } from '@/lib/marketplace'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export default async function SellerProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const sellerId = params.id
  let seller = null

  try {
    seller = await getSellerById(sellerId)
  } catch (err) {
    //
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

  if (!seller) {
    notFound()
  }

  const timeJoined = new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-surface border border-border-default rounded-2xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {seller.profileImage ? (
          <img
            src={seller.profileImage}
            alt={seller.name}
            className="w-32 h-32 rounded-full border-4 border-surface shadow-md object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-surface shadow-md bg-surface-hover flex items-center justify-center text-secondary">
            <UserIcon className="w-16 h-16" />
          </div>
        )}
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-primary">{seller.name}</h1>
          {seller.collegeName && (
            <p className="text-lg text-secondary mt-1">{seller.collegeName}</p>
          )}
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Member since {timeJoined}</span>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <a href="#active-listings" className="bg-surface-hover px-4 py-2 rounded-lg border border-border-default hover:border-primary transition-colors cursor-pointer">
              <span className="block text-xl font-bold text-primary">{seller.activeListings}</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Active Listings</span>
            </a>
            <a href="#sold-items" className="bg-surface-hover px-4 py-2 rounded-lg border border-border-default hover:border-primary transition-colors cursor-pointer">
              <span className="block text-xl font-bold text-primary">{seller.soldListings}</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Sold Items</span>
            </a>
            <div className="bg-surface-hover px-4 py-2 rounded-lg border border-border-default cursor-default">
              <span className="block text-xl font-bold text-primary">{seller.totalUploads}</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Total Uploads</span>
            </div>
          </div>
          
          <div className="mt-6">
            {currentUserId === seller.id ? (
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-surface-hover border border-border-default text-secondary text-sm font-medium">
                This is your profile
              </div>
            ) : (
              <ContactSellerButton 
                activeListingsCount={seller.activeListings} 
                mostRecentProductId={seller.activeProducts[0]?.id} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Active Listings Section */}
      <section id="active-listings" className="mb-12 scroll-mt-20">
        <div className="flex items-center justify-between mb-6 border-b border-border-default pb-4">
          <h2 className="text-2xl font-bold text-primary">Active Listings</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">{seller.activeListings}</span>
        </div>

        {seller.activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {seller.activeProducts.map((product) => (
              <ListingCard key={product.id} listing={{...product, seller}} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border-default rounded-xl p-10 text-center">
            <p className="text-secondary">This seller currently has no active listings.</p>
          </div>
        )}
      </section>

      {/* Sold Items Section */}
      <section id="sold-items" className="scroll-mt-20">
        <div className="flex items-center justify-between mb-6 border-b border-border-default pb-4">
          <h2 className="text-2xl font-bold text-primary">Previously Sold Items</h2>
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold">{seller.soldListings}</span>
        </div>

        {seller.soldProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {seller.soldProducts.map((product) => (
              <SoldProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border-default rounded-xl p-10 text-center">
            <p className="text-secondary">This seller hasn't sold any items yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
