import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

interface CouponState {
  couponCode: string
  discountType: string
  discountValue: number
  applyCoupon: (code: string, cartValue: number) => Promise<{ success: boolean; message: string }>
  clearCoupon: () => void
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      couponCode: '',
      discountType: 'percentage',
      discountValue: 0,
      
      applyCoupon: async (code, cartValue) => {
        if (!code) {
          set({ couponCode: '', discountType: 'percentage', discountValue: 0 })
          return { success: true, message: 'Coupon removed' }
        }
        try {
          const res = await fetch(`${API_URL}/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, cartValue })
          })
          const data = await res.json()
          if (data.success) {
            set({ couponCode: data.data.code, discountType: data.data.discountType, discountValue: data.data.discountValue })
            return { success: true, message: 'Privilege Code Applied Successfully' }
          }
          return { success: false, message: data.message || 'Invalid Privilege Code' }
        } catch (error) {
          return { success: false, message: 'Failed to connect to server' }
        }
      },
      clearCoupon: () => set({ couponCode: '', discountType: 'percentage', discountValue: 0 })
    }),
    {
      name: 'veloria-coupon-storage-v2'
    }
  )
)