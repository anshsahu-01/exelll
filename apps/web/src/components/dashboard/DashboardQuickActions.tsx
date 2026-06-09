import Link from 'next/link'
import { PlusCircle, Search, Users, MessageSquare } from 'lucide-react'

export function DashboardQuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <Link
          href="/sell"
          className="flex flex-col items-center justify-center p-4 bg-primary text-background rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <PlusCircle className="w-6 h-6 mb-2" />
          <span className="font-medium text-sm">Sell Item</span>
        </Link>

        <Link
          href="/listings"
          className="flex flex-col items-center justify-center p-4 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-xl transition-all shadow-sm hover:shadow"
        >
          <Search className="w-6 h-6 mb-2 text-secondary" />
          <span className="font-medium text-sm">Browse Listings</span>
        </Link>

        <Link
          href="/sellers"
          className="flex flex-col items-center justify-center p-4 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-xl transition-all shadow-sm hover:shadow"
        >
          <Users className="w-6 h-6 mb-2 text-secondary" />
          <span className="font-medium text-sm">Browse Sellers</span>
        </Link>

        <Link
          href="/messages"
          className="flex flex-col items-center justify-center p-4 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-xl transition-all shadow-sm hover:shadow"
        >
          <MessageSquare className="w-6 h-6 mb-2 text-secondary" />
          <span className="font-medium text-sm">Messages</span>
        </Link>

      </div>
    </div>
  )
}
