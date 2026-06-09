import Link from 'next/link'
import { PlusCircle, Search, Users, MessageSquare } from 'lucide-react'

export function DashboardQuickActions() {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        
        <Link
          href="/sell"
          className="group flex flex-col items-center justify-center p-5 sm:p-6 bg-primary text-background rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="bg-background/20 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="font-semibold text-sm sm:text-base">Sell Item</span>
        </Link>

        <Link
          href="/listings"
          className="group flex flex-col items-center justify-center p-5 sm:p-6 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
          <div className="bg-surface-hover border border-border-default p-3 rounded-xl mb-3 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:text-primary" />
          </div>
          <span className="font-semibold text-sm sm:text-base text-secondary group-hover:text-primary transition-colors">Browse</span>
        </Link>

        <Link
          href="/sellers"
          className="group flex flex-col items-center justify-center p-5 sm:p-6 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
          <div className="bg-surface-hover border border-border-default p-3 rounded-xl mb-3 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:text-primary" />
          </div>
          <span className="font-semibold text-sm sm:text-base text-secondary group-hover:text-primary transition-colors">Sellers</span>
        </Link>

        <Link
          href="/messages"
          className="group flex flex-col items-center justify-center p-5 sm:p-6 bg-surface hover:bg-surface-hover border border-border-default text-primary rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
          <div className="bg-surface-hover border border-border-default p-3 rounded-xl mb-3 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:text-primary" />
          </div>
          <span className="font-semibold text-sm sm:text-base text-secondary group-hover:text-primary transition-colors">Messages</span>
        </Link>

      </div>
    </div>
  )
}
