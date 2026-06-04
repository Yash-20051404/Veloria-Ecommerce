import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Truck, Plus, Pencil, Trash2 } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';

const fmt = (n: any) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

const statusColors: Record<string, string> = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const stockStatusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'Low Stock': 'bg-orange-100 text-orange-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const { products, fetchProducts, loading } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  // Jab bhi Dashboard open ho, API se latest products fetch karo
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  const statCards = [
    { label: 'Total Revenue', value: fmt(totalRevenue), change: '+24.5%', up: true, icon: IndianRupee, color: '#FFF7E6', iconColor: '#D6B57A' },
    { label: 'Total Orders', value: totalOrders.toString(), change: '+18.7%', up: true, icon: ShoppingCart, color: '#EEF2FF', iconColor: '#818CF8' },
    { label: 'Total Customers', value: '128', change: '+12.4%', up: true, icon: Users, color: '#ECFDF5', iconColor: '#34D399' },
    { label: 'Pending Deliveries', value: pendingOrders.toString(), change: '-6.2%', up: false, icon: Truck, color: '#FFF1F2', iconColor: '#FB7185' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, change, up, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                <span>{change} from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: color }}>
              <Icon size={22} style={{ color: iconColor }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders + Recent Products */}
            {/* Professional Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 space-y-5">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-[#D6B57A] hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium">Order ID</th>
                    <th className="text-left px-3 py-3 font-medium">Customer</th>
                    <th className="text-left px-3 py-3 font-medium">Amount</th>
                    <th className="text-left px-3 py-3 font-medium">Date</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-600 font-medium">{order.orderId}</td>
                      <td className="px-3 py-3 text-gray-700">{order.customerName}</td>
                      <td className="px-3 py-3 text-gray-700 font-medium">{fmt(order.amount)}</td>
                      <td className="px-3 py-3 text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Low Stock Alerts</h2>
              <Link to="/admin/products" className="text-sm text-[#D6B57A] hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover" />
                  <span className="flex-1 text-sm text-gray-700">{p.name}</span>
                  <span className="text-sm font-semibold text-red-500">{p.stock} Left</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          {/* Recent Products Full Height */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full min-h-[760px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Recent Products</h2>
              <Link to="/admin/products" className="flex items-center gap-1 text-sm text-[#D6B57A] hover:underline">
                <Plus size={14} /> Add Product
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium">Product</th>
                    <th className="text-left px-3 py-3 font-medium">Price</th>
                    <th className="text-left px-3 py-3 font-medium">Stock</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                    <th className="text-left px-3 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 8).map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                          <span className="text-gray-700 font-medium text-xs">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-700 font-medium">{fmt(p.price)}</td>
                      <td className="px-3 py-3 text-gray-600">{p.stock}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          p.status === 'Active' ? 'bg-white text-green-600 border-green-200' :
                          p.status === 'Low Stock' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          'bg-red-50 text-red-600 border-red-200'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-[#D6B57A]"><Pencil size={15} /></button>
                          <button className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
