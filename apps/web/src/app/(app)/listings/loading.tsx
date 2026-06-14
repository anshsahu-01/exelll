import { ListingSkeleton } from '@/components/listings/ListingSkeleton'

export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Heading */}
      <div className="mb-6">
        <div className="h-8 w-48 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="mt-2 h-4 w-32 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>

      {/* Hero Section Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border-default bg-surface shadow-sm">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">

            {/* Banner Skeleton */}
            <div className="p-4">
              <div className="aspect-[16/6] w-full rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>

            {/* Right Side Skeleton */}
            <div className="hidden lg:flex flex-col items-center justify-center border-l border-border-default px-8">

              <div className="h-16 w-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse mb-3" />

              <div className="h-16 w-48 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />

              <div className="mt-6 h-4 w-56 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />

              <div className="mt-2 h-4 w-44 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />

              <div className="mt-6 h-11 w-40 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>

          </div>
        </div>
      </section>

      {/* Search Filters Skeleton */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col gap-3">

          {/* Search */}
          <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="h-11 flex-1 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-11 flex-1 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>

        </div>
      </div>

      {/* Products Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>

    </div>
  )
}