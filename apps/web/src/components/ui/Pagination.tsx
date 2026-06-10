'use client'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-border-default rounded-lg hover:bg-surface-hover text-primary transition-colors"
        >
          ⮜
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-primary text-background border-primary'
              : 'bg-surface hover:bg-surface-hover border-border-default text-primary'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-border-default rounded-lg hover:bg-surface-hover text-primary transition-colors"
        >
          ⮞
        </Link>
      )}
    </div>
  )
}