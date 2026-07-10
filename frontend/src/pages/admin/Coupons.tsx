import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, CheckCircle, XCircle, Clock, Search, SlidersHorizontal, RotateCcw, Plus, Pencil, Trash2, Copy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from '../../layouts/ConfirmModal';
import { useAdminCouponStore } from '@/store/adminCouponStore';
import { toast } from '../../layouts/toast';

const ITEMS_PER_PAGE = 6;

export default function Coupons() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Coupon Types');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const { coupons, fetchCoupons, deleteCoupon } = useAdminCouponStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const filtered = coupons.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = (c.code || '').toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s);
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    const matchDate = !dateFilter || new Date(c.expiry) >= new Date(dateFilter);
    return matchSearch && matchStatus && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const total = coupons.length;
  const active = coupons.filter(c => c.status === 'Active').length;
  const expired = coupons.filter(c => c.status === 'Expired').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.used, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Coupons</span>
          </p>
        </div>
        <Link to="/admin/coupons/add" className="flex items-center gap-2 bg-[#D6B57A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c9a76d] transition-colors">
          <Plus size={16} /> Create Coupon
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', sub: 'All Coupons', value: total, icon: Ticket, color: '#FFF7E6', ic: '#D6B57A' },
          { label: 'Active Coupons', sub: 'Currently Active', value: active, icon: CheckCircle, color: '#ECFDF5', ic: '#34D399' },
          { label: 'Expired Coupons', sub: 'No Longer Valid', value: expired, icon: XCircle, color: '#FFF1F2', ic: '#FB7185' },
          { label: 'Total Redemptions', sub: 'All Time', value: totalRedemptions.toLocaleString('en-IN'), icon: Clock, color: '#F5F3FF', ic: '#A78BFA' },
        ].map(({ label, sub, value, icon: Icon, color, ic }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: color }}>
              <Icon size={22} style={{ color: ic }} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search coupons by code or name..."
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Status', 'Active', 'Expired'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Coupon Types', 'Percentage', 'Fixed Amount', 'Free Shipping'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2">
            <Calendar size={14} />
            <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} className="outline-none bg-transparent" />
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button onClick={() => { setSearch(''); setStatusFilter('All Status'); setDateFilter(''); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Coupon Code</th>
                <th className="text-left px-3 py-3 font-medium">Description</th>
                <th className="text-left px-3 py-3 font-medium">Discount</th>
                <th className="text-left px-3 py-3 font-medium">Min. Order Value</th>
                <th className="text-left px-3 py-3 font-medium">Expiry Date</th>
                <th className="text-left px-3 py-3 font-medium">Usage Limit</th>
                <th className="text-left px-3 py-3 font-medium">Used</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#D6B57A] bg-amber-50 px-2 py-1 rounded text-xs border border-amber-200">
                        {c.code}
                      </span>
                      <button onClick={() => { navigator.clipboard.writeText(c.code); toast('Coupon code copied!'); }} className="text-gray-300 hover:text-gray-500 transition-colors">
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600 max-w-[200px]">{c.description}</td>
                  <td className="px-3 py-3 font-semibold text-gray-800">{c.discount}</td>
                  <td className="px-3 py-3 text-gray-600">₹{c.minOrder.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-gray-600">{c.expiry}</td>
                  <td className="px-3 py-3 text-gray-700">{c.limit === -1 ? '∞' : c.limit}</td>
                  <td className="px-3 py-3 text-gray-700">{c.used}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/coupons/edit/${c.id}`} className="text-gray-400 hover:text-[#D6B57A] transition-colors"><Pencil size={15} /></Link>
                      <button onClick={() => setDeleteId(c.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No coupons found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} coupons
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
            {totalPages > 5 && <><span className="text-gray-400 px-1">...</span>
              <button onClick={() => setPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">{totalPages}</button>
            </>}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
        onConfirm={async () => {
          if (deleteId) {
            await deleteCoupon(deleteId);
            setDeleteId(null);
            toast('Coupon deleted successfully');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
