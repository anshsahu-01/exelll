import { ListingSkeleton } from '@/components/listings/ListingSkeleton'

export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover items for sale from students around you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
