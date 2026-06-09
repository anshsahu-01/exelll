import { getSellers } from '@/lib/services'
import { SellerCard } from '@/components/sellers/SellerCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageBackButton } from '@/components/ui/PageBackButton'
import { Pagination } from '@/components/ui/Pagination'
import { Users, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SellersDirectoryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1
  const limit = 12

  let sellers = []
  let pagination: any = null
  let error = null

  try {
    const res = await getSellers(page, limit)
    sellers = res.sellers
    pagination = res.pagination
  } catch (err: any) {
    error = err.message || 'Failed to load sellers'
  }

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    return `/sellers?${params.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <div className="mb-6">
        <PageBackButton href="/dashboard" label="Dashboard" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Browse Sellers</h1>
        <p className="mt-1 text-sm text-secondary">
          {error
            ? 'Something went wrong'
            : pagination?.total
            ? `Discover ${pagination.total} trusted sellers on the marketplace`
            : `Discover sellers on the marketplace`}
        </p>
      </div>

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Oops, something went wrong"
          description={error}
        />
      ) : sellers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              buildPageUrl={buildPageUrl} 
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No sellers found"
          description="There are currently no sellers to display."
        />
      )}
    </div>
  )
}
