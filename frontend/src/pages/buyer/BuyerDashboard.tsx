import { useState, useEffect, memo, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, ShoppingBag, MapPin, LogOut, ShieldCheck,
  ChevronRight, Package, ArrowRight, Edit2, Plus, Heart, Search,
  UserCircle, LifeBuoy, Key, Clock, Smartphone, 
  MessageSquare, Mail, CheckCircle, Trash2, Truck,
  AlertTriangle, Eye, EyeOff, Check,
  RotateCcw, RefreshCw
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useBuyerStore } from '@/store/buyerStore'
import { useOrderStore } from '@/store/orderStore'
import ReturnExchangeModal from './ReturnExchangeModal'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

const getAuthToken = () => {
  let token = (useAuthStore.getState() as any).token;
  if (token) return token;
  token = localStorage.getItem('token');
  if (token) return token;
  const storage = localStorage.getItem('veloria-auth-storage');
  if (storage) {
    try { return JSON.parse(storage).state?.token || ''; } catch(e) {}
  }
  return '';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// ──────────────── UI COMPONENTS ────────────────

const LuxuryInput = ({ label, type = "text", value, defaultValue, onChange, disabled = false, className = "", required = false }: any) => {
  const isFilled = value || defaultValue || type === 'date';
  
  return (
  <div className={`relative w-full ${className}`}>
    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`peer block w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      placeholder=" "
    />
    <label className={`absolute top-4 -z-10 origin-[0] -translate-y-6 scale-75 transform text-[10px] uppercase tracking-widest duration-300 ${!isFilled ? 'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100' : ''} peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D6B57A] ${disabled ? 'text-white/30' : 'text-white/50'}`}>
      {label} {required && <span className="text-[#D6B57A]">*</span>}
    </label>
  </div>
)
}

const ActionButton = ({ children, onClick, loading, primary, icon: Icon, danger, className = '' }: any) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`group relative flex items-center justify-center gap-2 overflow-hidden px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${className} ${
      primary 
        ? 'bg-[#D6B57A] text-black hover:bg-white' 
        : danger 
          ? 'border border-red-500/30 text-red-400 hover:bg-red-500/10'
          : 'border border-white/20 text-white hover:border-[#D6B57A] hover:text-[#D6B57A]'
    } disabled:opacity-50`}
    style={inter}
  >
    {loading ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : Icon && <Icon className="h-3.5 w-3.5" />}
    {children}
  </button>
)

const ToggleSwitch = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`relative h-5 w-9 rounded-full transition-colors duration-300 flex items-center px-0.5 ${active ? 'bg-[#D6B57A]' : 'bg-white/20'}`}
  >
    <motion.div 
      layout
      className="h-4 w-4 rounded-full bg-white shadow-md" 
      animate={{ x: active ? 16 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
)

const DashboardNavbar = memo(({ onProfileClick }: { onProfileClick: () => void }) => {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { user } = useAuthStore()
  const { profile } = useBuyerStore()

  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-12">
        <button onClick={() => navigate('/')} className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</button>
        <div className="flex items-center gap-6 text-white/60">
          <Search className="h-4 w-4 cursor-pointer hover:text-[#D6B57A] transition-colors" />
          <div className="relative cursor-pointer group" onClick={() => navigate('/wishlist')}>
            <Heart className="h-4 w-4 group-hover:text-[#D6B57A] transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">{wishlistCount}</span>
            )}
          </div>
          <div className="relative cursor-pointer group" onClick={() => navigate('/cart')}>
            <ShoppingBag className="h-4 w-4 group-hover:text-[#D6B57A] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">{cartCount}</span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer" onClick={onProfileClick}>
            {profile?.avatar_url ? (
              <div className="h-8 w-8 rounded-full bg-white/5 border border-[#D6B57A]/30 flex items-center justify-center text-[#D6B57A] text-xs" style={cormorant}>{(profile?.full_name?.charAt(0) || '').toUpperCase()}</div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/5 border border-[#D6B57A]/30 flex items-center justify-center text-[#D6B57A] text-xs" style={cormorant}>{(profile?.full_name?.charAt(0) || '').toUpperCase()}</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
})

// ──────────────── TABS CONTENT ────────────────

const OverviewTab = ({ handleTabChange }: { handleTabChange: (t: string, id?: string) => void }) => {
  const { profile, addresses, loading } = useBuyerStore()
  const { orders } = useOrderStore()
  const navigate = useNavigate()
  const wishlistCount = useWishlistStore(state => state.wishlistCount)

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const totalOrdersCount = orders?.length || 0;
  const recentOrders = orders?.slice(0, 3) || [];
  const addressesCount = addresses?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="flex flex-col gap-8"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[28px] border border-[#D6B57A]/20 bg-[#050505] min-h-[320px] shadow-[0_0_60px_rgba(214,181,122,0.08)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] h-full">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-3" style={inter}>
              Welcome Back
            </p>
            
            <h1 className="text-5xl md:text-6xl text-white mb-4" style={cormorant}>
              {profile?.full_name || ''}
            </h1>
            <p className="text-white/60 max-w-lg leading-relaxed mb-8" style={inter}>
              Manage your orders, saved creations, addresses and exclusive maison privileges from one elegant destination.
            </p>

            <div className="flex flex-wrap gap-4 ">
              <ActionButton primary onClick={() => handleTabChange('orders')}>
                View Orders
              </ActionButton>
              <ActionButton onClick={() => handleTabChange('wishlist')}>
                Wishlist
              </ActionButton>
            </div>
          </div>

          <div className="relative h-full min-h-[320px]">
            <img
              src="/ring-showcase.jpeg"
              alt="Veloria Ring"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Orders', value: totalOrdersCount.toString(), icon: Package, tab: 'orders', action: 'View All Orders' },
          { label: 'Wishlist Items', value: wishlistCount.toString(), icon: Heart, tab: 'wishlist', action: 'View Wishlist' },
          { label: 'Saved Addresses', value: addressesCount.toString(), icon: MapPin, tab: 'addresses', action: 'Manage Addresses' }
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => handleTabChange(stat.tab)}
            className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#080808] to-[#050505] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B57A]/40 hover:shadow-[0_0_35px_rgba(214,181,122,0.08)] group cursor-pointer"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/5">
              <stat.icon className="h-5 w-5 text-[#D6B57A] group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl text-white mb-1" style={cormorant}>{stat.value}</p>
            <span className="text-[9px] uppercase tracking-widest text-white/50" style={inter}>{stat.label}</span>
            <p className="mt-4 text-[9px] uppercase tracking-widest text-[#D6B57A] flex items-center gap-1 group-hover:text-white transition-colors" style={inter}>
              {stat.action} <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
        <div className="rounded-[28px] border border-white/10 bg-[#050505] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl text-white" style={cormorant}>Recent Orders</h3>
          </div>

          <div className="space-y-4 min-h-[260px]">
            {recentOrders.length === 0 && (
              <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
                <div>
                  <Package className="mx-auto mb-4 h-10 w-10 text-[#D6B57A]/50" />
                  <p className="text-lg text-white" style={cormorant}>No Orders Yet</p>
                  <p className="mt-2 text-xs text-white/40" style={inter}>
                    Your luxury purchases will appear here.
                  </p>
                </div>
              </div>
            )}
            {recentOrders.map((order: any) => (
              <button
                key={order.orderId || order._id || order.id}
                onClick={() => handleTabChange('orders', order.orderId || order._id || order.id)}
                className="w-full text-left border border-white/5 hover:border-[#D6B57A]/30 transition-colors p-5 bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shrink-0">
                    <img
                      src={order.items?.[0]?.image || order.order_items?.[0]?.image_url || '/ring-showcase.jpeg'}
                      alt="Order"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate" style={inter}>
                      {order.items?.[0]?.name || order.order_items?.[0]?.product_name || `Order #${(order.orderId || order.id || order._id || '').split('-')[0].toUpperCase()}`}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full border border-[#D6B57A]/30 bg-[#D6B57A]/10 px-2 py-1 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white" style={inter}>{formatPrice(order.amount || order.total_amount || 0)}</p>
                    <ChevronRight className="ml-auto mt-2 h-4 w-4 text-[#D6B57A]" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#050505] p-8">
          <h3 className="text-2xl text-white mb-8" style={cormorant}>Quick Actions</h3>

          <div className="space-y-4">
            {[
              {
                title: 'Track Order',
                subtitle: 'Live shipping updates',
                action: () => handleTabChange('orders'),
                icon: Truck,
              },
              {
                title: 'Add Address',
                subtitle: 'Manage delivery locations',
                action: () => handleTabChange('addresses'),
                icon: MapPin,
              },
              {
                title: 'Continue Shopping',
                subtitle: 'Explore new arrivals',
                action: () => navigate('/jewels'),
                icon: ShoppingBag,
              },
              
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="group w-full overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent p-4 text-left transition-all duration-300 hover:border-[#D6B57A]/40 hover:shadow-[0_0_30px_rgba(214,181,122,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D6B57A]/30 bg-[#D6B57A]/10">
                    <item.icon className="h-5 w-5 text-[#D6B57A]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-white" style={inter}>{item.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40" style={inter}>
                      {item.subtitle}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-[#D6B57A] transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  )
}

const ProfileTab = () => {
  const { user } = useAuthStore()
  const { profile, updateProfile } = useBuyerStore()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getSafeDate = (dob: any) => {
    if (!dob) return { year: '1990', month: '05', day: '15' };
    try {
      const str = typeof dob === 'string' ? dob : new Date(dob).toISOString();
      const parts = str.split('T')[0].split('-');
      return { year: parts[0] || '1990', month: parts[1] || '05', day: parts[2] || '15' };
    } catch (e) {
      return { year: '1990', month: '05', day: '15' };
    }
  }

  const initialDob = getSafeDate(profile?.date_of_birth);
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    dobDay: initialDob.day,
    dobMonth: initialDob.month,
    dobYear: initialDob.year,
    gender: profile?.gender || 'Male',
  })

  useEffect(() => {
    if (profile) {
      const safeDob = getSafeDate(profile.date_of_birth);
      setFormData({
        name: profile.full_name || '',
        phone: profile.phone || '',
        dobDay: safeDob.day,
        dobMonth: safeDob.month,
        dobYear: safeDob.year,
        gender: profile.gender || 'Male',
      })
    }
  }, [profile])
  
  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    const userId = user.id || (user as any)._id;
    const date_of_birth = `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`
    try {
      await updateBuyerProfileAPI(userId, {
        full_name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth
      });
      if (updateProfile) {
        await updateProfile(userId, {
          full_name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          date_of_birth
        });
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      alert(err.message || 'Failed to update profile. Please try again.');
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>Profile Management</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
            Personal Information & Preferences
          </p>
        </div>

      </div>

      <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-6 md:p-8">

<div className="flex flex-col items-center gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="relative group">
            <div className="h-36 w-36 rounded-full border-2 border-[#D6B57A]/30 bg-gradient-to-br from-[#0A0A0A] to-[#111111] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(214,181,122,0.12)]">
              <span className="text-5xl text-[#D6B57A]" style={cormorant}>{(formData.name || '').charAt(0).toUpperCase() || 'V'}</span>
            </div>
          </div>
          <div className="text-center ">
            <div className="mb-4 text-center">
              <h3 className="text-2xl text-white" style={cormorant}>
                {profile?.full_name || ''}
              </h3>
              <div className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/60" style={inter}>
                Verified Account
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-4xl rounded-[32px] border border-[#D6B57A]/10 bg-[#050505] p-8 md:p-10 shadow-[0_0_60px_rgba(214,181,122,0.06)]">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Full Name *</p>
              <LuxuryInput
                label="Enter your full name"
                value={formData.name}
                onChange={(e: any) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Email Address</p>
              <LuxuryInput
                label="Registered Email"
                value={user?.email || ''}
                disabled
                className="pointer-events-none"
              />
              <p className="mt-2 text-[10px] text-white/40">Email address cannot be changed</p>
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Mobile Number *</p>
              <LuxuryInput
                label="Enter mobile number"
                value={formData.phone}
                onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-widest text-white/50">Date Of Birth</p>
              <div className="col-span-3 grid grid-cols-3 gap-4 mb-2">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Day</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Month</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Year</p>
              </div>
              <div className="grid grid-cols-3 gap-4 items-end">
                <select
                  value={formData.dobDay}
                  onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })}
                  className="border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.dobMonth}
                  onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })}
                  className="border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.dobYear}
                  onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}
                  className="border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
                >
                  {Array.from({ length: 80 }, (_, i) => (
                    <option key={2025 - i} value={String(2025 - i)}>
                      {2025 - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[10px] uppercase tracking-widest text-white/50">Gender</p>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          
          <div className="mt-10">
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden">
                <ActionButton primary onClick={handleSave} loading={loading}>Save Profile Changes</ActionButton>
              </div>

              {saved && (
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-400 text-xs">
                  <Check className="h-4 w-4" />
                  Changes Saved Successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
</div>
    </motion.div>
  )
}

const OrderDetails = ({ orderId, onBack, setIsReturnModalOpen, setReturnOrderId }: { orderId: string, onBack: () => void, setIsReturnModalOpen: (isOpen: boolean) => void, setReturnOrderId: (id: string | null) => void }) => {
  const { orders } = useOrderStore();
  const order = orders.find(o => o.orderId === orderId || o.id === orderId || o._id === orderId);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<'RETURN' | 'EXCHANGE' | null>(null);
  const returnOrder = useMemo(() => order, [order]);

  if (!order) return <div className="text-white/50 text-center py-20 border border-white/10 bg-[#050505]">Order not found.</div>;

  const labels = ['Order Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  
  let currentIndex = 0;
  const currentStatus = order.status?.toUpperCase() || 'PENDING';
  if (['PROCESSING', 'PAYMENT_RECEIVED', 'PAID', 'CREATION_PREPARING'].includes(currentStatus)) currentIndex = 1;
  else if (['SHIPPED', 'INSURED_SHIPMENT', 'DISPATCHED'].includes(currentStatus)) currentIndex = 2;
  else if (['OUT_FOR_DELIVERY'].includes(currentStatus)) currentIndex = 3;
  else if (['DELIVERED'].includes(currentStatus)) currentIndex = 4;
  else if (['CANCELLED', 'REFUNDED'].includes(currentStatus)) currentIndex = -1;

  const handleDownloadInvoice = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/orders/${order.orderId || order._id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Invoice not found on server.");
      }
      console.log("CONTENT TYPE:", res.headers.get("content-type"));
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Veloria-Invoice-${order.orderId || order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e: any) {
      alert(e.message || "Failed to download invoice");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 hover:text-white mb-8 transition-colors" style={inter}>
        <ArrowRight className="h-3 w-3 rotate-180" /> Back to Orders
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="border border-white/10 bg-[#050505] p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl text-white" style={cormorant}>Order #{order.orderId || order.id || order._id}</h2>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>{new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
              <span className="border border-[#D6B57A]/40 bg-[#D6B57A]/10 text-[#D6B57A] px-4 py-1.5 text-[9px] uppercase tracking-widest" style={inter}>{order.status}</span>
            </div>

            {/* Luxury Timeline */}
            <div className="relative py-8">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 bg-[#D6B57A] -translate-y-1/2 transition-all duration-1000" style={{ width: `${Math.max(0, (currentIndex / (labels.length - 1)) * 100)}%` }} />
              
              <div className="relative flex justify-between">
                {labels.map((label, idx) => {
                  const isCompleted = currentIndex !== -1 && idx <= currentIndex;
                  const isActive = idx === currentIndex;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${isCompleted ? 'bg-[#D6B57A] border-[#D6B57A]' : 'bg-[#050505] border-white/20'}`}>
                        {isCompleted && <Check className="h-2.5 w-2.5 text-black" />}
                      </div>
                      <span className={`absolute -bottom-8 w-24 text-center text-[9px] uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-[#D6B57A]/80' : 'text-white/30'}`} style={inter}>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-8">
            <h3 className="text-xl text-white mb-6" style={cormorant}>Ordered Creations</h3>
            <div className="flex flex-col gap-6">
              {(order.items || order.order_items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-6 border-b border-white/5 last:border-0 pb-6 last:pb-0">
                  <div className="h-24 w-20 bg-[#0A0A0A] shrink-0 border border-white/5">
                    <img src={item.image || item.image_url || '/ring.jpeg'} alt={item.name || item.product_name} className="h-full w-full object-cover opacity-80" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="text-lg text-white" style={cormorant}>{item.name || item.product_name}</h4>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center text-sm text-white" style={inter}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-8">
          <div className="border border-white/10 bg-[#050505] p-8">
            <h3 className="text-xl text-white mb-6" style={cormorant}>Shipping Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Courier Partner</p>
                <p className="text-sm text-white" style={inter}>Veloria Secure Logistics</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Tracking Number</p>
                <p className="text-sm text-[#D6B57A] tracking-widest" style={inter}>{order.trackingNumber || `VELTRK${(order.orderId || order._id || '').substring(0, 6).toUpperCase()}`}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Shipping Address</p>
                <p className="text-sm text-white/80 leading-relaxed" style={inter}>
                  {[
                    order.address?.fullName,
                    order.address?.address_line_1,
                    order.address?.addressLine1,
                    order.address?.address_line_2,
                    order.shipping_address?.address_line_1,
                    order.shipping_address?.address_line_2,
                    order.address?.city || order.shipping_address?.city,
                    order.address?.state || order.shipping_address?.state,
                    order.address?.postal_code ||
                      order.address?.zip ||
                      order.shipping_address?.postal_code,
                    order.address?.country || order.shipping_address?.country
                  ]
                    .filter(Boolean)
                    .join(", ") || "Address not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-8">
            <h3 className="text-xl text-white mb-6" style={cormorant}>Payment Summary</h3>
            <div className="space-y-3 border-b border-white/10 pb-4 mb-4 text-xs tracking-widest text-white/60" style={inter}>
              <div className="flex justify-between"><span>Method</span><span className="text-white">{order.payment_method || 'Online'}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="text-[#D6B57A]">{order.paymentStatus || order.payment_status || 'Paid'}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span className="text-white">{formatPrice(order.amount || order.total_amount || 0)}</span></div>
            </div>
            <div className="flex justify-between text-sm uppercase tracking-widest text-white" style={inter}>
              <span>Total Paid</span>
              <span className="text-lg text-[#D6B57A]" style={cormorant}>{formatPrice(order.amount || order.total_amount || 0)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <ActionButton primary onClick={() => navigate(`/track-order?id=${order.orderId || order._id}`)}>
              Track Order
            </ActionButton>
            {order.status?.toUpperCase() === 'DELIVERED' && (
              <>
                <ActionButton onClick={() => setModalType('RETURN')}>
                  Return
                </ActionButton>
                <ActionButton onClick={() => setModalType('EXCHANGE')}>
                  Exchange
                </ActionButton>
              </>
            )}
            <ActionButton onClick={handleDownloadInvoice}>
              Download Invoice
            </ActionButton>
          </div>
        </div>
      </div>
      {/* Return / Exchange Modal */}
      {modalType && returnOrder && (
        <ReturnExchangeModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          order={returnOrder}
          requestType={modalType}
        />
      )}
    </motion.div>
  )
}

const OrdersTab = ({ activeOrderId, setActiveOrderId, navigate, setIsReturnModalOpen, setReturnOrderId }: { activeOrderId: string | null, setActiveOrderId: (id: string | null) => void, navigate: any, setIsReturnModalOpen: (isOpen: boolean) => void, setReturnOrderId: (id: string | null) => void }) => {
  const { orders } = useOrderStore();
  const [activeSubTab, setActiveSubTab] = useState('active')

  if (activeOrderId) {
    return <OrderDetails orderId={activeOrderId} onBack={() => setActiveOrderId(null)} setIsReturnModalOpen={setIsReturnModalOpen} setReturnOrderId={setReturnOrderId} />
  }

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status?.toUpperCase()))
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status?.toUpperCase()))
  const displayOrders = activeSubTab === 'active' ? activeOrders : pastOrders

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>My Orders</h2>
        <div className="flex gap-4 border-b border-white/10 pb-1">
          <button onClick={() => setActiveSubTab('active')} className={`pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${activeSubTab === 'active' ? 'text-[#D6B57A] border-b border-[#D6B57A]' : 'text-white/50 hover:text-white'}`} style={inter}>Active Orders ({activeOrders.length})</button>
          <button onClick={() => setActiveSubTab('past')} className={`pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${activeSubTab === 'past' ? 'text-[#D6B57A] border-b border-[#D6B57A]' : 'text-white/50 hover:text-white'}`} style={inter}>Past Orders ({pastOrders.length})</button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {displayOrders.map((order) => (
          <div key={order.orderId || order._id || order.id} onClick={() => setActiveOrderId(order.orderId || order._id || order.id)} className="border border-white/10 bg-[#050505] overflow-hidden cursor-pointer group hover:border-[#D6B57A]/40 transition-colors rounded-2xl">
            <div className="border-b border-white/5 bg-white/[0.02] p-6 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Order Placed</p>
                  <p className="text-sm text-white" style={inter}>{new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Total Amount</p>
                  <p className="text-sm text-white" style={inter}>{formatPrice(order.amount || order.total_amount || 0)}</p>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Order Number</p>
                <p className="text-sm text-[#D6B57A]" style={inter}>#{order.orderId || (order.id || order._id || '').split('-')[0].toUpperCase()}</p>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex gap-6">
                <div className="h-32 w-28 bg-[#0A0A0A] shrink-0 border border-white/5">
                  <img src={order.items?.[0]?.image || order.order_items?.[0]?.image_url || '/ring.jpeg'} alt="Product" className="h-full w-full object-cover opacity-80" />
                </div>
                <div className="flex flex-col justify-center py-2">
                  <h4 className="text-xl text-white mb-2" style={cormorant}>{(order.items || order.order_items)?.length > 1 ? `${order.items?.[0]?.name || order.order_items?.[0]?.product_name} +${(order.items || order.order_items).length - 1} more` : order.items?.[0]?.name || order.order_items?.[0]?.product_name}</h4>
                  <p className="text-xs text-white/50 mb-4" style={inter}>{order.paymentStatus || order.payment_status || 'Paid'}</p>
                  {['DELIVERED'].includes(order.status?.toUpperCase()) ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-[10px] uppercase tracking-widest" style={inter}>{order.status}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${['CANCELLED', 'REFUNDED'].includes(order.status?.toUpperCase()) ? 'bg-red-500' : 'bg-[#D6B57A] shadow-[0_0_8px_#D6B57A]'}`} />
                      <span className={`text-[10px] uppercase tracking-widest ${['CANCELLED', 'REFUNDED'].includes(order.status?.toUpperCase()) ? 'text-red-400' : 'text-white'}`} style={inter}>{order.status}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                <ActionButton primary icon={ArrowRight} onClick={(e: any) => { e.stopPropagation(); setActiveOrderId(order.orderId || order._id || order.id); }} className="rounded-full">View Details</ActionButton>
              </div>
            </div>
          </div>
        ))}
        {displayOrders.length === 0 && (
          <div className="py-20 text-center border border-white/10 bg-[#050505] text-white/50 text-sm" style={inter}>No orders found.</div>
        )}
      </div>
    </motion.div>
  )
}

const AddressesTab = ({ setIsReturnModalOpen, setReturnOrderId }: { setIsReturnModalOpen: (isOpen: boolean) => void, setReturnOrderId: (id: string | null) => void }) => {
  const { user } = useAuthStore()
  const { addresses, addAddress, deleteAddress, setDefaultAddress , updateAddress} = useBuyerStore()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'Home',
    is_default: false
  })

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
  ]

  const countries = ['India','United States','United Kingdom','Canada','Australia']

  const handleAddAddressClick = () => {
  setEditingAddressId(null);
  setIsAdding(true);

  setFormErrors({});

  setFormData({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'Home',
    is_default: false,
  });
};

const resetForm = () => {
  setIsAdding(false);
  setEditingAddressId(null);

  setFormErrors({});

  setFormData({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'Home',
    is_default: false,
  });
};

  const handleSave = async () => {
    if (!user) return
    setFormErrors({})
    setLoading(true)
    
    let result;
    if (editingAddressId) {
      result = await updateAddress(editingAddressId, formData)
    } else {
      const currentUserId = user.id || (user as any)._id;
      result = await addAddress(currentUserId, {
  fullName: formData.full_name,
  phone: formData.phone,
  addressLine1: formData.address_line_1,
  addressLine2: formData.address_line_2,
  city: formData.city,
  state: formData.state,
  pincode: formData.postal_code,
  country: formData.country,
  addressType: formData.address_type,
  isDefault: formData.is_default,
})
    }

    setLoading(false)

    if (result && result.success) {
      setIsAdding(false)
      setEditingAddressId(null)
      setFormData({
        full_name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        address_type: 'Home',
        is_default: false
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const error = result?.errors || result?.error;
      if (error && Array.isArray(error)) {
        const keyMapping: { [key: string]: string } = {
          fullName: 'full_name',
          addressLine1: 'address_line_1',
          pincode: 'postal_code',
        };
        const newErrors: { [key: string]: string } = {};
        error.forEach((err: { field: string, message: string }) => {
          const fieldName = err.field.replace('body.', '');
          const formKey = keyMapping[fieldName] || fieldName;
          newErrors[formKey] = err.message;
        });
        // @ts-ignore
        setFormErrors(newErrors);
      } else if (error && typeof error === 'object' && !Array.isArray(error)) {
         const keyMapping: { [key: string]: string } = {
          fullName: 'full_name',
          addressLine1: 'address_line_1',
          pincode: 'postal_code',
        };
        const newErrors: { [key: string]: string } = {};
        for (const key in error) {
          const formKey = keyMapping[key] || key;
          newErrors[formKey] = error[key];
        }
        // @ts-ignore
        setFormErrors(newErrors);
      } else {
        setFormErrors(result?.message || 'Failed to save address. Please try again.')
      }
    }
  }

  const handleDelete = (id: string) => {
    const realId = id || ''
    if (!realId) return
    deleteAddress(realId)
  }

  const handleEdit = (address: any) => {
    setEditingAddressId(address.id || address._id)
    setFormErrors({})
    setFormData({
      full_name: address.full_name || address.fullName || '',
      phone: address.phone || '',
      address_line_1: address.address_line_1 || address.addressLine1 || '',
      address_line_2: address.address_line_2 || address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || address.pincode || '',
      country: address.country || 'India',
      address_type: address.address_type || address.addressType || 'Home',
      is_default: address.is_default ?? address.isDefault ?? false
    })
    setIsAdding(true)
  }

  const handleSetDefault = (id: string) => {
    const currentUserId = user?.id || (user as any)?._id;
    if (currentUserId) setDefaultAddress(currentUserId, id)
  }
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>
            Saved Locations
          </p>
          <h2 className="text-3xl md:text-5xl text-white" style={cormorant}>Address Book</h2>
        </div>
        {!isAdding && <ActionButton primary icon={Plus} onClick={handleAddAddressClick}>Add New Address</ActionButton>}
      </div>

      {isAdding ? (
        <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-8 md:p-10 mb-8 shadow-[0_0_50px_rgba(214,181,122,0.05)]">
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>
              Delivery Information
            </p>
            <h3 className="text-3xl text-white" style={cormorant}>
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
          {formErrors.form && ( // General form error
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
              {formErrors.form as string}
            </div>
          )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Recipient's Name <span className="text-red-400">*</span></p>
              <LuxuryInput label="Full Name" value={formData.full_name} onChange={(e: any) => setFormData({...formData, full_name: e.target.value})} required />
              {formErrors.full_name && <p className="mt-2 text-xs text-red-400">{formErrors.full_name}</p>}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Mobile Number <span className="text-red-400">*</span></p>
              <LuxuryInput label="Phone Number" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required />
              {formErrors.phone && <p className="mt-2 text-xs text-red-400">{formErrors.phone}</p>}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Address Type</p>
              <select
                value={formData.address_type}
                onChange={(e) => setFormData({ ...formData, address_type: e.target.value })}
                className="w-full border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
              >
                <option value="Home">🏠 Home</option>
                <option value="Office">🏢 Office</option>
                <option value="Other">📍 Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">House / Flat / Building <span className="text-red-400">*</span></p>
              <LuxuryInput label="Address Line 1" value={formData.address_line_1} onChange={(e: any) => setFormData({...formData, address_line_1: e.target.value})} required />
              {formErrors.address_line_1 && <p className="mt-2 text-xs text-red-400">{formErrors.address_line_1}</p>}
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Area / Street / Landmark</p>
              <LuxuryInput label="Address Line 2 (Optional)" value={formData.address_line_2} onChange={(e: any) => setFormData({...formData, address_line_2: e.target.value})} />
              {formErrors.address_line_2 && <p className="mt-2 text-xs text-red-400">{formErrors.address_line_2}</p>}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">City <span className="text-red-400">*</span></p>
              <LuxuryInput label="City" value={formData.city} onChange={(e: any) => setFormData({...formData, city: e.target.value})} required />
              {formErrors.city && <p className="mt-2 text-xs text-red-400">{formErrors.city}</p>}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">State <span className="text-red-400">*</span></p>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <p className="mt-2 text-xs text-red-400">{formErrors.state}</p>}
            </div>

            <div>
              {/* TODO: Auto-fill city and state from PIN code API */}
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">PIN Code <span className="text-red-400">*</span></p>
              <LuxuryInput label="ZIP / Postal Code" value={formData.postal_code} onChange={(e: any) => setFormData({...formData, postal_code: e.target.value})} required />
              {formErrors.postal_code && <p className="mt-2 text-xs text-red-400">{formErrors.postal_code}</p>}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Country <span className="text-red-400">*</span></p>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full border-b border-white/20 bg-[#050505] py-4 text-sm text-white"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            {formErrors.country && <p className="mt-2 text-xs text-red-400">{formErrors.country}</p>}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-[#D6B57A]/20 bg-[#D6B57A]/5 px-5 py-4">
            <div>
              <p className="text-xs text-white">Set as Default Address</p>
              {formErrors.is_default && <p className="mt-2 text-xs text-red-400">{formErrors.is_default}</p>}
            </div>

            <ToggleSwitch
              active={formData.is_default}
              onClick={() => setFormData({ ...formData, is_default: !formData.is_default })}
            />
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <ActionButton primary loading={loading} onClick={handleSave}>
              {editingAddressId ? 'Update Address' : 'Save Address'}
            </ActionButton> 
            <ActionButton onClick={resetForm}>Cancel</ActionButton>
          </div>
          {saved && (
            <div className="mt-4 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-green-400 text-xs uppercase tracking-widest">
              ✓ Address Saved Successfully
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {addresses.map((address) => (
            
            <div
              key={address.id}
              className={`relative rounded-[28px] border ${
                address.isDefault
                  ? 'border-[#D6B57A]/40 bg-[#D6B57A]/5 shadow-[0_0_30px_rgba(214,181,122,0.08)]'
                  : 'border-white/10 bg-[#050505] hover:border-[#D6B57A]/20'
              } p-8 flex flex-col h-full transition-all duration-300`}
            >
              {address.isDefault && (
                <div className="absolute right-6 top-6 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  <CheckCircle className="h-3 w-3" /> Default
                </div>
              )}
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/10 px-3 py-1 text-[9px] uppercase tracking-widest text-[#D6B57A]">
                  {address.addressType || 'Home'}
                </span>
              </div>
              <h4 className="text-xl text-white mb-4 pr-20" style={cormorant}>
                {address.fullName || 'Address Owner'}
              </h4>
              <div className="flex-1 space-y-2">
                

                <p className="text-sm text-white/70" style={inter}>
                  📞 {address.phone || 'N/A'}
                </p>

                <p className="text-sm text-white/60" style={inter}>
                  {address.addressLine1}
                </p>

                {address.addressLine2 && (
                  <p className="text-sm text-white/60" style={inter}>
                    {address.addressLine2}
                  </p>
                )}

                <p className="text-sm text-white/60" style={inter}>
                  {address.city}, {address.state}
                </p>

                <p className="text-sm text-white/60" style={inter}>
                  PIN Code: {address.pincode}
                </p>

                <p className="text-sm text-white/60" style={inter}>
                  {address.country}
                </p>
              </div>
              <div className={`mt-8 pt-4 border-t ${address.isDefault ? 'border-[#D6B57A]/20' : 'border-white/10'} flex gap-4`}>
                <button
                  onClick={() => handleEdit(address)}
                  className="text-[10px] uppercase tracking-widest text-white hover:text-[#D6B57A] transition-colors flex items-center gap-2"
                  style={inter}
                ><Edit2 className="h-3 w-3" /> Edit</button>
                {!address.isDefault && (
                  <>
                    <div className="w-px bg-white/20" />
                    <button onClick={() => handleDelete(String(address.id || address._id))} className="text-[10px] uppercase tracking-widest text-white hover:text-red-400 transition-colors flex items-center gap-2" style={inter}><Trash2 className="h-3 w-3" /> Delete</button>
                    <div className="w-px bg-white/20" />
                    <button onClick={() => handleSetDefault(String(address.id || address._id))} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors" style={inter}>Set Default</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

const WishlistTab = ({ navigate }: { navigate: any }) => {
  const items = useWishlistStore(state => state.items)
  const removeWishlist = useWishlistStore(state => state.removeWishlist)
  const addToCart = useCartStore(state => state.addToCart)

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 border border-white/10 bg-[#050505]">
        <Heart className="h-12 w-12 text-[#D6B57A]/50 mb-6" strokeWidth={1} />
        <h3 className="text-3xl text-white mb-2" style={cormorant}>Your Wishlist is Empty</h3>
        <p className="text-white/50 text-sm mb-8" style={inter}>Discover timeless creations crafted for generations.</p>
        <ActionButton primary onClick={() => navigate('/jewels')}>Explore Collections</ActionButton>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="mb-8 text-3xl md:text-4xl text-white" style={cormorant}>My Wishlist ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="group border border-white/10 bg-[#050505] hover:border-[#D6B57A]/40 transition-colors">
            <div className="relative aspect-square overflow-hidden bg-[#0A0A0A] cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <button onClick={(e) => { e.stopPropagation(); removeWishlist(item.id) }} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#D6B57A] mb-2" style={inter}>{item.collection || 'Collection'}</p>
              <h4 className="text-xl text-white mb-2" style={cormorant}>{item.name}</h4>
              <p className="text-xs text-white/50 tracking-widest mb-3" style={inter}>{item.price}</p>
              
              <div className="flex items-center justify-center gap-2 mb-6 text-[9px] uppercase tracking-widest text-green-400" style={inter}>
                <CheckCircle className="h-3 w-3" /> In Stock
              </div>
              
              <ActionButton 
                primary 
                icon={ShoppingBag} 
                onClick={(e: any) => {
                  e.stopPropagation();
                  addToCart({ ...item, quantity: 1 } as any)
                  removeWishlist(item.id)
                }}
              >
                Move to Bag
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const SecurityTab = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState<'IDLE' | 'OTP' | 'NEW_PASS'>('IDLE')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = Math.min(
  100,
  (newPassword.length >= 8 ? 20 : 0) +
    (newPassword.length >= 12 ? 10 : 0) +
    (/[A-Z]/.test(newPassword) ? 20 : 0) +
    (/[0-9]/.test(newPassword) ? 20 : 0) +
    (/[^A-Za-z0-9]/.test(newPassword) ? 30 : 0)
)

  const strengthColor = strength < 40 ? 'bg-red-500' : strength < 80 ? 'bg-yellow-500' : 'bg-green-500'

  const handleRequestOTP = async () => {
    if (!user?.email) {
      alert("No email associated with your account.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordResetOTPAPI(user.email);
      setStep('OTP');
    } catch (err: any) {
      alert(err.message || 'Failed to send OTP');
    }
    setLoading(false);
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyPasswordResetOTPAPI(user?.email || '', otp);
      const token = data.resetToken || data.data?.resetToken || otp;
      setResetToken(token);
      setStep('NEW_PASS');
    } catch (err: any) {
      alert(err.message || 'Invalid OTP');
    }
    setLoading(false);
  }

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await updatePasswordWithTokenAPI(user?.email || '', resetToken, newPassword);
      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setOtp('')
      setStep('IDLE')
      setTimeout(() => {
        setSuccess(false);
        navigate('/login');
      }, 2000)
    } catch (err: any) {
      alert(err.message || 'Failed to update password')
    }
    setLoading(false);
  }

  const handleSignOutAllDevices = async () => {
    try {
      await signOutAllDevicesAPI();
    } catch (err) {
      console.error('Server signout failed:', err);
    } finally {
      useAuthStore.getState().logout?.();
      navigate('/login');
    }
  }
  
  const handleSendResetLink = async () => {
    if (user?.email) {
      try {
        const data = await sendPasswordResetLinkAPI(user.email);
        if (data.success) alert("Password reset link sent to your email.");
        else alert(data.message || 'Failed to send reset link.');
      } catch (err: any) {
        alert(err.message);
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="mb-3 text-3xl md:text-4xl text-white" style={cormorant}>Security Center</h2>
      <p className="mb-8 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
        Password Management & Recovery
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Change Password Form */}
        <div className="border border-white/10 bg-[#050505] p-8 md:p-10 h-fit rounded-[28px]">
          <div className="flex items-center gap-3 mb-8 text-white">
            <Key className="h-5 w-5 text-[#D6B57A]" />
            <h3 className="text-2xl" style={cormorant}>Update Password</h3>
          </div>
          <p className="text-xs text-white/50 mb-8" style={inter}>
            Update your password regularly to keep your account secure.
          </p>
          
          {step === 'IDLE' && (
            <div className="space-y-6">
              <p className="text-xs text-white/50 mb-8 leading-relaxed" style={inter}>
                To ensure your account's security, changing your password requires an OTP verification sent to your registered email.
              </p>
              <ActionButton primary loading={loading} onClick={handleRequestOTP}>
                Request OTP to Change Password
              </ActionButton>
              {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-400">
                  Password Updated Successfully
                </div>
              )}
            </div>
          )}

          {step === 'OTP' && (
            <div className="space-y-6">
              <p className="text-xs text-white/50 mb-4 leading-relaxed" style={inter}>
                An OTP has been sent to <span className="text-white">{user?.email}</span>. Please enter it below.
              </p>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]">
                  Enter OTP
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full border-b border-white/20 bg-transparent py-4 text-white outline-none tracking-[1em] text-xl"
                  placeholder="------"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <ActionButton onClick={() => setStep('IDLE')}>Cancel</ActionButton>
                <ActionButton primary loading={loading} onClick={handleVerifyOTP}>Verify OTP</ActionButton>
              </div>
            </div>
          )}

          {step === 'NEW_PASS' && (
            <div className="space-y-6">
              <p className="text-xs text-white/50 mb-4 leading-relaxed" style={inter}>
                OTP verified. You can now securely create a new password.
              </p>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]">
                  New Password
                </p>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-b border-white/20 bg-transparent py-4 text-white outline-none"
                    placeholder="Create new password"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-0 top-4 text-white/50 hover:text-[#D6B57A]">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]">
                  Confirm Password
                </p>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-b border-white/20 bg-transparent py-4 text-white outline-none"
                    placeholder="Confirm password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-4 text-white/50 hover:text-[#D6B57A]">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <div className="rounded-2xl border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#D6B57A] mb-1" style={inter}>
                    Security Tip
                  </p>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full transition-all duration-500 ${strengthColor}`} style={{ width: `${strength}%` }} />
                  </div>
                  <p className="mt-3 text-[11px] text-white/40" style={inter}>
                    Password Strength: {strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <ActionButton onClick={() => setStep('IDLE')}>Cancel</ActionButton>
                <ActionButton primary loading={loading} onClick={handlePasswordUpdate}>Save Password</ActionButton>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#050505] p-8 md:p-10 rounded-[28px]">
          <div className="flex items-center gap-3 mb-8 text-white">
            <ShieldCheck className="h-5 w-5 text-[#D6B57A]" />
            <h3 className="text-2xl" style={cormorant}>Device Management</h3>
          </div>

          <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
            Active Sessions
          </p>

          <div className="space-y-5">
            {/* Reset Password via Email block */}
            <div className="rounded-[24px] border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="h-5 w-5 text-[#D6B57A]" />
                <p className="text-white text-lg" style={cormorant}>Global Sign Out</p>
              </div>
              <p className="text-xs text-white/55 leading-relaxed" style={inter}>
                If you notice suspicious activity or left your account logged in on a public device, you can securely sign out of all active sessions immediately.
              </p>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/60">
                Reset link will open a secure password reset page where the user can create a new password.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <ActionButton icon={LogOut} danger onClick={handleSignOutAllDevices}>
              Sign Out From All Devices
            </ActionButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ──────────────── BACKEND API INTEGRATION FUNCTIONS ────────────────

export async function updateBuyerProfileAPI(userId: string, data: any) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(resData.message || `Server returned ${res.status}. Is PUT /users/${userId} implemented?`);
  }
  return resData;
}

export async function uploadBuyerAvatarAPI(userId: string, file: File) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_URL}/users/${userId}/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(resData.message || `Server returned ${res.status}. Is POST /users/${userId}/avatar implemented?`);
  }
  return resData;
}

export async function requestPasswordResetOTPAPI(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to request OTP');
  return data;
}

export async function verifyPasswordResetOTPAPI(email: string, otp: string) {
  const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to verify OTP');
  return data;
}

export async function updatePasswordWithTokenAPI(email: string, resetToken: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ email, resetToken, newPassword })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to update password');
  return data;
}

export async function signOutAllDevicesAPI() {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/auth/signout-all`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

export async function sendPasswordResetLinkAPI(email: string) {
  // Reuses the forgot-password endpoint logic for sending the link
  return await requestPasswordResetOTPAPI(email);
}

export async function deleteBuyerAccountAPI(userId: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete account');
  return await res.json();
}

const ReturnsTab = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/returns/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReturns(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    APPROVED: 'text-green-400 border-green-400/30 bg-green-400/10',
    REJECTED: 'text-red-400 border-red-400/30 bg-red-400/10',
    PROCESSING: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    COMPLETED: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  };

  const refundColors: Record<string, string> = {
    Pending: 'text-yellow-400',
    Processing: 'text-blue-400',
    Refunded: 'text-green-400',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>My Returns & Exchanges</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
          Track your return and exchange requests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/40">Loading...</div>
      ) : returns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/10 bg-[#050505] rounded-[28px]">
          <RotateCcw className="h-12 w-12 text-[#D6B57A]/50 mb-6" strokeWidth={1} />
          <h3 className="text-2xl text-white mb-2" style={cormorant}>No Requests Yet</h3>
          <p className="text-white/40 text-sm" style={inter}>Any return or exchange requests will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {returns.map((req) => {
            const order = req.orderId || {};
            return (
              <div key={req._id} className="border border-white/10 bg-[#050505] rounded-[20px] overflow-hidden">
                <div className="border-b border-white/5 bg-white/[0.02] p-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Order</p>
                      <p className="text-sm text-white" style={inter}>#{order?.orderId || (req._id || '').substring(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Type</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-widest ${req.requestType === 'RETURN' ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20' : 'text-purple-400 bg-purple-400/10 border border-purple-400/20'}`}>{req.requestType}</span>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Reason</p>
                      <p className="text-sm text-white/70" style={inter}>{req.reason}</p>
                    </div>
                  </div>
                  <div className="sm:text-right flex flex-col items-start sm:items-end gap-1">
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border ${statusColors[req.status] || 'text-white/50 border-white/20'}`}>
                      {req.status}
                    </span>
                    {req.status === 'REJECTED' && req.adminNotes && (
                      <p className="mt-2 text-[10px] text-red-400/80 max-w-[200px]" style={inter}>Note: {req.adminNotes}</p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-white/40 text-[9px] uppercase tracking-widest">Request Date</span>
                      <p className="text-white/70 mt-1" style={inter}>{new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    {req.requestType === 'RETURN' && (
                      <div>
                        <span className="text-white/40 text-[9px] uppercase tracking-widest">Refund Status</span>
                        <p className={`mt-1 uppercase tracking-widest text-xs ${refundColors[req.refundStatus || 'Pending'] || 'text-white/50'}`} style={inter}>{req.refundStatus || 'Pending'}</p>
                      </div>
                    )}
                    {req.requestType === 'EXCHANGE' && req.exchangeVariant && (
                      <div>
                        <span className="text-white/40 text-[9px] uppercase tracking-widest">Exchange Variant</span>
                        <p className="text-white/70 mt-1" style={inter}>{req.exchangeVariant}</p>
                      </div>
                    )}
                    {req.processedAt && (
                      <div>
                        <span className="text-white/40 text-[9px] uppercase tracking-widest">Processed Date</span>
                        <p className="text-white/70 mt-1" style={inter}>{new Date(req.processedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    )}
                  </div>

                  {req.items?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2 block">Items</span>
                      <div className="space-y-2">
                        {req.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm bg-white/[0.02] p-3 rounded-lg border border-white/5">
                            <span className="text-white/80" style={inter}>{item.productName}</span>
                            <span className="text-white/50 text-xs">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {req.description && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1 block">Description</span>
                      <p className="text-white/60 text-sm" style={inter}>{req.description}</p>
                    </div>
                  )}

                  {req.images?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2 block">Images</span>
                      <div className="flex flex-wrap gap-2">
                        {req.images.map((img: string, i: number) => (
                          <img key={i} src={img} className="h-16 w-16 object-cover rounded-lg border border-white/10" alt="" />
                        ))}
                      </div>
                    </div>
                  )}

                  {req.adminNotes && req.status !== 'REJECTED' && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-[#D6B57A] mb-1 block">Admin Notes</span>
                      <p className="text-white/60 text-sm" style={inter}>{req.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <ActionButton icon={RefreshCw} onClick={fetchReturns} loading={loading}>Refresh</ActionButton>
      </div>
    </motion.div>
  );
};

const HelpCenterTab = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I track my order?',
      a: "You can track your order status in the 'My Orders' section of your dashboard. Once shipped, you'll receive a tracking number to follow your package's journey."
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 14-day return policy for all unworn items in their original packaging. Bespoke creations are final sale. Please visit our Returns page for detailed instructions.'
    },
    {
      q: 'How do I care for my jewellery?',
      a: 'Each Veloria piece comes with a care guide. Generally, avoid contact with chemicals and store your jewellery in its provided pouch. For professional cleaning, explore our Jewellery Spa services.'
    },
    {
      q: 'Can I request a bespoke creation?',
      a: 'Absolutely. Our artisans specialize in bringing unique visions to life. Please navigate to our Bespoke Creations service page to begin your consultation.'
    },
    {
      q: 'Is my shipment insured?',
      a: 'Yes, all Veloria shipments are fully insured for their value from our maison to your doorstep, ensuring complete peace of mind.'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>Help & Support</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
          Frequently Asked Questions & Contact
        </p>
      </div>

      <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-6 md:p-8 mb-12">
        <div className="mb-8 rounded-[24px] border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-2" style={inter}>
            FAQ
          </p>
          <h3 className="text-2xl text-white mb-2" style={cormorant}>
            Answers to Common Questions
          </h3>
          <p className="text-sm text-white/50" style={inter}>
            Find quick answers to your questions about orders, shipping, and our services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex justify-between items-center text-left py-5"
              >
                <span className="text-base text-white" style={inter}>{faq.q}</span>
                <ChevronRight className={`h-4 w-4 text-[#D6B57A] transition-transform duration-300 ${openFAQ === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm text-white/60 max-w-3xl leading-relaxed" style={inter}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-[32px] border border-[#D6B57A]/20 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-10">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#D6B57A] mb-3" style={inter}>
            Contact Us
          </p>
          <h3 className="text-4xl text-white mb-4" style={cormorant}>
            Still Need Assistance?
          </h3>
          <p className="text-white/50 max-w-xl mx-auto" style={inter}>
            Our dedicated concierge team is available to assist you with any further inquiries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-2xl">
            <Mail className="h-8 w-8 mx-auto mb-4 text-[#D6B57A]" />
            <h4 className="text-lg text-white mb-2" style={cormorant}>Email Concierge</h4>
            <p className="text-xs text-white/50 mb-4" style={inter}>Get in touch via email for any inquiries.</p>
            <a href="mailto:concierge@veloria.com" className="text-sm text-[#D6B57A] hover:text-white transition-colors">concierge@veloria.com</a>
          </div>
          <div className="border border-[#D6B57A]/30 bg-gradient-to-b from-[#D6B57A]/10 to-transparent p-8 rounded-2xl shadow-[0_0_40px_rgba(214,181,122,0.1)] flex flex-col justify-center -translate-y-4">
            <MessageSquare className="h-8 w-8 mx-auto mb-4 text-[#D6B57A]" />
            <h4 className="text-lg text-white mb-2" style={cormorant}>Live Chat</h4>
            <p className="text-xs text-white/50 mb-6" style={inter}>Chat with a member of our team.</p>
            <ActionButton primary onClick={() => navigate('/contact')} className="rounded-full w-full mt-auto">Start Chat</ActionButton>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-2xl">
            <Clock className="h-8 w-8 mx-auto mb-4 text-[#D6B57A]" />
            <h4 className="text-lg text-white mb-2" style={cormorant}>Operating Hours</h4>
            <p className="text-xs text-white/50" style={inter}>
              Monday — Saturday
              <br />
              10:00 AM — 8:00 PM
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// ──────────────── MAIN PAGE COMPONENT ────────────────

const DeleteAccountModal = ({ isOpen, onClose, activeOrdersCount, onDelete }: { isOpen: boolean, onClose: () => void, activeOrdersCount: number, onDelete: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#050505] border border-red-500/30 p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <h3 className="text-2xl text-white mb-4" style={cormorant}>Delete Account</h3>
        {activeOrdersCount > 0 ? (
          <>
            <div className="flex items-start gap-3 text-red-400 bg-red-400/10 p-4 border border-red-400/20 mb-6">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-xs leading-relaxed" style={inter}>You cannot delete your account while active orders are in progress. Please wait until they are delivered or cancel them.</p>
            </div>
            <div className="flex justify-end">
              <ActionButton onClick={onClose}>Close</ActionButton>
            </div>
      </> 
        ) : (
          <>
            <p className="text-white/60 text-sm mb-6" style={inter}>Are you sure you want to permanently delete your Veloria account? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <ActionButton onClick={onClose}>Cancel</ActionButton>
              <ActionButton danger onClick={onDelete}>Yes, Delete Account</ActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function BuyerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { fetchData, loading: dataLoading } = useBuyerStore()
  const { orders, fetchMyOrders } = useOrderStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

useEffect(() => {
    if (user?.email) {
      const currentUserId = user?.id || (user as any)?._id;
      if (currentUserId) fetchData(currentUserId);
      fetchMyOrders(user.email)
    }
  }, [user, fetchData, fetchMyOrders])

  const activeOrdersCount = orders?.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status)).length || 0;

  const handleLogout = () => {
    if (logout) logout()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    if (!user) return;
    const currentUserId = user.id || (user as any)._id;
    try {
      await deleteBuyerAccountAPI(currentUserId);
      handleLogout();
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. Please contact support.');
    }
  }

  const handleTabChange = (tab: string, orderId?: string) => {
    if (tab === 'wishlist') {
      navigate('/wishlist')
      return
    }
    setActiveTab(tab)
    if (orderId) {
      setActiveOrderId(orderId)
    } else if (tab !== 'orders') {
      setActiveOrderId(null)
    }
  }

  const tabs = [
    { id: 'heading-1', label: 'Account', isHeading: true },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserCircle }, // Keep profile tab
    
    { id: 'heading-2', label: 'Shopping', isHeading: true },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw },
    
    { id: 'heading-3', label: 'Assistance', isHeading: true },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    
    { id: 'heading-5', label: 'Support', isHeading: true },
    { id: 'help', label: 'Help Center', icon: LifeBuoy },
  ]

  return (
    <div className="relative bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none fixed -left-[20%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#D6B57A]/5 blur-[120px]" />
      
      <DashboardNavbar onProfileClick={() => handleTabChange('profile')} />

      <div className="mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-12 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          
          {/* ── SIDEBAR NAVIGATION ── */}
          <aside className="hidden lg:flex flex-col">
            {tabs.map((tab) => {
              if (tab.isHeading) {
                return (
                  <div key={tab.id} className="mt-8 mb-4 px-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30" style={inter}>
                    {tab.label}
                  </div>
                )
              }
              
              const Icon = tab.icon!
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative flex items-center gap-4 px-6 py-3.5 text-left transition-all duration-300 ${
                    isActive ? 'bg-[#D6B57A]/10 text-[#D6B57A] rounded-2xl shadow-[0_0_25px_rgba(214,181,122,0.08)]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  {isActive && <motion.div layoutId="activeNav" className="absolute inset-y-0 left-0 w-0.5 bg-[#D6B57A]" />}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                        isActive
                        ? 'border border-[#D6B57A]/30 bg-[#D6B57A]/10'
                        : 'border border-white/10 bg-white/[0.02] group-hover:border-[#D6B57A]/20'
                    }`}
                    >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                  <span className="text-[11px] uppercase tracking-widest" style={inter}>{tab.label}</span>
                </button>
              )
            })}
            <div className="mt-8 mb-4 h-px w-full bg-white/5" />
            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 px-6 py-3.5 text-left text-white/50 transition-all duration-300 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-widest" style={inter}>Sign Out</span>
            </button>

            <div className="mt-8 mb-4 px-6 text-[9px] font-bold uppercase tracking-[0.3em] text-red-500/50" style={inter}>Danger Zone</div>
            <button onClick={() => setDeleteModalOpen(true)} className="group flex items-center gap-4 px-6 py-3.5 text-left text-red-400/70 hover:bg-red-500/5 hover:text-red-400 transition-all duration-300">
              <Trash2 className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-widest" style={inter}>Delete Account</span>
            </button>
          </aside>

          {/* ── MOBILE NAVIGATION ── */}
          <div className="lg:hidden flex overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden border-b border-white/10">
            {tabs.filter(t => !t.isHeading).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap px-5 py-2 text-[10px] uppercase tracking-widest transition-colors ${
                  activeTab === tab.id ? 'text-[#D6B57A] border-b border-[#D6B57A]' : 'text-white/50'
                }`}
                style={inter}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── MAIN CONTENT AREA ── */}
          <main className="min-h-[60vh] relative z-10">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && <OverviewTab key="overview" handleTabChange={handleTabChange} />}
              {activeTab === 'profile' && <ProfileTab key="profile" />}
              {activeTab === 'orders' && <OrdersTab key="orders" activeOrderId={activeOrderId} setActiveOrderId={setActiveOrderId} navigate={navigate} setIsReturnModalOpen={setIsReturnModalOpen} setReturnOrderId={setReturnOrderId} />}
              {activeTab === 'addresses' && <AddressesTab key="addresses" setIsReturnModalOpen={setIsReturnModalOpen} setReturnOrderId={setReturnOrderId} />}
              {activeTab === 'returns' && <ReturnsTab key="returns" />}
              {activeTab === 'security' && <SecurityTab key="security" />}
              {activeTab === 'support' && <HelpCenterTab key="support" />}
              {activeTab === 'help' && <HelpCenterTab key="help" />}
            </AnimatePresence>
          </main>

          {/* <ReturnExchangeModal
            isOpen={isReturnModalOpen}
            onClose={() => setIsReturnModalOpen(false)}
            orderId={returnOrderId}
          /> */}


        </div>
      </div>
      
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        activeOrdersCount={activeOrdersCount} 
        onDelete={handleDeleteAccount} 
      />
    </div>
  )
}