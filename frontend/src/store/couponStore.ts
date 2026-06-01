import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CouponState {
  couponCode: string
  discountPercent: number
  isCouponApplied: boolean
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  clearCoupon: () => void
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      couponCode: '',
      discountPercent: 0,
      isCouponApplied: false,
      applyCoupon: (code: string) => {
        if (code.trim().toUpperCase() === 'VELORIA10') {
          set({ couponCode: code.trim().toUpperCase(), discountPercent: 10, isCouponApplied: true })
          return true
        }
        set({ couponCode: '', discountPercent: 0, isCouponApplied: false })
        return false
      },
      removeCoupon: () => set({ couponCode: '', discountPercent: 0, isCouponApplied: false }),
      clearCoupon: () => set({ couponCode: '', discountPercent: 0, isCouponApplied: false })
    }),
    {
      name: 'veloria-coupon-storage'
    }
  )
)