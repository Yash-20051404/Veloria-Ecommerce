import { create } from 'zustand'
import { useAuthStore } from './authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

// The auth token lives inside the zustand-persisted auth store, NOT as a
// plain localStorage key - reading localStorage.getItem('token') directly
// always returns null and silently breaks every authenticated request.
const getAuthToken = () => useAuthStore.getState().token || localStorage.getItem('token') || '';

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

interface SearchMeta {
  query: string;
  total: number;
  hybrid: boolean;
  semantic: boolean;
  fallback: boolean;
}

interface ProductState {
  products: Product[];
  searchResults: Product[];
  searchMeta: SearchMeta | null;
  isSearching: boolean;
  loading: boolean;
  error: string | null;
  similarProducts: Product[];
  recommendations: Product[];
  similarLoading: boolean;
  recommendationsLoading: boolean;
  fetchProducts: () => Promise<void>;
  semanticSearch: (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    metal?: string;
    gemstone?: string;
    occasion?: string;
  }) => Promise<void>;
  clearSearch: () => void;
  fetchSimilarProducts: (productId: string) => Promise<void>;
  fetchRecommendations: (productIds?: string[]) => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  searchResults: [],
  searchMeta: null,
  isSearching: false,
  loading: false,
  error: null,
  similarProducts: [],
  recommendations: [],
  similarLoading: false,
  recommendationsLoading: false,

  clearSearch: () => {
    set({ searchResults: [], searchMeta: null, isSearching: false });
  },

  fetchSimilarProducts: async (productId: string) => {
    set({ similarLoading: true });
    try {
      const res = await fetch(`${API_URL}/products/${productId}/similar`);
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map((p: any) => ({
          ...p,
          id: p._id || p.id,
          image: p.images?.[0] || p.image || 'https://via.placeholder.com/150',
          status: p.stock > 10 ? 'Active' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
          created: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          sku: p.sku || `VR-${(p._id || '').substring(0, 6).toUpperCase()}`
        }));
        set({ similarProducts: formatted, similarLoading: false });
      } else {
        set({ similarProducts: [], similarLoading: false });
      }
    } catch {
      set({ similarProducts: [], similarLoading: false });
    }
  },

  fetchRecommendations: async (productIds?: string[]) => {
    set({ recommendationsLoading: true });
    try {
      const params = productIds && productIds.length > 0
        ? `?productIds=${productIds.join(',')}`
        : '';
      const res = await fetch(`${API_URL}/products/recommendations${params}`);
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map((p: any) => ({
          ...p,
          id: p._id || p.id,
          image: p.images?.[0] || p.image || 'https://via.placeholder.com/150',
          status: p.stock > 10 ? 'Active' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
          created: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          sku: p.sku || `VR-${(p._id || '').substring(0, 6).toUpperCase()}`
        }));
        set({ recommendations: formatted, recommendationsLoading: false });
      } else {
        set({ recommendations: [], recommendationsLoading: false });
      }
    } catch {
      set({ recommendations: [], recommendationsLoading: false });
    }
  },

  semanticSearch: async (query, filters) => {
    set({ isSearching: true, error: null });
    try {
      const params = new URLSearchParams({ q: query });
      if (filters?.category && filters.category !== 'ALL') params.set('category', filters.category);
      if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
      if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
      if (filters?.metal && filters.metal !== 'All') params.set('metal', filters.metal);
      if (filters?.gemstone && filters.gemstone !== 'All') params.set('gemstone', filters.gemstone);
      if (filters?.occasion && filters.occasion !== 'All') params.set('occasion', filters.occasion);

      const res = await fetch(`${API_URL}/products/search?${params}`);
      const data = await res.json();

      if (data.success) {
        const formattedProducts = data.data.map((p: any) => ({
          ...p,
          id: p._id,
          image: p.images?.[0] || 'https://via.placeholder.com/150',
          status: p.stock > 10 ? 'Active' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
          created: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          sku: p.sku || `VR-${(p._id || '').substring(0, 6).toUpperCase()}`
        }));
        set({ searchResults: formattedProducts, searchMeta: data.meta || null, isSearching: false });
      } else {
        set({ searchResults: [], searchMeta: null, isSearching: false });
      }
    } catch (error: any) {
      set({ error: error.message, isSearching: false });
    }
  },

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
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
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
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