import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Crown, IndianRupee, Search, SlidersHorizontal, RotateCcw, Download, Eye, MoreHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const fmt = (n: any) => '₹' + (Number(n) || 0).toLocaleString('en-IN');
const ITEMS_PER_PAGE = 8;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
// The auth token lives inside the zustand-persisted auth store, NOT as a
// plain localStorage key - reading localStorage.getItem('token') directly
// always returns null and silently breaks this authenticated request.
const getAuthToken = () => useAuthStore.getState().token || localStorage.getItem('token') || '';

const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#38bdf8', '#22d3ee', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'];
const getColor = (str: string) => colors[str.length % colors.length] || colors[0];

export default function Customers() {
  const [realCustomers, setRealCustomers] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/admin/customers`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    })
      .then(res => res.json())
      .then(data => setRealCustomers(
        (data.data || []).map((c: any) => ({
          ...c,
          initials: String(c.name || 'U').charAt(0).toUpperCase(),
          color: getColor(c.email || ''),
          memberSinceDate: new Date(c.memberSince || c.createdAt || Date.now()),
          memberSince: new Date(c.memberSince || c.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          orders: c.orders ?? 0,
          totalSpent: c.totalSpent ?? 0,
          status: c.status ?? 'Active',
        }))
      ));
  }, []);


  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Customers');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [sortFilter, setSortFilter] = useState('Sort: Newest First');
  const [page, setPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState<any | null>(null);

  const sortedCustomers = useMemo(() => {
    let sorted = [...realCustomers];
    if (sortFilter === 'Sort: Newest First') {
      sorted.sort((a, b) => b.memberSinceDate.getTime() - a.memberSinceDate.getTime());
    } else if (sortFilter === 'Sort: Oldest First') {
      sorted.sort((a, b) => a.memberSinceDate.getTime() - b.memberSinceDate.getTime());
    } else if (sortFilter === 'Sort: Highest Spend') {
      sorted.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortFilter === 'Sort: Most Orders') {
      sorted.sort((a, b) => b.orders - a.orders);
    }
    return sorted;
  }, [realCustomers, sortFilter]);

  const filtered = sortedCustomers.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || String(c.phone).includes(s);
    const matchType = typeFilter === 'All Customers' ||
      (typeFilter === 'Active' && c.status === 'Active') ||
      (typeFilter === 'Inactive' && c.status === 'Inactive');
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const total = realCustomers.length;
  const now = new Date();
  const newThisMonth = realCustomers.filter(c => c.memberSinceDate.getMonth() === now.getMonth() && c.memberSinceDate.getFullYear() === now.getFullYear()).length;
  const repeatCount = realCustomers.filter(c => c.orders > 1).length;
  const repeatPercentage = total > 0 ? ((repeatCount / total) * 100).toFixed(1) : '0';
  const totalRevenue = realCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Customers</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#D6B57A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c9a76d] transition-colors">
          <Download size={16} /> Export Customers
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', sub: 'All Customers', value: total.toString(), icon: Users, color: '#FFF7E6', ic: '#D6B57A' },
          { label: 'New This Month', sub: `Joined in ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`, value: newThisMonth.toString(), icon: UserPlus, color: '#ECFDF5', ic: '#34D399' },
          { label: 'Repeat Customers', sub: `${repeatPercentage}% of total customers`, value: repeatCount.toString(), icon: Crown, color: '#F5F3FF', ic: '#A78BFA' },
          { label: 'Total Spent', sub: 'All time from all customers', value: fmt(totalRevenue), icon: IndianRupee, color: '#FFF7ED', ic: '#FB923C' },
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
              placeholder="Search by name, email or phone..."
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Customers', 'Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['Sort: Newest First', 'Sort: Oldest First', 'Sort: Highest Spend', 'Sort: Most Orders'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button onClick={() => { setSearch(''); setTypeFilter('All Customers'); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-3 py-3 font-medium">Email</th>
                <th className="text-left px-3 py-3 font-medium">Phone</th>
                <th className="text-left px-3 py-3 font-medium">Orders</th>
                <th className="text-left px-3 py-3 font-medium">Total Spent</th>
                <th className="text-left px-3 py-3 font-medium">Member Since</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: c.color }}>
                        {c.initials}
                      </div>
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-500">{c.email}</td>
                  <td className="px-3 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-3 py-3 text-gray-700">{c.orders}</td>
                  <td className="px-3 py-3 font-semibold text-gray-800">{fmt(c.totalSpent)}</td>
                  <td className="px-3 py-3 text-gray-500">{c.memberSince}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewCustomer(c)} className="text-gray-400 hover:text-blue-500 transition-colors"><Eye size={15} /></button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} customers
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
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Customer Details</h3>
              <button onClick={() => setViewCustomer(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: viewCustomer.color }}>{viewCustomer.initials}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{viewCustomer.name}</h4>
                  <p className="text-sm text-gray-500">{viewCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{viewCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-sm font-medium text-gray-800">{viewCustomer.memberSince}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Orders</p>
                  <p className="text-sm font-medium text-gray-800">{viewCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Spent</p>
                  <p className="text-sm font-medium text-gray-800">{fmt(viewCustomer.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
