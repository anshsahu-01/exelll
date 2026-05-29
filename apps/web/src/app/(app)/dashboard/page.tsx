import { getProducts, getConversations } from '@/lib/services'
import { Suspense } from 'react'
import ProductGrid from '@/components/dashboard/ProductGrid'
import ProductGridSkeleton from '@/components/dashboard/ProductGridSkeleton'
import DashboardChatPanel from '@/components/dashboard/DashboardChatPanel'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [{ products }, conversations] = await Promise.all([
    getProducts({ limit: 6 }).catch(() => ({ products: [] })),
    getConversations().catch(() => []),
  ])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back — here&apos;s what&apos;s happening
        </p>
      </div>

      {/* Two-column split body — fills remaining height */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* LEFT — Recent Listings */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-700">Recent Listings</h2>
            <a
              href="/listings"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Browse all →
            </a>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} cols={2} />
          </Suspense>
        </div>

        {/* RIGHT — Messages */}
        <div className="w-80 xl:w-96 shrink-0 overflow-y-auto bg-white border-l border-gray-100">
          <DashboardChatPanel conversations={conversations} />
        </div>

      </div>
    </div>
  )
}
