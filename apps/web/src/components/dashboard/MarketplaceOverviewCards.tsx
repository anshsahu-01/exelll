import { PackageSearch, Users, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export function MarketplaceOverviewCards({
  totalActiveListings,
  totalSellers,
  totalSoldItems,
}: {
  totalActiveListings: number
  totalSellers: number
  totalSoldItems: number
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">
          Marketplace Overview
        </h2>

        <Link
          href="/sellers"
          className="text-sm font-medium text-primary hover:underline"
        >
          View Directory →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">

        {/* Active Listings */}
        <Link
          href="/listings"
          className="group relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover p-6 hover:border-blue-500/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <PackageSearch className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="relative">
            <p className="text-4xl font-bold text-primary mb-1">
              {totalActiveListings}
            </p>
            <p className="text-sm text-secondary">
              Active Listings
            </p>
          </div>
        </Link>

        {/* Sellers */}
        <Link
          href="/sellers"
          className="group relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover p-6 hover:border-purple-500/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>

          <div className="relative">
            <p className="text-4xl font-bold text-primary mb-1">
              {totalSellers}
            </p>
            <p className="text-sm text-secondary">
              Total Sellers
            </p>
          </div>
        </Link>

        {/* Sold Items */}
        <Link
          href="/sellers"
          className="group relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover p-6 hover:border-green-500/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-green-500/10">
              <ShoppingBag className="w-5 h-5 text-green-500" />
            </div>
          </div>

          <div className="relative">
            <p className="text-4xl font-bold text-primary mb-1">
              {totalSoldItems}
            </p>
            <p className="text-sm text-secondary">
              Items Sold
            </p>
          </div>
        </Link>

      </div>
    </div>
  )
}