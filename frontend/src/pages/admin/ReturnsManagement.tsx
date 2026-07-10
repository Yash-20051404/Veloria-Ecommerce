import React, { useState, useEffect } from 'react';
import { Search, Package, ChevronDown, ChevronUp, CheckCircle, XCircle, RotateCcw, MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) return token;
  const storage = localStorage.getItem('veloria-auth-storage');
  if (storage) {
    try { return JSON.parse(storage).state?.token || ''; } catch(e) {}
  }
  return '';
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
};

const refundColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Refunded: 'bg-green-100 text-green-700',
};

export default function ReturnsManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const limit = 15;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
        type: typeFilter,
        ...(search ? { search } : {})
      });
      const res = await fetch(`${API_URL}/admin/returns?${params}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 0);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter, typeFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchRequests();
  };

  const handleAction = async (id: string, action: string, body?: any) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/admin/returns/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ action, ...body })
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
        setExpandedId(null);
      }
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleRefundUpdate = async (id: string, refundStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/admin/returns/${id}/refund`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ refundStatus })
      });
      await res.json();
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleExchangeComplete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/admin/returns/${id}/exchange-complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      await res.json();
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleSaveNotes = async (id: string) => {
    if (!adminNotes) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/admin/returns/${id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ notes: adminNotes })
      });
      await res.json();
      fetchRequests();
      setAdminNotes('');
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns & Exchanges</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all return and exchange requests</p>
        </div>
        <div className="text-sm text-gray-500">Total: {total} requests</div>
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder="Search by Order ID or Customer..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D6B57A]"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option><option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option><option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="ALL">All Types</option>
          <option value="RETURN">Return</option><option value="EXCHANGE">Exchange</option>
        </select>
        <button onClick={handleSearch} className="bg-[#D6B57A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c9a76d]">Search</button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-xl text-gray-400">
          <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
          <p>No return or exchange requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Order ID</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Reason</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Refund</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => {
                  const isExpanded = expandedId === req._id;
                  const order = req.orderId || {};
                  const user = req.userId || {};
                  return (
                    <React.Fragment key={req._id}>
                      <tr className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-[#D6B57A]/5' : ''}`} onClick={() => { setExpandedId(isExpanded ? null : req._id); setAdminNotes(req.adminNotes || ''); }}>
                        <td className="px-4 py-3 font-mono text-xs">{order?.orderId || (req._id || '').substring(0, 8)}</td>
                        <td className="px-4 py-3 text-gray-700">{user?.name || 'N/A'}<br/><span className="text-xs text-gray-400">{user?.email}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${req.requestType === 'RETURN' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{req.requestType}</span></td>
                        <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{req.reason}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>{req.status}</span></td>
                        <td className="px-4 py-3">{req.requestType === 'RETURN' ? <span className={`px-2 py-1 rounded-full text-xs font-medium ${refundColors[req.refundStatus] || ''}`}>{req.refundStatus || 'Pending'}</span> : '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">{isExpanded ? <ChevronUp className="h-4 w-4 text-[#D6B57A]" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}</td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="bg-[#FCFCFC] p-6 border-b border-gray-100">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div><span className="text-gray-400">Customer:</span><p className="text-gray-700">{user?.name} ({user?.email})</p></div>
                                  <div><span className="text-gray-400">Phone:</span><p className="text-gray-700">{user?.phone || 'N/A'}</p></div>
                                  {req.exchangeVariant && <div><span className="text-gray-400">Exchange Variant:</span><p className="text-gray-700">{req.exchangeVariant}</p></div>}
                                </div>
                                {req.description && <div><p className="text-gray-400 text-sm">Description:</p><p className="text-gray-600 mt-1">{req.description}</p></div>}
                                {req.images?.length > 0 && <div><p className="text-gray-400 text-sm mb-2">Images:</p><div className="flex flex-wrap gap-2">{req.images.map((img: string, i: number) => <img key={i} src={img} className="h-20 w-20 object-cover rounded border" alt="" />)}</div></div>}
                                <div><p className="text-gray-400 text-sm mb-2">Items:</p>{req.items?.map((item: any, i: number) => <div key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded"><span>{item.productName}</span><span>Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString('en-IN')}</span></div>)}</div>
                              </div>
                              <div className="space-y-4">
                                {req.status === 'PENDING' && (
                                  <div className="flex flex-col gap-2">
                                    <button disabled={actionLoading === req._id} onClick={() => handleAction(req._id, 'APPROVE')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                                      <CheckCircle className="h-4 w-4" /> Approve
                                    </button>
                                    <button disabled={actionLoading === req._id} onClick={() => handleAction(req._id, 'REJECT')} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50">
                                      <XCircle className="h-4 w-4" /> Reject
                                    </button>
                                  </div>
                                )}
                                {/* यहाँ हमने APPROVED के साथ PROCESSING स्टेटस को भी जोड़ दिया है */}
{req.requestType === 'RETURN' && ['APPROVED', 'PROCESSING'].includes(req.status) && req.refundStatus !== 'Refunded' && (  <div className="flex flex-col gap-2">
    {req.refundStatus === 'Pending' && (
      <button 
        disabled={actionLoading === req._id} 
        onClick={() => handleRefundUpdate(req._id, 'Processing')} 
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4" /> Mark Refund Processing
      </button>
    )}
    {req.refundStatus === 'Processing' && (
      <button 
        disabled={actionLoading === req._id} 
        onClick={() => handleRefundUpdate(req._id, 'Refunded')} 
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
      >
        <CheckCircle className="h-4 w-4" /> Mark Refunded
      </button>
    )}
  </div>
)}
                                {req.status === 'APPROVED' && req.requestType === 'EXCHANGE' && (
                                  <button disabled={actionLoading === req._id} onClick={() => handleExchangeComplete(req._id)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 w-full"><CheckCircle className="h-4 w-4" /> Exchange Completed</button>
                                )}
                                {['COMPLETED', 'REJECTED'].includes(req.status) && (
                                  <div className={`p-3 rounded-lg text-sm ${req.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {req.status === 'COMPLETED' ? '✓ Completed' : '✗ Rejected'}
                                    {req.processedAt && <p className="text-xs mt-1">on {new Date(req.processedAt).toLocaleDateString('en-IN')}</p>}
                                  </div>
                                )}
                                <div className="border-t pt-4">
                                  <label className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4" /> Admin Notes</label>
                                  <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#D6B57A] resize-none" placeholder="Internal notes..." />
                                  <button disabled={actionLoading === req._id} onClick={() => handleSaveNotes(req._id)} className="mt-2 text-xs text-[#D6B57A] hover:text-black">Save Notes</button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="text-sm text-gray-600 disabled:opacity-30">Previous</button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="text-sm text-gray-600 disabled:opacity-30">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}