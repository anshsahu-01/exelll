export function ListingSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full bg-gray-200" />
      
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
