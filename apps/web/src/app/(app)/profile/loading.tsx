function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border-default bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-[1.5rem]" />
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-[1.5rem]" />
        ))}
      </section>
    </div>
  )
}
