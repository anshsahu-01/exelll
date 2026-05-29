import { ApiResponse, Product, ProductFilters, Category, ConversationListItem } from '@/types';
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

export async function getProductById(id: string) {
  const res = await apiRequest<ApiResponse<Product>>(`/products/${id}`);
  return res.data;
}

export async function getCategories() {
  const res = await apiRequest<ApiResponse<Category[]>>('/categories');
  return Array.isArray(res.data) ? res.data : [];
}

export async function getConversations(): Promise<ConversationListItem[]> {
  try {
    const res = await apiRequest<ApiResponse<ConversationListItem[]>>('/conversations');
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}
