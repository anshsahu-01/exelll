import { Suspense } from 'react'
import { getProducts, getConversations, getMyOrders, getMySales } from '@/lib/services'
import ProductGrid from '@/components/dashboard/ProductGrid'
import ProductGridSkeleton from '@/components/dashboard/ProductGridSkeleton'
import RecentActivityPanel from '@/components/dashboard/RecentActivityPanel'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [{ products }, conversations, orders, sales] = await Promise.all([
    getProducts({ limit: 6 }).catch(() => ({ products: [] })),
    getConversations().catch(() => []),
    getMyOrders().catch(() => []),
    getMySales().catch(() => []),
  ])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-500">Welcome back - here&apos;s what&apos;s happening</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="min-h-0 flex-1 overflow-y-auto border-b border-gray-200 bg-gray-50 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-700">Recent Listings</h2>
            <a href="/listings" className="text-xs font-medium text-blue-600 hover:underline">
              Browse all →
            </a>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} cols={2} />
          </Suspense>
        </div>

        <div className="w-full shrink-0 overflow-y-auto border-t border-gray-100 bg-white lg:w-80 lg:border-t-0 lg:border-l xl:w-96">
          <RecentActivityPanel
            conversations={conversations}
            products={products}
            orders={orders}
            sales={sales}
          />
        </div>
      </div>
    </div>
  )
}
