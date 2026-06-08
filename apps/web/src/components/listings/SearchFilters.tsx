'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Category } from '@/types'

const CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

export function SearchFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '')
  const [condition, setCondition] = useState(searchParams.get('condition') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'latest')
  const [showFilters, setShowFilters] = useState(false)

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      const merged = { search, categoryId, condition, sort, ...overrides }
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v)
        else params.delete(k)
      })
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [search, categoryId, condition, sort, pathname, router, searchParams]
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      pushParams({ search })
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCategory = (val: string) => {
    setCategoryId(val)
    pushParams({ categoryId: val })
  }

  const handleCondition = (val: string) => {
    const next = condition === val ? '' : val
    setCondition(next)
    pushParams({ condition: next })
  }

  const handleSort = (val: string) => {
    setSort(val)
    pushParams({ sort: val })
  }

  const clearAll = () => {
    setSearch('')
    setCategoryId('')
    setCondition('')
    setSort('latest')
    router.replace(pathname)
  }

  const hasFilters = search || categoryId || condition || sort !== 'latest'

  return (
    <div className="mb-6 space-y-3">
      {/* Search + Sort row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-9 pr-4 py-2.5 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-2.5 border border-border-default rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
            showFilters
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-surface text-secondary border-border-default hover:bg-surface-hover'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 transition"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="bg-surface border border-border-default rounded-xl p-4 shadow-sm flex flex-wrap gap-6">
          {/* Category */}
          <div className="flex-1 min-w-[180px]">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategory('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  !categoryId
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-surface text-secondary border-border-default hover:bg-surface-hover'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    categoryId === cat.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-surface text-secondary border-border-default hover:bg-surface-hover'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="flex-1 min-w-[180px]">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Condition</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCondition(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    condition === c
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-surface text-secondary border-border-default hover:bg-surface-hover'
                  }`}
                >
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filter badges */}
      {hasFilters && (
        <div className="flex gap-2 flex-wrap">
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
              Search: {search}
              <button onClick={() => { setSearch(''); pushParams({ search: '' }) }}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {categoryId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
              {categories.find((c) => c.id === categoryId)?.name ?? 'Category'}
              <button onClick={() => handleCategory('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {condition && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              {condition.replace('_', ' ')}
              <button onClick={() => handleCondition('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
