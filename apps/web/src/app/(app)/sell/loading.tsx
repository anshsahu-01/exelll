function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function SellLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <Skeleton className="mb-4 h-10 w-40 rounded-full" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
          <Skeleton className="mt-5 h-44 rounded-[1.5rem]" />
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        </section>

        <aside className="space-y-6 rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  )
}
