import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export function ExploreSellersCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-border-default mb-8 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors duration-500"></div>
      
      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-3">
            <Star className="w-5 h-5 text-primary fill-primary/20" />
            <h2 className="text-xl font-bold text-primary">Discover Trusted Sellers</h2>
          </div>
          <p className="text-secondary text-sm sm:text-base max-w-lg mx-auto sm:mx-0">
            Find reliable students with great items. Browse by top active listings, previously sold items, and more to find the best deals on campus.
          </p>
        </div>
        
        <div className="shrink-0">
          <Link
            href="/sellers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            Explore Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
