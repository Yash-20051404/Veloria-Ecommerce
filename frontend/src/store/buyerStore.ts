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
}

export interface Address {
  id?: string
  _id?: string;
  userId?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  addressType?: string
  isDefault?: boolean
}

interface BuyerState {
  profile: Profile | null
  addresses: Address[]
  loading: boolean
  fetchData: (userId: string) => Promise<void>
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<{ error: any }>
  uploadAvatar: (userId: string, file: File) => Promise<{ url?: string; error?: any }>

  addAddress: (
  userId: string,
  address: Omit<Address, "id" | "userId">
) => Promise<{
  success: boolean;
  message: string;
  data: any;
  errors: any;
  error: any;
}>;

  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (userId: string, addressId: string) => Promise<void>
  updateAddress: (id: string, address: Partial<Address>) => Promise<any>
}

export const useBuyerStore = create<BuyerState>((set, get) => ({
  profile: null,
  addresses: [],
  loading: false,

  fetchData: async (userId) => {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/buyer/dashboard`, { headers: getHeaders() })
      const data = await res.json()
      if (data.success) {
        set({ 
          profile: data.data.profile, 
          addresses: data.data.addresses || [],
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
    if (data.success) {
      set(state => ({
        // Merge existing profile with new data to avoid unexpected state changes
        profile: state.profile ? { ...state.profile, ...data.data } : data.data
      }))
    }
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

    const payload = {
      fullName: (address as any).fullName || (address as any).full_name || '',
      addressLine1: (address as any).addressLine1 || (address as any).address_line_1 || '',
      addressLine2: (address as any).addressLine2 || (address as any).address_line_2 || '',
      pincode: (address as any).pincode || (address as any).postal_code || '',
      addressType: (address as any).addressType || (address as any).address_type || 'Home',
      isDefault: (address as any).isDefault ?? (address as any).is_default ?? false,
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      phone: cleanPhone,
    };

    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    const savedAddr = data.data || data.address || data;
    
    if (res.ok && savedAddr && (savedAddr.id || savedAddr._id)) {
      set(state => ({
        addresses: [savedAddr, ...state.addresses]
      }));
    }
    return {
      success: res.ok,
      message: data.message,
      data: savedAddr,
      errors: res.ok ? null : (data.errors || data.error || data.message),
      error: res.ok ? null : (data.errors || data.error || data.message) // Keep for backward compatibility if needed
    }
  },

  deleteAddress: async (id) => {
    const getAddressId = (address: any) => address.id || address._id;
    const res = await fetch(`${API_URL}/addresses/${id}`, { method: 'DELETE', headers: getHeaders() })
    const data = await res.json()
    if (data.success) set(state => ({ addresses: state.addresses.filter(a => getAddressId(a) !== id)}))
  },

  setDefaultAddress: async (userId, id) => {
    const getAddressId = (address: any) => address.id || address._id;
    const res = await fetch(`${API_URL}/addresses/${id}/default`, { method: 'PATCH', headers: getHeaders() })
    const data = await res.json()
    if (data.success) {
      set(state => ({ addresses: state.addresses.map(a => ({ ...a, isDefault: getAddressId(a) === id })) }))
    }
  },

  updateAddress: async (id, address) => {
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

    const payload = {
      fullName: (address as any).full_name,
      addressLine1: (address as any).address_line_1,
      addressLine2: (address as any).address_line_2,
      pincode: (address as any).postal_code,
      addressType: (address as any).address_type,
      isDefault: (address as any).is_default,
      city: address.city,
      state: address.state,
      country: address.country,
      phone: cleanPhone,
    };
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (data.success) {
      const getAddressId = (address: any) => address.id || address._id;
      set(state => ({
        addresses: state.addresses.map(a => (getAddressId(a) === id ? data.data : a))
      }))
    }

    return { 
      success: data.success,
      errors: data.errors || data.error || null,
      message: data.message || null,
      data: data.data || null
    }
  }
}))