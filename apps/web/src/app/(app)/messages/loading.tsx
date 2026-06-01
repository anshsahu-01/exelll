function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function MessagesLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-[#fafafa]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[30%_70%]">
        <aside className="flex min-h-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-4">
            <Skeleton className="h-14 rounded-2xl" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3 rounded-2xl" />
                  <Skeleton className="h-3 w-full rounded-2xl" />
                  <Skeleton className="h-3 w-3/4 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden bg-white">
          <div className="shrink-0 border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded-2xl" />
                <Skeleton className="h-3 w-56 rounded-2xl" />
              </div>
            </div>
            <Skeleton className="mt-4 h-24 rounded-2xl" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafafa] p-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <Skeleton className="h-16 w-[70%] rounded-3xl" />
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 p-4">
            <div className="flex items-end gap-3">
              <Skeleton className="h-14 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-24 rounded-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
