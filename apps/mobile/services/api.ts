import { API_URL } from "@/utils/config";
import { getToken } from "@/utils/storage";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
};

let tokenProvider: (() => Promise<string | null>) | null = null;

export const setTokenProvider = (provider: () => Promise<string | null>) => {
  tokenProvider = provider;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = options;
  let authToken = tokenProvider ? await tokenProvider() : null;
  if (!authToken) {
    authToken = token !== undefined ? token : await getToken();
  }
  const url = `${API_URL}${path}`;

  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
    });

    
    const data = await response.json().catch(() => ({}));


    if (!response.ok) {
      throw new ApiError(
        data.message ?? "Something went wrong",
        response.status
      );
    }

    return data as T;
  } catch (error) {
    // Intentionally omitting console.error here to prevent Expo's red screen
    // during deliberate retry loops (e.g., auth webhook latency).
    // The calling function will handle and log the error if necessary.
    throw error;
  }
}
