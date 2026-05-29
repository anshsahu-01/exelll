import { ApiResponse, Product, ProductFilters, Category } from '@/types';
import { apiRequest } from '@/lib/api';

export async function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });

  const query = params.toString();
  const res = await apiRequest<ApiResponse<Product[]>>(
    `/products${query ? `?${query}` : ''}`
  );

  const products = Array.isArray(res.data) ? res.data : [];
  return { products, pagination: res.pagination };
}

export async function getCategories() {
  const res = await apiRequest<ApiResponse<Category[]>>('/categories');
  return Array.isArray(res.data) ? res.data : [];
}
