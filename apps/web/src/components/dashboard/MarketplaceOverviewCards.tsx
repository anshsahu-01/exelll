import { PackageSearch, Users, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export function MarketplaceOverviewCards({ 
  totalActiveListings, 
  totalSellers, 
  totalSoldItems 
}: { 
  totalActiveListings: number;
  totalSellers: number;
  totalSoldItems: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Marketplace Overview</h2>
        <Link href="/sellers" className="text-xs font-medium text-primary hover:underline">
          View Directory →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
        
        <Link href="/listings" className="group relative overflow-hidden bg-surface hover:bg-surface-hover border border-border-default rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-surface-hover border border-border-default rounded-xl group-hover:scale-110 transition-transform duration-300">
              <PackageSearch className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">{totalActiveListings}</p>
            <p className="text-sm font-medium text-secondary">Active Listings</p>
          </div>
        </Link>

        <Link href="/sellers" className="group relative overflow-hidden bg-surface hover:bg-surface-hover border border-border-default rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-surface-hover border border-border-default rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">{totalSellers}</p>
            <p className="text-sm font-medium text-secondary">Total Sellers</p>
          </div>
        </Link>

        <Link href="/sellers" className="group relative overflow-hidden bg-surface hover:bg-surface-hover border border-border-default rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-surface-hover border border-border-default rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">{totalSoldItems}</p>
            <p className="text-sm font-medium text-secondary">Items Sold</p>
          </div>
        </Link>

      </div>
    </div>
  )
}
