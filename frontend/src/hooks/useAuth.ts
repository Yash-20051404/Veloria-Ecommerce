import { useAuthStore } from '@/store/authStore'

// Wraps the Zustand store to maintain compatibility with your existing RoleRoute
export function useAuth() {
  return useAuthStore()
}