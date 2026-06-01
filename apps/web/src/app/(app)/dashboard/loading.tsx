function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function DashboardLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48 rounded-2xl" />
        </div>
        <Skeleton className="mt-2 h-4 w-72 rounded-2xl" />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-40 rounded-2xl" />
            <Skeleton className="h-4 w-20 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-3">
                  <Skeleton className="h-4 w-3/4 rounded-2xl" />
                  <Skeleton className="h-5 w-1/3 rounded-2xl" />
                  <Skeleton className="h-3 w-1/2 rounded-2xl" />
                  <Skeleton className="h-3 w-2/3 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-100 bg-white xl:w-96">
          <div className="border-b border-gray-200 px-5 py-4">
            <Skeleton className="h-5 w-36 rounded-2xl" />
            <Skeleton className="mt-2 h-4 w-56 rounded-2xl" />
          </div>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 px-5 py-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-4 w-3/4 rounded-2xl" />
                    <Skeleton className="h-3 w-8 rounded-2xl" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-2xl" />
                  <Skeleton className="h-3 w-1/2 rounded-2xl" />
                </div>
                <Skeleton className="mt-1 h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
