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
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-500">Welcome back - here&apos;s what&apos;s happening</p>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">Recent Listings</h2>
            <a href="/listings" className="text-xs font-medium text-blue-600 hover:underline">
              Browse all →
            </a>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} cols={2} />
          </Suspense>
        </div>

        <div className="w-80 shrink-0 overflow-y-auto border-l border-gray-100 bg-white xl:w-96">
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
