import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, IndianRupee, Clock, Truck, Search, SlidersHorizontal, RotateCcw, Download, Eye, ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { toast } from '../../layouts/toast';
import { useOrderStore } from '@/store/orderStore';

const fmt = (n: any) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

const paymentColors: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Refunded: 'bg-gray-100 text-gray-600',
};
const paymentDot: Record<string, string> = {
  Paid: 'bg-green-500',
  Pending: 'bg-yellow-500',
  Refunded: 'bg-gray-400',
};

const statusColors: Record<string, string> = {
  Processing: 'text-yellow-700',
  Confirmed: 'text-blue-700',
  Shipped: 'text-purple-700',
  'Out for Delivery': 'text-indigo-600',
  Delivered: 'text-green-700',
  Cancelled: 'text-red-600',
  Refunded: 'text-gray-600',
};
const statusDot: Record<string, string> = {
  Processing: 'bg-yellow-400',
  Confirmed: 'bg-blue-500',
  Shipped: 'bg-purple-500',
  'Out for Delivery': 'bg-indigo-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
  Refunded: 'bg-gray-400',
};

const ITEMS_PER_PAGE = 10;

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Status');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [statusModalId, setStatusModalId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const matchSearch = String(o.orderId || '').toLowerCase().includes(s) || String(o.customerName || '').toLowerCase().includes(s) || String(o.email || '').toLowerCase().includes(s);
    const matchStatus = statusFilter === 'All Status' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'All Payment Status' || o.paymentStatus === paymentFilter;
    const matchDate = !dateFilter || new Date(o.createdAt) >= new Date(dateFilter);
    return matchSearch && matchStatus && matchPayment && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Orders</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#D6B57A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c9a76d] transition-colors">
          <Download size={16} /> Export Orders
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', sub: 'All Orders', value: totalOrders.toString(), icon: ShoppingBag, color: '#FFF7E6', ic: '#D6B57A' },
          { label: 'Total Revenue', sub: 'From All Orders', value: fmt(totalRevenue), icon: IndianRupee, color: '#ECFDF5', ic: '#34D399' },
          { label: 'Pending Orders', sub: 'Awaiting Action', value: pendingOrders.toString(), icon: Clock, color: '#FFF7ED', ic: '#FB923C' },
          { label: 'Delivered Orders', sub: 'Completed', value: deliveredOrders.toString(), icon: Truck, color: '#F5F3FF', ic: '#A78BFA' },
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
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by Order ID, Customer Name or Email..."
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Status', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            {['All Payment Status', 'Paid', 'Pending', 'Refunded'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2">
            <Calendar size={14} /> 
            <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} className="outline-none bg-transparent" />
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button onClick={() => { setSearch(''); setStatusFilter('All Status'); setPaymentFilter('All Payment Status'); setDateFilter(''); setPage(1); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-3 py-3 font-medium">Customer</th>
                <th className="text-left px-3 py-3 font-medium">Amount</th>
                <th className="text-left px-3 py-3 font-medium">Payment</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-left px-3 py-3 font-medium">Date</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(o => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{o.orderId}</p>
                    <p className="text-xs text-gray-400">{o.items?.length || 0} {(o.items?.length || 0) === 1 ? 'Item' : 'Items'}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-800">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-3 py-3 font-semibold text-gray-800">{fmt(o.amount)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[o.paymentStatus] || 'bg-green-100 text-green-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${paymentDot[o.paymentStatus] || 'bg-green-500'}`} />
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusColors[o.status] || 'text-gray-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status] || 'bg-gray-400'}`} />
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-700">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                    <p className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-IN') : ''}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors"><Eye size={15} /></button>
                      <button onClick={() => setStatusModalId(o._id)} className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                        Update Status <ChevronDown size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} orders
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
      {statusModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Update Order Status</h3>
            </div>
            <div className="p-5 space-y-4">
              <select 
                value={newStatus} 
                onChange={e => setNewStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#D6B57A]"
              >
                <option value="">Select status</option>
                {['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
              <button onClick={() => { setStatusModalId(null); setNewStatus(''); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">Cancel</button>
              <button onClick={async () => {
                if(newStatus && statusModalId) {
                  await updateOrderStatus(statusModalId, newStatus);
                  setStatusModalId(null);
                  setNewStatus('');
                  toast('Order status updated');
                }
              }} className="px-4 py-2 text-sm font-medium text-white bg-[#D6B57A] rounded-lg hover:bg-[#c9a76d]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
