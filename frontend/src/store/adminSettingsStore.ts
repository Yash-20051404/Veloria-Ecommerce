import { create } from 'zustand'
import { useAuthStore } from './authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

// The auth token lives inside the zustand-persisted auth store, NOT as a
// plain localStorage key - reading localStorage.getItem('token') directly
// always returns null and silently breaks every authenticated request.
const getAuthToken = () => useAuthStore.getState().token || localStorage.getItem('token') || '';

interface AdminSettingsState {
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<any>;
  updateSettings: (data: any) => Promise<void>;
}

export const useAdminSettingsStore = create<AdminSettingsState>((set) => ({
  loading: false,
  error: null,
  fetchSettings: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      const data = await res.json()
      set({ loading: false })
      if (data.success) return data.data;
      return null;
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return null;
    }
  },
  updateSettings: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to update settings')
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))