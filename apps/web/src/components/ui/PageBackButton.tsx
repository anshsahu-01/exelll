'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function PageBackButton({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}

