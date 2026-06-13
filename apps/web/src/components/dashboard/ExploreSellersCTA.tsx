import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export function ExploreSellersCTA() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-default bg-gradient-to-br from-surface to-surface-hover mb-8 group hover:border-primary/20 transition-all duration-500">
      
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />

      <div className="relative p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="flex-1 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary/20" />
            Trusted Community
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            Discover Trusted Sellers
          </h2>

          <p className="text-secondary max-w-xl leading-relaxed">
            Explore verified student profiles, browse active listings,
            check seller history, and find the best deals available on campus.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/sellers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Explore Sellers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}