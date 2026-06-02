import { create } from "zustand";
import { Product } from "@/types";
import { apiRequest } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { getToken } from "@/utils/storage";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  ownerUserId: string | null;
  isHydrated: boolean;
  hydrate: (userId?: string | null) => Promise<void>;
  addItem: (product: Product) => Promise<{ added: boolean }>;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  verifyItems: () => Promise<void>;
  setOwnerUserId: (userId: string | null) => Promise<void>;
};

type CartApiItem = {
  productId: string;
  quantity: number;
  product: Product;
};

async function getCartFromBackend() {
  const token = await getToken();
  if (!token) {
    return [];
  }

  const res = await apiRequest<{ success: boolean; data: { items: CartApiItem[] } }>("/cart");
  return res.data.items ?? [];
}

function mapItems(items: CartApiItem[]): CartItem[] {
  return items.map((item) => ({
    productId: item.productId,
    title: item.product.title,
    price: item.product.price,
    image: item.product.images?.[0] ?? "",
    sellerId: item.product.userId,
    sellerName: item.product.seller.name,
    quantity: item.quantity,
  }));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  ownerUserId: null,
  isHydrated: false,

  hydrate: async (userId = null) => {
    try {
      const items = mapItems(await getCartFromBackend());
      set({ items, ownerUserId: userId, isHydrated: true });
    } catch {
      set({ items: [], ownerUserId: userId, isHydrated: true });
    }
  },

  addItem: async (product) => {
    const ownerUserId = useAuthStore.getState().user?.id ?? null;
    const existing = get().items.find((item) => item.productId === product.id);
    if (existing) {
      return { added: false };
    }

    await apiRequest(`/cart/add/${product.id}`, { method: "POST" });
    const items = mapItems(await getCartFromBackend());
    set({ items, ownerUserId });
    return { added: true };
  },

  removeItem: async (productId) => {
    await apiRequest(`/cart/remove/${productId}`, { method: "DELETE" });
    const items = mapItems(await getCartFromBackend());
    set({ items });
  },

  updateItem: async (productId, quantity) => {
    await apiRequest(`/cart/update/${productId}`, {
      method: "PUT",
      body: { quantity },
    });
    const items = mapItems(await getCartFromBackend());
    set({ items });
  },

  clearCart: async () => {
    const items = get().items;
    await Promise.all(items.map((item) => apiRequest(`/cart/remove/${item.productId}`, { method: "DELETE" })));
    set({ items: [], ownerUserId: get().ownerUserId });
  },

  verifyItems: async () => {
    const items = mapItems(await getCartFromBackend());
    set({ items });
  },

  setOwnerUserId: async (userId) => {
    set({ ownerUserId: userId });
  },
}));
