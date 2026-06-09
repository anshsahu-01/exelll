import { getConversations, getMyOrders, getMySales, getMarketplaceOverview } from '@/lib/services'
import RecentActivityPanel from '@/components/dashboard/RecentActivityPanel'
import { MarketplaceOverviewCards } from '@/components/dashboard/MarketplaceOverviewCards'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { ExploreSellersCTA } from '@/components/dashboard/ExploreSellersCTA'
import { MyActivitySummary } from '@/components/dashboard/MyActivitySummary'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [conversations, orders, sales, overview] = await Promise.all([
    getConversations().catch(() => []),
    getMyOrders().catch(() => []),
    getMySales().catch(() => []),
    getMarketplaceOverview().catch(() => ({
      totalActiveListings: 0,
      totalSellers: 0,
      totalSoldItems: 0,
    })),
  ])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-hover">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden lg:flex-row">

        {/* Main Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 lg:pr-6">
          <div className="mx-auto w-full max-w-5xl space-y-8">

            <DashboardHero />
            
            
            <DashboardQuickActions />
            
            
            <MarketplaceOverviewCards
              totalActiveListings={overview.totalActiveListings}
              totalSellers={overview.totalSellers}
              totalSoldItems={overview.totalSoldItems}
            />

            

            <ExploreSellersCTA />

          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden h-full shrink-0 border-l border-border-default bg-surface lg:flex lg:w-[380px] xl:w-[420px]">
          <div className="flex-1 overflow-y-auto p-6">

            <MyActivitySummary
              conversationsCount={conversations.length}
              ordersCount={orders.length}
              salesCount={sales.length}
            />

            <div className="mt-8">
              <RecentActivityPanel
                conversations={conversations}
                products={[]}
                orders={orders}
                sales={sales}
                compact={true}
              />
            </div>

          </div>
        </aside>

      </div>
    </div>
  )
}