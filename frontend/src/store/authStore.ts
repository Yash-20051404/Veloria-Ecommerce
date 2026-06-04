import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USER_ROLES, type UserRole } from '@/types/roles'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

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
  verifyEmail: (email: string, otp: string) => Promise<void>
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
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).catch((err) => {
          console.error("Login Fetch Error:", err)
          throw new Error('Network error: Could not connect to the server')
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Authentication failed')
        }

        // Handle wrapped { data: { user, token } } or flat { user, token } responses
        const user = data.data?.user || data.user
        const token = data.data?.token || data.token

        if (!user) throw new Error('Invalid server response: Missing user data')
        if (user._id && !user.id) user.id = user._id;

          set({
            user,
            token,
            role: user.role?.toUpperCase() || 'BUYER',
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
          // Ensure role is uppercase to match the backend UserRole enum
          const payload = { ...data }
          if (typeof payload.role === 'string') {
            payload.role = payload.role.toUpperCase()
          }
          // Ensure role is sent if missing
          if (!payload.role) payload.role = 'BUYER';

          const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch((err) => {
          console.error("Register Fetch Error:", err)
          throw new Error('Network error: Could not connect to the server')
        })

        const resData = await res.json().catch(() => ({}))

        if (!res.ok || resData.success === false) {
          throw new Error(resData.message || 'Registration failed')
        }

        // The backend only initiates an OTP registration. It does not return the user or token yet.
        set({ loading: false })
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', loading: false })
          throw error
        }
      },

      verifyEmail: async (email, otp) => {
        set({ loading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
          }).catch(() => {
            throw new Error('Network error: Could not connect to the server')
          })

          const data = await res.json().catch(() => ({}))

          if (!res.ok || data.success === false) {
            throw new Error(data.message || 'Email verification failed')
          }

          const user = data.data?.user || data.user
          const token = data.data?.token || data.token

          if (!user) throw new Error('Invalid server response: Missing user data')
          if (user._id && !user.id) user.id = user._id;

          set({
            user,
            token,
            role: user.role?.toUpperCase() || 'BUYER',
            isAuthenticated: true,
            loading: false,
          })
        } catch (error: any) {
          set({ error: error.message || 'Verification failed', loading: false })
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