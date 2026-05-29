'use client'

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'

export function SearchFilters() {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full h-10 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors"
          placeholder="Search listings..."
        />
      </div>
      
      <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap hover:bg-gray-100 transition-colors">
          Category
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap hover:bg-gray-100 transition-colors">
          Price
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap hover:bg-gray-100 transition-colors">
          Condition
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium whitespace-nowrap hover:bg-black transition-colors ml-auto md:ml-0">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </button>
      </div>
    </div>
  )
}
