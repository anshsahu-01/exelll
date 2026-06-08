import Link from 'next/link'
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

  const filters: ProductFilters = {
    search:
      typeof resolvedSearchParams.search === 'string'
        ? resolvedSearchParams.search
        : undefined,
    categoryId:
      typeof resolvedSearchParams.categoryId === 'string'
        ? resolvedSearchParams.categoryId
        : undefined,
    condition:
      typeof resolvedSearchParams.condition === 'string'
        ? resolvedSearchParams.condition
        : undefined,
    sort:
      (typeof resolvedSearchParams.sort === 'string'
        ? resolvedSearchParams.sort
        : 'latest') as ProductFilters['sort'],
    page:
      typeof resolvedSearchParams.page === 'string'
        ? parseInt(resolvedSearchParams.page)
        : 1,
    limit: 24,
  }

  let products = []
  let pagination: any = null
  let error = null
  let categories = []

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(filters),
      getCategories(),
    ])

    products = productsRes.products
    pagination = productsRes.pagination
    categories = categoriesRes
  } catch (err: any) {
    error = err.message || 'Failed to load products'
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()

    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 0) {
        params.set(key, value)
      }
    })

    params.set('page', String(page))

    return `/listings?${params.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Marketplace</h1>

        <p className="mt-1 text-sm text-secondary">
          {error
            ? 'Something went wrong'
            : pagination?.total
            ? `${pagination.total} listings found`
            : `${products.length} listings found`}
        </p>
      </div>

      <SearchFilters categories={categories} />

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Oops, something went wrong"
          description={error}
        />
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ListingCard key={product.id} listing={product} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              {pagination.page > 1 && (
                <Link
                  href={buildPageUrl(pagination.page - 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-surface-hover"
                >
                  ⮜
                </Link>
              )}

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Link
                  key={page}
                  href={buildPageUrl(page)}
                  className={`px-4 py-2 rounded-lg border-gray-500 ${
                    page === pagination.page
                      ? 'bg-primary text-background border-black'
                      : 'bg-surface hover:bg-surface-hover'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {pagination.page < pagination.totalPages && (
                <Link
                  href={buildPageUrl(pagination.page + 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-surface-hover"
                >
                  ⮞
                </Link>
              )}
            </div>
          )}
        </>
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