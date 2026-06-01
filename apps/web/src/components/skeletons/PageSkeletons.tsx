function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="mt-2 h-4 w-72" />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto border-r border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[1.5rem] border border-gray-200 bg-white p-3">
                <SkeletonBlock className="aspect-[4/3] w-full rounded-[1rem]" />
                <SkeletonBlock className="mt-3 h-4 w-3/4" />
                <SkeletonBlock className="mt-2 h-5 w-1/3" />
                <SkeletonBlock className="mt-3 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-80 shrink-0 border-l border-gray-100 bg-white p-6 xl:w-96">
          <SkeletonBlock className="h-5 w-32" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <SkeletonBlock className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" />
                  <SkeletonBlock className="h-3 w-full" />
                  <SkeletonBlock className="h-3 w-1/2" />
                </div>
              </div>
            ))}
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
        <aside className="rounded-[1.75rem] border border-gray-200 bg-white p-4">
          <SkeletonBlock className="h-5 w-24" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        </aside>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[1.25rem] border border-gray-200 bg-white p-3">
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
          <div className="rounded-[1.5rem] border border-gray-200 bg-white p-6">
            <SkeletonBlock className="h-6 w-32" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-11/12" />
            <SkeletonBlock className="mt-2 h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-gray-200 bg-white p-6">
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
        <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-white p-5">
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
