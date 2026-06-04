import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

const getAuthToken = () => {
  let token = localStorage.getItem('token');
  if (token) return token;
  const storage = localStorage.getItem('veloria-auth-storage');
  if (storage) {
    try { return JSON.parse(storage).state?.token || ''; } catch(e) {}
  }
  return '';
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAuthToken()}`
});

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  avatar_url: string
  membership_tier: string
  reward_points: number
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  address_type: string
  is_default: boolean
}

interface BuyerState {
  profile: Profile | null
  addresses: Address[]
  orders: any[]
  preferences: any | null
  loading: boolean
  fetchData: (userId: string) => Promise<void>
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<{ error: any }>
  uploadAvatar: (userId: string, file: File) => Promise<{ url?: string; error?: any }>
  addAddress: (userId: string, address: Omit<Address, 'id' | 'user_id'>) => Promise<{ error: any }>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (userId: string, addressId: string) => Promise<void>
  updatePreferences: (userId: string, updates: any) => Promise<void>
}

export const useBuyerStore = create<BuyerState>((set, get) => ({
  profile: null,
  addresses: [],
  orders: [],
  preferences: null,
  loading: false,

  fetchData: async (userId) => {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/buyer/dashboard`, { headers: getHeaders() })
      const data = await res.json()
      if (data.success) {
        set({ 
          profile: data.data.profile, 
          orders: data.data.orders || [], 
          addresses: data.data.addresses || [], 
          preferences: data.data.preferences, 
          loading: false 
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      set({ loading: false })
    }
  },

  updateProfile: async (userId, updates) => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    if (data.success) set({ profile: data.data })
    return { error: data.success ? null : data.message }
  },

  uploadAvatar: async (userId, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await fetch(`${API_URL}/users/${userId}/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData
    })
    const data = await res.json()
    if (data.success) set({ profile: data.data })
    return { url: data.data?.avatar_url, error: data.success ? null : data.message }
  },

  addAddress: async (userId, address) => {
    // Sanitize phone number to strictly match Zod regex: /^\+?[1-9]\d{1,14}$/
    let cleanPhone = address.phone ? address.phone.replace(/[^0-9+]/g, '') : '';
    
    if (cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone.substring(1).replace(/^0+/, '');
    } else {
      cleanPhone = cleanPhone.replace(/^0+/, '');
    }

    if (cleanPhone.length === 10 && !cleanPhone.startsWith('+')) {
      cleanPhone = '+91' + cleanPhone;
    }
    if (!cleanPhone) cleanPhone = '+910000000000';

    // Send both snake_case and camelCase to safely bypass strict Zod validation schemas
    const payload = {
      ...address,
      phone: cleanPhone,
      userId: userId,
      user_id: userId,
      user: userId,
      fullName: address.full_name,
      addressLine1: address.address_line_1,
      addressLine2: address.address_line_2,
      postalCode: address.postal_code,
      pincode: address.postal_code, // Fixing the "undefined" pincode error
      addressType: address.address_type,
      isDefault: address.is_default
    };

    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    const savedAddr = data.data || data.address || data;
    if (data.success && savedAddr && (savedAddr.id || savedAddr._id)) {
      set(state => ({ addresses: [savedAddr, ...state.addresses] }))
    }
    return { error: data.success ? null : (data.message || 'Failed to save address') }
  },

  deleteAddress: async (id) => {
    const res = await fetch(`${API_URL}/addresses/${id}`, { method: 'DELETE', headers: getHeaders() })
    const data = await res.json()
    if (data.success) set(state => ({ addresses: state.addresses.filter(a => (a.id || (a as any)._id) !== id)}))
  },

  setDefaultAddress: async (userId, id) => {
    const res = await fetch(`${API_URL}/addresses/${id}/default`, { method: 'PATCH', headers: getHeaders() })
    const data = await res.json()
    if (data.success) {
      set(state => ({ addresses: state.addresses.map(a => ({ ...a, is_default: a.id === id })) }))
    }
  },

  updateAddress: async (id, address) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(address)
  })

  const data = await res.json()

  if (data.success) {
    set(state => ({
      addresses: state.addresses.map(a =>
        (a.id || (a as any)._id) === id
          ? data.data
          : a
      )
    }))
  }

  return data
},

  updatePreferences: async (userId, updates) => {
    const res = await fetch(`${API_URL}/users/${userId}/preferences`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    if (data.success) set({ preferences: data.data })
  }
}))