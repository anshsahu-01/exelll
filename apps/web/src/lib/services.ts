import { ApiResponse, Product, ProductFilters, Category, ConversationListItem, Order, SellerDirectoryUser, SellerProfile, MarketplaceOverview } from '@/types';
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

export async function getMyOrders() {
  try {
    const res = await apiRequest<ApiResponse<Order[]>>('/orders/my-orders');
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function getMySales() {
  try {
    const res = await apiRequest<ApiResponse<Order[]>>('/orders/my-sales');
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function getSellers(page: number = 1, limit: number = 12) {
  try {
    const res = await apiRequest<ApiResponse<SellerDirectoryUser[]>>(`/sellers?page=${page}&limit=${limit}`);
    return { sellers: Array.isArray(res.data) ? res.data : [], pagination: res.pagination };
  } catch {
    return { sellers: [], pagination: undefined };
  }
}

export async function getSellerById(id: string) {
  const res = await apiRequest<ApiResponse<SellerProfile>>(`/sellers/${id}`);
  return res.data;
}

export async function getMarketplaceOverview() {
  try {
    const res = await apiRequest<ApiResponse<MarketplaceOverview>>('/sellers/overview');
    return res.data;
  } catch {
    return { totalActiveListings: 0, totalSellers: 0, totalSoldItems: 0 };
  }
}
