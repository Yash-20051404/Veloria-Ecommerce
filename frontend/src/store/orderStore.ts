import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

interface OrderState {
  orders: any[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchMyOrders: (email: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<any>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/orders`)
      const data = await res.json()
      if (data.success) set({ orders: data.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  fetchMyOrders: async (email) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/orders/customer/${email}`)
      const data = await res.json()
      if (data.success) set({ orders: data.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  createOrder: async (orderData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create order')
      set({ loading: false })
      return data.data
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (res.ok) useOrderStore.getState().fetchOrders()
    } catch (error) {}
  }
}))