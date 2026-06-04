import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

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
      const res = await fetch(`${API_URL}/settings`)
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
      const res = await fetch(`${API_URL}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Failed to update settings')
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))