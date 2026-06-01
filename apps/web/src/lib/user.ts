import { ApiResponse } from '@/types'

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

export async function deleteAccount(input: { confirmation: string }, token?: string) {
  const res = await request<ApiResponse<{ success: boolean; message: string }>>('/users/me', {
    method: 'DELETE',
    body: input,
    token,
  })
  return res.data
}
