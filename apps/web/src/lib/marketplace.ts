import {
  ApiResponse,
  ChatMessage,
  ConversationDetail,
  ConversationListItem,
  CreateProductInput,
  Favourite,
  MyProductsResponse,
  Order,
  Product,
  User,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

async function request<T>(
  path: string,
  options: { method?: string; token?: string | null; body?: unknown; isFormData?: boolean } = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.isFormData
      ? (options.body as FormData)
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message ?? 'Something went wrong')
  }

  return data as T
}

export async function getMe(token?: string) {
  const res = await request<ApiResponse<User>>('/users/me', { token })
  return res.data
}

export async function getMyProducts(token?: string) {
  const res = await request<ApiResponse<MyProductsResponse>>('/products/me', { token })
  return res.data
}

export async function getMyOrders(token?: string) {
  const res = await request<ApiResponse<Order[]>>('/orders/my-orders', { token })
  return Array.isArray(res.data) ? res.data : []
}

export async function getMySales(token?: string) {
  const res = await request<ApiResponse<Order[]>>('/orders/my-sales', { token })
  return Array.isArray(res.data) ? res.data : []
}

export async function getOrderById(id: string, token?: string) {
  const res = await request<ApiResponse<Order>>(`/orders/${id}`, { token })
  return res.data
}

export async function getConversations(token?: string) {
  const res = await request<ApiResponse<ConversationListItem[]>>('/chats/conversations', {
    token,
  })
  return Array.isArray(res.data) ? res.data : []
}

export async function getConversationById(id: string, token?: string) {
  const res = await request<ApiResponse<ConversationDetail>>(
    `/chats/conversations/${id}/messages`,
    { token }
  )
  return res.data
}

export async function sendConversationMessage(
  conversationId: string,
  content: string,
  token?: string
) {
  const res = await request<ApiResponse<ChatMessage>>(
    `/chats/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      body: { content },
      token,
    }
  )
  return res.data
}

export async function updateListingStatus(
  id: string,
  status: 'ACTIVE' | 'SOLD' | 'HIDDEN',
  token?: string
) {
  const res = await request<ApiResponse<Product>>(`/products/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
  return res.data
}

export async function getMyFavouriteIds(token?: string) {
  const res = await request<ApiResponse<string[]>>('/favourites/me/ids', { token })
  return Array.isArray(res.data) ? res.data : []
}

export async function getMyFavourites(token?: string) {
  const res = await request<ApiResponse<Favourite[]>>('/favourites/me', { token })
  return Array.isArray(res.data) ? res.data : []
}

export async function toggleFavourite(productId: string, token?: string) {
  const res = await request<ApiResponse<{ favourited: boolean }>>(`/favourites/${productId}/toggle`, {
    method: 'PATCH',
    token,
  })
  return res.data
}

export async function removeFavourite(productId: string, token?: string) {
  await request(`/favourites/${productId}`, {
    method: 'DELETE',
    token,
  })
}

export async function updateOrderStatus(
  id: string,
  status: 'confirmed' | 'cancelled' | 'shipped' | 'delivered',
  token?: string
) {
  const res = await request<ApiResponse<Order>>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
  return res.data
}

export async function createConversation(productId: string, token?: string) {
  const res = await request<ApiResponse<{ id: string }>>('/chats/conversations', {
    method: 'POST',
    body: { productId },
    token,
  })
  return res.data
}

export async function deleteListing(id: string, token?: string) {
  await request(`/products/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function updateListing(
  id: string,
  input: CreateProductInput & { existingImages?: string[] },
  token?: string
) {
  const formData = new FormData()
  formData.append('title', input.title)
  formData.append('description', input.description)
  formData.append('price', input.price)
  formData.append('condition', input.condition)
  formData.append('categoryId', input.categoryId)
  formData.append('existingImages', JSON.stringify(input.existingImages ?? []))

  input.imageUris.forEach((uri) => {
    formData.append('images', uri)
  })

  const res = await request<ApiResponse<Product>>(`/products/${id}`, {
    method: 'PATCH',
    body: formData,
    token,
    isFormData: true,
  })

  return res.data
}

type CreateListingProgress = (progress: number) => void

export async function createListing(
  input: Omit<CreateProductInput, 'imageUris'> & { imageFiles: File[] },
  token?: string,
  onProgress?: CreateListingProgress
) {
  const formData = new FormData()
  formData.append('title', input.title)
  formData.append('description', input.description)
  formData.append('price', input.price)
  formData.append('condition', input.condition)
  formData.append('categoryId', input.categoryId)

  input.imageFiles.forEach((file) => {
    formData.append('images', file, file.name)
  })

  if (!token) {
    throw new Error('You must be signed in to create a listing.')
  }

  return await new Promise<Product>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_URL}/products`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () => {
      let data: { success?: boolean; data?: Product; message?: string } = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Unexpected response from server'))
        return
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(data.message ?? 'Something went wrong'))
        return
      }

      if (!data.data) {
        reject(new Error('Listing was not created'))
        return
      }

      resolve(data.data)
    }

    xhr.onerror = () => reject(new Error('Network error while creating listing'))
    xhr.send(formData)
  })
}
