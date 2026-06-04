import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Tag, Settings, LogOut, Bell, ChevronDown, Menu, Diamond, User, CheckCircle, Info, XCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Coupons', icon: Tag, path: '/admin/coupons' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastData, setToastData] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #ORD12345 received', read: false },
    { id: 2, text: 'Low stock alert: Royal Emerald Ring', read: false },
    { id: 3, text: 'New review from Priya Sharma', read: false },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: any) => {
      setToastData(e.detail);
      setTimeout(() => setToastData(null), 3000);
    };
    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    localStorage.removeItem('veloria-auth-storage');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[#1a1008] transition-all duration-300 ${sidebarOpen ? 'w-52' : 'w-0 overflow-hidden'}`}
        style={{ minWidth: sidebarOpen ? '208px' : '0' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center py-6 px-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Diamond size={22} className="text-[#D6B57A]" />
            <span className="text-[#D6B57A] text-2xl font-bold tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>VELORIA</span>
          </div>
          <span className="text-gray-400 text-[10px] tracking-[0.25em] uppercase">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-[#D6B57A] text-[#1a1008] font-semibold'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-5 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {sidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D6B57A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute top-full right-12 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-xs text-[#D6B57A] hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(notifications.map(x => x.id === n.id ? {...x, read: true} : x))} className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-amber-50/30' : ''}`}>
                      <p className={`text-sm ${!n.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div 
              onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#D6B57A] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Administrator' : 'User'}</div>
              </div>
              <ChevronDown size={15} className="text-gray-400" />
            </div>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1">
                <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Settings size={15} /> Settings</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={15} /> Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {toastData && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toastData.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          toastData.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {toastData.type === 'success' && <CheckCircle size={18} />}
          {toastData.type === 'error' && <XCircle size={18} />}
          {toastData.type === 'info' && <Info size={18} />}
          {toastData.message}
        </div>
      )}
    </div>
  );
}
