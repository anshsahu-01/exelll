export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border-default bg-surface animate-pulse">
          <div className="h-48 w-full bg-gray-200" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
