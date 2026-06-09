import { Sparkles } from 'lucide-react'

export function DashboardHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-border-default mb-8">
      {/* Abstract background gradient elements for a premium feel without hardcoded colors */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-hover border border-border-default mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Welcome Back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Your Marketplace Hub
          </h1>
          <p className="text-sm text-secondary max-w-md leading-relaxed">
            Manage your listings, track your sales, and discover new items from students across campus. Everything you need is right here.
          </p>
        </div>
      </div>
    </div>
  )
}
