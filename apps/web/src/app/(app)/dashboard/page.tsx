import Link from 'next/link'
import { getConversations, getMyOrders, getMySales, getMarketplaceOverview } from '@/lib/services'
import RecentActivityPanel from '@/components/dashboard/RecentActivityPanel'
import { MarketplaceOverviewCards } from '@/components/dashboard/MarketplaceOverviewCards'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { HeroBanner } from '@/components/hero/HeroBanner'
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

            <HeroBanner />
            
            
            <DashboardQuickActions />
            
            
            <MarketplaceOverviewCards
              totalActiveListings={overview.totalActiveListings}
              totalSellers={overview.totalSellers}
              totalSoldItems={overview.totalSoldItems}
            />

            <section className="rounded-[2rem] border border-border-default bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
                  <p className="mt-1 text-sm text-secondary">Quick access to your latest order requests.</p>
                </div>
                <Link
                  href="/profile/sales"
                  className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sales.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/profile/orders/${order.id}`}
                    className="group rounded-[1.5rem] border border-border-default bg-surface-hover p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-primary">{order.product.title}</p>
                    <p className="mt-2 text-sm text-secondary">Buyer: {order.buyer.name}</p>
                    <p className="mt-1 text-sm text-secondary">Status: {order.orderStatus}</p>
                  </Link>
                ))}
              </div>
            </section>

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
