import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USER_ROLES, type UserRole } from '@/types/roles'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  googleLogin: (credential: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (password: string, token: string) => Promise<void>
  refreshSession: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          // Simulate API Call
          await new Promise((resolve) => setTimeout(resolve, 1500))
          
          // Mock successful response
          const mockUser: User = {
            id: '1',
            name: 'Eleanor Vance',
            email: credentials.email,
            role: USER_ROLES.BUYER, // Or based on API response
          }
          
          set({
            user: mockUser,
            token: 'mock-jwt-token',
            role: mockUser.role,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error: any) {
          set({ error: error.message || 'Authentication failed', loading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ loading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          
          const mockUser: User = {
            id: '2',
            name: data.name,
            email: data.email,
            role: data.role,
          }
          
          set({
            user: mockUser,
            token: 'mock-jwt-token',
            role: mockUser.role,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', loading: false })
          throw error
        }
      },

      googleLogin: async (credential) => {
        set({ loading: true, error: null })
        // Implement actual Google verification with backend
        await new Promise((resolve) => setTimeout(resolve, 1500))
        set({ loading: false })
      },

      logout: () => set({ user: null, token: null, role: null, isAuthenticated: false }),

      forgotPassword: async (email) => { /* Implement API call */ },
      resetPassword: async (password, token) => { /* Implement API call */ },
      refreshSession: async () => { /* Implement session refresh */ },
    }),
    {
      name: 'veloria-auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, role: state.role, isAuthenticated: state.isAuthenticated }),
    }
  )
)