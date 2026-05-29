'use client'

import { PlusCircle, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  return (
    <div className="flex gap-4 mb-6">
      <Link
        href="/sell-item"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Add New Listing
      </Link>
      <Link
        href="/dashboard/reports"
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <BarChart2 className="w-5 h-5" />
        View Reports
      </Link>
    </div>
  )
}
