import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, AlertCircle, Eye as EyeOff, Search, SlidersHorizontal, RotateCcw, Plus, Pencil, Eye, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import ConfirmModal from '../../layouts/ConfirmModal';
import { toast } from '../../layouts/toast';
import { useProductStore } from '@/store/productStore';

const fmt = (n: any) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

const statusDot: Record<string, string> = {
  Active: 'bg-green-500',
  'Low Stock': 'bg-orange-400',
  'Out of Stock': 'bg-red-500',
};

const statusText: Record<string, string> = {
  Active: 'text-green-700',
  'Low Stock': 'text-orange-600',
  'Out of Stock': 'text-red-600',
};

const ITEMS_PER_PAGE = 6;

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [stockFilter, setStockFilter] = useState('Stock Status');
  const [page, setPage] = useState(1);
  const { products, fetchProducts, deleteProduct } = useProductStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['All Categories', ...Array.from(new Set(products.map(p => p.category || '')))];
  const statuses = ['All Status', 'Active', 'Low Stock', 'Out of Stock'];

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || p.category === category;
    const matchStatus = statusFilter === 'All Status' || p.status === statusFilter;
    const matchStock = stockFilter === 'Stock Status' ||
      (stockFilter === 'In Stock' && p.stock > 10) ||
      (stockFilter === 'Low Stock' && p.stock > 0 && p.stock <= 10) ||
      (stockFilter === 'Out of Stock' && p.stock === 0);
    return matchSearch && matchCat && matchStatus && matchStock;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const total = products.length;
  const active = products.filter(p => p.status === 'Active').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;

  const statCards = [
    { label: 'Total Products', sub: 'All Products', value: total, icon: Package, color: '#FFF7E6', iconColor: '#D6B57A' },
    { label: 'Active Products', sub: 'Published', value: active, icon: CheckCircle, color: '#ECFDF5', iconColor: '#34D399' },
    { label: 'Low Stock', sub: 'Stock below 10', value: lowStock, icon: AlertCircle, color: '#FFF7ED', iconColor: '#FB923C' },
    { label: 'Out of Stock', sub: 'Unavailable', value: outOfStock, icon: EyeOff, color: '#F5F3FF', iconColor: '#A78BFA' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Products</span>
          </p>
        </div>
        <Link to="/admin/products/add" className="flex items-center gap-2 bg-[#D6B57A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c9a76d] transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, sub, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: color }}>
              <Icon size={22} style={{ color: iconColor }} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="text-gray-400" />
            <input
              type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['Stock Status', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button onClick={() => { setSearch(''); setCategory('All Categories'); setStatusFilter('All Status'); setStockFilter('Stock Status'); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left px-5 py-3 font-medium">
                  <span className="flex items-center gap-1">Product <ChevronUp size={12} /></span>
                </th>
                <th className="text-left px-3 py-3 font-medium">
                  <span className="flex items-center gap-1">Category <ChevronUp size={12} /></span>
                </th>
                <th className="text-left px-3 py-3 font-medium">
                  <span className="flex items-center gap-1">Price <ChevronUp size={12} /></span>
                </th>
                <th className="text-left px-3 py-3 font-medium">
                  <span className="flex items-center gap-1">Stock <ChevronUp size={12} /></span>
                </th>
                <th className="text-left px-3 py-3 font-medium">
                  <span className="flex items-center gap-1">Status <ChevronUp size={12} /></span>
                </th>
                <th className="text-left px-3 py-3 font-medium">
                  <span className="flex items-center gap-1">Created At <ChevronUp size={12} /></span>
                </th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{p.category}</td>
                  <td className="px-3 py-3 font-semibold text-gray-800">{fmt(p.price)}</td>
                  <td className="px-3 py-3 text-gray-700">{p.stock}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium`}>
                      <span className={`w-2 h-2 rounded-full ${statusDot[p.status]}`} />
                      <span className={statusText[p.status]}>{p.status}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{p.created}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${p.id}`} className="text-gray-400 hover:text-[#D6B57A] transition-colors"><Pencil size={15} /></Link>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors"><Eye size={15} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === n ? 'bg-[#D6B57A] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{n}</button>
            ))}
            {totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
            {totalPages > 5 && (
              <button onClick={() => setPage(totalPages)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === totalPages ? 'bg-[#D6B57A] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{totalPages}</button>
            )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={async () => {
          if (deleteId) {
            await deleteProduct(deleteId);
            setDeleteId(null);
            toast('Product deleted successfully');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
