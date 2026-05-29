import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/services';
import Filters from '@/components/dashboard/Filters';
import ProductGrid from '@/components/dashboard/ProductGrid';
import ProductGridSkeleton from '@/components/dashboard/ProductGridSkeleton';

type SearchParams = { [key: string]: string | string[] | undefined };

async function ProductsSection({ searchParams }: { searchParams: SearchParams }) {
  const params = searchParams || {};
  const filters: Record<string, string> = {};
  const search = Array.isArray(params.search) ? params.search[0] : params.search;
  const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;

  if (search) filters.search = search;
  if (categoryId) filters.categoryId = categoryId;

  console.log('DASHBOARD_FETCH_START', { filters });
  try {
    const result = await getProducts(filters);
    const products = Array.isArray(result.products) ? result.products : [];
    console.log('DASHBOARD_FETCH_SUCCESS', { filters, count: products.length });
    console.log('DASHBOARD_RENDER_DATA', { filters, products });
    return <ProductGrid products={products} />;
  } catch (error) {
    console.error('DASHBOARD_FETCH_ERROR', error);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="text-lg font-semibold mb-2">Unable to load products</h2>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  let categories: unknown = [];
  let categoryLoadError = false;

  try {
    categories = await getCategories();
  } catch (error) {
    categoryLoadError = true;
    console.error('DASHBOARD_FETCH_ERROR', error);
    categories = [];
  }

  const safeCategories = Array.isArray(categories) ? categories : [];
  console.log('DASHBOARD_RENDER_DATA', { categories: safeCategories });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton />
      </header>

      {categoryLoadError && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          Unable to load category filters. You can still browse products.
        </div>
      )}

      <Suspense fallback={<div className="mb-8">Loading filters...</div>}>
        <Filters categories={safeCategories} />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
