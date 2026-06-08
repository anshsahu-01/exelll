function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function CartLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <section className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="rounded-[1.75rem] border border-border-default bg-surface p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-28 w-full shrink-0 rounded-2xl sm:w-28" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48 rounded-2xl sm:w-64" />
                    <Skeleton className="h-4 w-32 rounded-2xl" />
                    <Skeleton className="h-4 w-24 rounded-2xl" />
                  </div>
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-10 rounded-2xl" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="ml-0 h-4 w-28 rounded-2xl sm:ml-auto" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-[1.75rem] border border-border-default bg-surface p-5 shadow-sm">
        <Skeleton className="h-6 w-28 rounded-2xl" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full rounded-2xl" />
          <Skeleton className="h-4 w-5/6 rounded-2xl" />
          <Skeleton className="h-4 w-4/5 rounded-2xl" />
          <Skeleton className="h-px w-full rounded-none bg-gray-200" />
          <Skeleton className="h-5 w-3/5 rounded-2xl" />
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-2xl" />
      </aside>
    </div>
  )
}
