function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-border-default ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-hover">
      {/* Two-column layout — main + sidebar */}
      <div className="flex min-h-0 flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">

        {/* Main content column */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 lg:pr-6">
          <div className="max-w-4xl mx-auto w-full">

            {/* Hero skeleton */}
            <div className="overflow-hidden rounded-2xl border border-border-default bg-surface mb-8">
              <SkeletonBlock className="aspect-[4/1] w-full" />
            </div>

            {/* Marketplace Overview skeleton */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-4 w-28" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-border-default rounded-2xl p-6">
                    <SkeletonBlock className="h-12 w-12 rounded-xl mb-4" />
                    <SkeletonBlock className="h-9 w-16 mb-2" />
                    <SkeletonBlock className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions skeleton */}
            <div className="mb-10">
              <SkeletonBlock className="h-5 w-36 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-border-default rounded-2xl p-5 sm:p-6 flex flex-col items-center">
                    <SkeletonBlock className="h-14 w-14 rounded-xl mb-3" />
                    <SkeletonBlock className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Explore Sellers CTA skeleton */}
            <div className="rounded-2xl border border-border-default bg-surface p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <SkeletonBlock className="h-6 w-52 mb-3" />
                <SkeletonBlock className="h-4 w-full mb-2" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>
              <SkeletonBlock className="h-12 w-40 rounded-xl shrink-0" />
            </div>

          </div>
        </div>

        {/* Right sidebar skeleton — desktop only */}
        <div className="hidden lg:flex lg:w-[380px] xl:w-[420px] shrink-0 flex-col border-l border-border-default bg-surface h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* My Activity skeleton */}
            <SkeletonBlock className="h-5 w-28 mb-4" />
            <div className="flex flex-col gap-2 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5 bg-surface-hover border border-border-default rounded-xl">
                  <SkeletonBlock className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-1/2" />
                  </div>
                  <SkeletonBlock className="h-6 w-6 shrink-0" />
                </div>
              ))}
            </div>

            {/* Recent Activity panel skeleton */}
            <SkeletonBlock className="h-5 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-2 py-3">
                  <SkeletonBlock className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-4/5" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-2/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export function ListingsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <SkeletonBlock className="h-7 w-64" />
        <SkeletonBlock className="h-4 w-96" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-border-default bg-surface p-4">
          <SkeletonBlock className="h-5 w-24" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        </aside>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[1.25rem] border border-border-default bg-surface p-3">
              <SkeletonBlock className="aspect-[4/3] w-full rounded-[1rem]" />
              <SkeletonBlock className="mt-3 h-4 w-4/5" />
              <SkeletonBlock className="mt-2 h-5 w-1/3" />
              <SkeletonBlock className="mt-3 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ListingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SkeletonBlock className="mb-6 h-10 w-36 rounded-full" />
      <div className="mb-6 flex gap-2">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-4 w-4" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <SkeletonBlock className="aspect-[4/3] w-full rounded-[1.5rem]" />
          <div className="rounded-[1.5rem] border border-border-default bg-surface p-6">
            <SkeletonBlock className="h-6 w-32" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-11/12" />
            <SkeletonBlock className="mt-2 h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-border-default bg-surface p-6">
            <SkeletonBlock className="h-7 w-4/5" />
            <SkeletonBlock className="mt-3 h-8 w-1/3" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-12 rounded-2xl" />
              <SkeletonBlock className="h-12 rounded-2xl" />
            </div>
            <SkeletonBlock className="mt-3 h-12 rounded-2xl" />
          </div>
          <SkeletonBlock className="h-32 rounded-[1.5rem]" />
        </div>
      </div>
    </div>
  )
}

export function FormPageSkeleton({ sidebarLines = 6 }: { sidebarLines?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="mb-4 h-8 w-40" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SkeletonBlock className="h-24 rounded-[2rem]" />
          <SkeletonBlock className="h-80 rounded-[2rem]" />
          <SkeletonBlock className="h-72 rounded-[2rem]" />
        </div>
        <div className="space-y-4 rounded-[2rem] border border-border-default bg-surface p-5">
          {Array.from({ length: sidebarLines }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
            </div>
          ))}
          <SkeletonBlock className="mt-4 h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-24 rounded-[2rem]" />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-36 rounded-[2rem]" />
      ))}
    </div>
  )
}
