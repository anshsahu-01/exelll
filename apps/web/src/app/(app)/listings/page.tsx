import { getProducts, getCategories } from '@/lib/services'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchFilters } from '@/components/listings/SearchFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { PackageSearch, AlertTriangle } from 'lucide-react'
import { ProductFilters } from '@/types'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  // Build real filters from URL search params
  const filters: ProductFilters = {
    search: typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined,
    categoryId: typeof resolvedSearchParams.categoryId === 'string' ? resolvedSearchParams.categoryId : undefined,
    condition: typeof resolvedSearchParams.condition === 'string' ? resolvedSearchParams.condition : undefined,
    sort: (typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'latest') as ProductFilters['sort'],
    page: typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1,
    limit: 24,
  }

  let products = []
  let error = null
  let categories = []

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(filters),
      getCategories(),
    ])
    products = productsRes.products
    categories = categoriesRes
  } catch (err: any) {
    error = err.message || 'Failed to load products'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="mt-1 text-sm text-gray-500">
          {error
            ? 'Something went wrong'
            : `${products.length} listing${products.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Functional filters — client component */}
      <SearchFilters categories={categories} />

      {/* Results */}
      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Oops, something went wrong"
          description={error}
        />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ListingCard key={product.id} listing={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No listings found"
          description="Try adjusting your search or filters."
        />
      )}
    </div>
  )
}
