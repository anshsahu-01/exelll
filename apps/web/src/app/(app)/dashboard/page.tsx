import { Suspense } from 'react'
import { getConversations, getMyOrders, getMySales, getMarketplaceOverview } from '@/lib/services'
import RecentActivityPanel from '@/components/dashboard/RecentActivityPanel'
import { MarketplaceOverviewCards } from '@/components/dashboard/MarketplaceOverviewCards'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [conversations, orders, sales, overview] = await Promise.all([
    getConversations().catch(() => []),
    getMyOrders().catch(() => []),
    getMySales().catch(() => []),
    getMarketplaceOverview().catch(() => ({ totalActiveListings: 0, totalSellers: 0, totalSoldItems: 0 })),
  ])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border-default bg-surface px-4 py-4 sm:px-6 lg:px-6">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Dashboard</h1>
        <p className="mt-0.5 text-sm text-secondary">Welcome back - here's what's happening</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-hover p-4 sm:p-6 lg:border-r border-border-default">
          <DashboardQuickActions />
          
          <Suspense fallback={<div className="h-40 bg-surface rounded-xl border border-border-default animate-pulse"></div>}>
            <MarketplaceOverviewCards 
              totalActiveListings={overview.totalActiveListings} 
              totalSellers={overview.totalSellers} 
              totalSoldItems={overview.totalSoldItems} 
            />
          </Suspense>

        </div>

        <div className="hidden lg:block lg:w-80 xl:w-96">
          <div className="h-full overflow-y-auto border-l border-border-default bg-surface">
            {/* Products is passed empty array because we don't fetch my recently listed products anymore, they weren't required for the activity panel per user instructions. Wait, RecentActivityPanel needs 'products'. Let's pass empty array. */}
            <RecentActivityPanel
              conversations={conversations}
              products={[]} 
              orders={orders}
              sales={sales}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
