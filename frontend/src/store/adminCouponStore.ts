import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

interface AdminCouponState {
  coupons: any[];
  loading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  addCoupon: (data: any) => Promise<void>;
  updateCoupon: (id: string, data: any) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

export const useAdminCouponStore = create<AdminCouponState>((set) => ({
  coupons: [],
  loading: false,
  error: null,
  fetchCoupons: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/coupons`)
      const data = await res.json()
      if (data.success) {
        const formatted = data.data.map((c: any) => ({
          ...c,
          id: c._id,
          discount: c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`,
          minOrder: c.minOrder || 0,
          expiry: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Expiry',
          limit: c.usageLimit || -1,
          used: c.usedCount || 0,
          status: c.status || 'Active'
        }))
        set({ coupons: formatted, loading: false })
      }
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  addCoupon: async (data) => {
    const res = await fetch(`${API_URL}/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      throw new Error(err.message || 'Failed to add coupon')
    }
  },
  updateCoupon: async (id, data) => {
    const res = await fetch(`${API_URL}/coupons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      throw new Error(err.message || 'Failed to update coupon')
    }
  },
  deleteCoupon: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete coupon')
      set({ loading: false })
      useAdminCouponStore.getState().fetchCoupons()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))