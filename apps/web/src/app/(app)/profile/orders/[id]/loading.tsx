function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-40 rounded-full" />
      <section className="rounded-[2rem] border border-border-default bg-surface p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-28 rounded-2xl" />
              <Skeleton className="h-7 w-64 rounded-2xl" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border-default bg-surface p-6">
            <Skeleton className="h-6 w-24 rounded-2xl" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 rounded-2xl" />
                    <Skeleton className="h-3 w-64 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border-default bg-surface p-6">
            <Skeleton className="h-6 w-32 rounded-2xl" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 rounded-2xl" />
                  <Skeleton className="mt-2 h-4 w-36 rounded-2xl" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border-default bg-surface p-6">
            <Skeleton className="h-6 w-28 rounded-2xl" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-hover p-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-16 rounded-2xl" />
                    <Skeleton className="h-4 w-28 rounded-2xl" />
                    <Skeleton className="h-3 w-20 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border-default bg-surface p-6">
            <Skeleton className="h-6 w-24 rounded-2xl" />
            <div className="mt-4 flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 rounded-2xl" />
                <Skeleton className="h-4 w-24 rounded-2xl" />
              </div>
            </div>
            <Skeleton className="mt-5 h-4 w-28 rounded-2xl" />
          </section>
        </div>
      </div>
    </div>
  )
}
