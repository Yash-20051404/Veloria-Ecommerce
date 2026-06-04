import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  metal?: string;
  purity?: string;
  gemstone?: string;
  occasion?: string;
  weight?: number;
  // UI Mapping keys (To match your existing UI design without breaking it)
  id?: string;
  image?: string;
  status?: string;
  created?: string;
  sku?: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/products`)
      const data = await res.json()
      if (data.success) {
        // Map backend '_id' to 'id' and 'images' to 'image' for UI compatibility
        const formattedProducts = data.data.map((p: any) => ({
          ...p,
          id: p._id,
          image: p.images?.[0] || 'https://via.placeholder.com/150',
          status: p.stock > 10 ? 'Active' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
          created: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          sku: p.sku || `VR-${(p._id || '').substring(0, 6).toUpperCase()}`
        }))
        set({ products: formattedProducts, loading: false })
      }
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to add product');
      }
      set({ loading: false })
      useProductStore.getState().fetchProducts()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      set({ loading: false })
      useProductStore.getState().fetchProducts()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update product');
      }
      set({ loading: false })
      useProductStore.getState().fetchProducts()
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))