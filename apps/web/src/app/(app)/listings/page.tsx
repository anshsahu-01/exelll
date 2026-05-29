import { getProducts } from '@/lib/services'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchFilters } from '@/components/listings/SearchFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { PackageSearch, AlertTriangle } from 'lucide-react'

// Page is dynamically rendered due to searchParams
export const dynamic = 'force-dynamic';

export default async function ListingsPage() {
  let products = []
  let error = null

  try {
    const res = await getProducts()
    products = res.products
  } catch (err: any) {
    error = err.message || 'Failed to load products'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover items for sale from students around you
          </p>
        </div>
      </div>

      <SearchFilters />

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Oops, something went wrong"
          description={error}
        />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ListingCard key={product.id} listing={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No listings found"
          description="We couldn't find any items matching your current filters. Try adjusting your search criteria."
        />
      )}
    </div>
  )
}
