const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001/api/v1'

export async function apiRequest<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
