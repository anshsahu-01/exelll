import { PackageSearch, Users, ShoppingBag } from 'lucide-react'

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
      <h2 className="text-lg font-semibold text-primary mb-4">Marketplace Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <a href="/listings" className="group bg-surface hover:bg-surface-hover border border-border-default rounded-xl p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Active Listings</p>
              <p className="text-2xl font-bold text-primary">{totalActiveListings}</p>
            </div>
          </div>
        </a>

        <a href="/sellers" className="group bg-surface hover:bg-surface-hover border border-border-default rounded-xl p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Total Sellers</p>
              <p className="text-2xl font-bold text-primary">{totalSellers}</p>
            </div>
          </div>
        </a>

        <a href="/sellers" className="group bg-surface hover:bg-surface-hover border border-border-default rounded-xl p-5 transition-all hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Items Sold</p>
              <p className="text-2xl font-bold text-primary">{totalSoldItems}</p>
            </div>
          </div>
        </a>

      </div>
    </div>
  )
}
