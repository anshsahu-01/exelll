function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-gray-200 ${className}`} />
}

export default function NotificationsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center rounded-[2rem] border border-border-default bg-surface px-8 py-14 text-center">
        <Skeleton className="h-16 w-16" />
        <Skeleton className="mt-6 h-5 w-44 rounded-2xl" />
        <Skeleton className="mt-3 h-4 w-72 rounded-2xl" />
      </div>
    </div>
  )
}
