'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Category } from '@/types';

export default function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (!searchParams) return;

    const value = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('categoryId') || '';
    setSearch(value);
    setCategoryId(selectedCategory);
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams) return;

    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      // When searching, we should probably just stay on current category.
      // But we reset pagination.
      params.delete('page');
      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      if (nextUrl !== currentUrl) {
        router.replace(nextUrl);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search, pathname, router, searchParams]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategoryId(val);
    const params = new URLSearchParams((searchParams ?? new URLSearchParams()).toString());
    if (val) {
      params.set('categoryId', val);
    } else {
      params.delete('categoryId');
    }
    params.delete('page');
    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input 
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded flex-1"
      />
      <select 
        value={categoryId} 
        onChange={handleCategoryChange}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
