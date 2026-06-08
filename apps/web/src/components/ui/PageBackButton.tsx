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
      className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-medium text-secondary transition hover:-translate-y-0.5 hover:border-primary hover:bg-surface-hover hover:text-primary"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}

