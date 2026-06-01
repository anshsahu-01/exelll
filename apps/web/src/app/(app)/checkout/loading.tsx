function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
}

export default function CheckoutLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <Skeleton className="h-24 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-96 rounded-[2rem]" />
        <Skeleton className="h-[28rem] rounded-[2rem]" />
      </section>
      <aside className="h-fit space-y-6 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-6 w-28 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-2xl" />
          <Skeleton className="h-4 w-5/6 rounded-2xl" />
          <Skeleton className="h-4 w-4/5 rounded-2xl" />
          <Skeleton className="h-px w-full rounded-none bg-gray-200" />
          <Skeleton className="h-5 w-3/5 rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </aside>
    </div>
  )
}
