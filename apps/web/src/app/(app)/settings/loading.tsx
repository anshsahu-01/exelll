function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <section key={i} className="rounded-[2rem] border border-gray-200 bg-white p-6">
            <Skeleton className="h-5 w-32" />
            <div className="mt-5 space-y-3">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              {i === 1 ? <Skeleton className="h-14 w-2/3 rounded-2xl" /> : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
