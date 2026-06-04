import { create } from 'zustand'
import { useAuthStore } from './authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

const getHeaders = () => {
  const token = useAuthStore.getState().token || localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

interface OrderState {
  orders: any[]
  loading: boolean
  fetchOrders: () => Promise<void>
  fetchMyOrders: (email: string) => Promise<void>
  createOrder: (orderData: any) => Promise<any>
  updateOrderStatus: (id: string, status: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() })
      const data = await res.json()
      if (data.success) set({ orders: data.data || [] })
    } catch (err) {
      console.error(err)
    }
    set({ loading: false })
  },

  fetchMyOrders: async (email) => {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/orders/customer/${email}`, { headers: getHeaders() })
      const data = await res.json()
      if (data.success) set({ orders: data.data || [] })
    } catch (err) {
      console.error(err)
    }
    set({ loading: false })
  },

  createOrder: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create order')
    }
    return data.data || data
  },

  updateOrderStatus: async (id, status) => {
    try {
      await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      })
      set((state) => ({
        orders: state.orders.map(o => (o.id === id || o._id === id || o.orderId === id) ? { ...o, status } : o)
      }))
    } catch (err) {
      console.error(err)
    }
  }
}))