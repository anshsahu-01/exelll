import Link from 'next/link'
import {
  PlusCircle,
  Search,
  Users,
  MessageSquare,
  ClipboardList,
  User,
} from 'lucide-react'

export function DashboardQuickActions() {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-primary mb-4">
        Quick Actions
      </h2>

      {/* Top Priority Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link
          href="/sell"
          className="group flex flex-col items-center justify-center p-6 bg-primary text-background rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="bg-background/20 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="font-semibold">Sell Item</span>
        </Link>

        <Link
          href="/listings"
          className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 mb-3 group-hover:scale-110 transition-transform duration-300">
            <Search className="w-7 h-7 text-blue-500" />
          </div>
          <span className="font-semibold text-secondary group-hover:text-primary transition-colors">
            Browse
          </span>
        </Link>
      </div>

      <h3 className="text-sm font-medium text-secondary mb-3">
        Manage
      </h3>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/profile/sales"
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-3 rounded-xl bg-orange-500/10 mb-3 group-hover:scale-110 transition-transform duration-300">
            <ClipboardList className="w-6 h-6 text-orange-500" />
          </div>
          <span className="font-medium text-secondary group-hover:text-primary transition-colors">
            Orders
          </span>
        </Link>

        <Link
          href="/messages"
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-3 rounded-xl bg-green-500/10 mb-3 group-hover:scale-110 transition-transform duration-300">
            <MessageSquare className="w-6 h-6 text-green-500" />
          </div>
          <span className="font-medium text-secondary group-hover:text-primary transition-colors">
            Messages
          </span>
        </Link>

        <Link
          href="/sellers"
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 mb-3 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <span className="font-medium text-secondary group-hover:text-primary transition-colors">
            Sellers
          </span>
        </Link>

        <Link
          href="/profile"
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border-default bg-gradient-to-br from-surface to-surface-hover hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-3 rounded-xl bg-pink-500/10 mb-3 group-hover:scale-110 transition-transform duration-300">
            <User className="w-6 h-6 text-pink-500" />
          </div>
          <span className="font-medium text-secondary group-hover:text-primary transition-colors">
            Profile
          </span>
        </Link>
      </div>
    </div>
  )
}