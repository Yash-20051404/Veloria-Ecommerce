import React, { useState, useEffect, memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, ShoppingBag, MapPin, Settings, LogOut, ShieldCheck,
  ChevronRight, Package, ArrowRight, Edit2, Plus, Heart, Search,
  UserCircle, LifeBuoy, Camera, Key, Clock, Smartphone, 
  MessageSquare, Mail, Ticket, CheckCircle, Download, Trash2, X, Truck,
  Bell, Star, Calendar, Globe, AlertTriangle, Eye, EyeOff, Check, Lock
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useBuyerStore } from '@/store/buyerStore'
import { useOrderStore } from '@/store/orderStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

const getAuthToken = () => {
  let token = (useAuthStore.getState() as any).token;
  if (token) return token;
  token = localStorage.getItem('token');
  if (token) return token;
  const storage = localStorage.getItem('auth-storage');
  if (storage) {
    try { return JSON.parse(storage).state?.token || ''; } catch(e) {}
  }
  return '';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

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

const ActionButton = ({ children, onClick, loading, primary, icon: Icon, danger }: any) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`group relative flex items-center justify-center gap-2 overflow-hidden px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
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
              <img src={profile.avatar_url} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-[#D6B57A]/30" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/5 border border-[#D6B57A]/30 flex items-center justify-center text-[#D6B57A] text-xs" style={cormorant}>
                {profile?.full_name?.charAt(0) || user?.name?.charAt(0) || 'V'}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
})

// ──────────────── TABS CONTENT ────────────────

const OverviewTab = ({ handleTabChange }: { handleTabChange: (t: string, id?: string) => void }) => {
  const { profile, addresses } = useBuyerStore()
  const { orders } = useOrderStore()
  const navigate = useNavigate()
  const wishlistCount = useWishlistStore(state => state.wishlistCount)

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
              {profile?.full_name || 'Veloria Member'}
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
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Reward Points</p>
                <p className="mt-1 text-xl text-white" style={cormorant}>{profile?.reward_points?.toLocaleString() || 0} pts</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Last Order</p>
                <p className="mt-1 text-xl text-white" style={cormorant}>{orders?.[0] ? new Date(orders[0].createdAt || orders[0].created_at || Date.now()).toLocaleDateString() : 'No orders yet'}</p>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[320px]">
            <img
              src="/ring-showcase.jpeg"
              alt="Veloria Ring"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505]" />
            <div className="absolute bottom-6 right-6 rounded-2xl border border-[#D6B57A]/20 bg-black/40 backdrop-blur-xl px-5 py-4">

  <p className="text-[9px] uppercase tracking-[0.25em] text-[#D6B57A] mb-1" style={inter}>

    Member Tier

  </p>

  <p className="text-xl text-white" style={cormorant}>
    {profile?.membership_tier || 'Silver'}
  </p>

</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Orders', value: totalOrdersCount.toString(), icon: Package, tab: 'orders', action: 'View All Orders' },
          { label: 'Wishlist Items', value: wishlistCount.toString(), icon: Heart, tab: 'wishlist', action: 'View Wishlist' },
          { label: 'Saved Addresses', value: addressesCount.toString(), icon: MapPin, tab: 'addresses', action: 'Manage Addresses' },
          { label: 'Maison Benefits', value: '37.6K PTS', icon: Star, tab: 'benefits', action: 'View Benefits' }
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

          <div className="mt-6 overflow-hidden rounded-[24px] border border-[#D6B57A]/20 bg-gradient-to-br from-[#D6B57A]/10 to-transparent p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A] mb-2" style={inter}>
              Premium Status
            </p>
            <p className="text-2xl text-white" style={cormorant}>Platinum Member</p>
            <p className="mt-2 text-xs text-white/50" style={inter}>
              Complimentary shipping, concierge support and early-access launches.
            </p>
          </div>
        </div>
      </div>

      
        

      <div className="rounded-[32px] border border-[#D6B57A]/20 bg-gradient-to-r from-[#0a0a0a] via-[#050505] to-[#0a0a0a] overflow-hidden">
        <div className="grid md:grid-cols-[180px_1fr_auto] items-center gap-6 p-8">
          <div className="h-28 overflow-hidden rounded-2xl border border-[#D6B57A]/20">
            <img
              src="/ring-showcase.jpeg"
              alt="Benefits"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-2" style={inter}>
              Diamond Privileges
            </p>
            <h3 className="text-3xl text-white mb-2" style={cormorant}>
              Priority Concierge & Early Access
            </h3>
            <p className="text-white/60" style={inter}>
              Complimentary shipping, private previews, reward upgrades and dedicated luxury support.
            </p>
          </div>

          <ActionButton primary onClick={() => handleTabChange('benefits')}>
            Explore Benefits
          </ActionButton>
        </div>
      </div>
    </motion.div>
  )
}

const ProfileTab = () => {
  const { user } = useAuthStore()
  const { profile, updateProfile, uploadAvatar } = useBuyerStore()
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
    const date_of_birth = `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`
    const { error } = await updateProfile(user.id, {
      full_name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      date_of_birth
    })
    setLoading(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return
    setLoading(true)
    await uploadAvatar(user.id, e.target.files[0])
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

        <div className="hidden md:flex items-center gap-3 rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/5 px-4 py-2">
          <Star className="h-4 w-4 text-[#D6B57A]" />
          <span className="text-xs uppercase tracking-widest text-[#D6B57A]" style={inter}>
            {profile?.membership_tier || 'Silver Member'}
          </span>
        </div>
      </div>

      <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-6 md:p-8">

<div className="flex flex-col items-center gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6 w-full">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-36 w-36 rounded-full object-cover shadow-[0_0_30px_rgba(214,181,122,0.12)]" />
            ) : (
              <div className="h-36 w-36 rounded-full border-2 border-[#D6B57A]/30 bg-gradient-to-br from-[#0A0A0A] to-[#111111] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(214,181,122,0.12)]">
              <span className="text-5xl text-[#D6B57A]" style={cormorant}>{(formData.name || '').charAt(0) || 'V'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full backdrop-blur-sm">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-center ">
            <button onClick={() => fileInputRef.current?.click()} className="text-[10px] uppercase tracking-widest text-[#D6B57A] hover:text-white transition-colors border-b border-[#D6B57A]/30 pb-0.5" style={inter}>Upload Photo</button>
            <div className="mb-4 text-center">
              <h3 className="text-2xl text-white" style={cormorant}>
                {formData.name || 'Veloria Member'}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/40" style={inter}>
                Registered Member
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/5 px-4 py-2 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                {profile?.membership_tier || 'Silver Member'}
              </div>
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

const OrderDetails = ({ orderId, onBack }: { orderId: string, onBack: () => void }) => {
  const { orders } = useOrderStore();
  const order = orders.find(o => o.orderId === orderId || o.id === orderId || o._id === orderId);
  const navigate = useNavigate();

  if (!order) return <div className="text-white/50 text-center py-20 border border-white/10 bg-[#050505]">Order not found.</div>;

  const timelineSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const labels = ['Order Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  const currentIndex = timelineSteps.indexOf(order.status?.toUpperCase()) > -1 ? timelineSteps.indexOf(order.status?.toUpperCase()) : 0;

  const handleDownloadInvoice = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/${order.orderId || order._id}/invoice`);
      if (!res.ok) throw new Error("Invoice not found.");
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
              <div className="absolute top-1/2 left-0 h-0.5 bg-[#D6B57A] -translate-y-1/2 transition-all duration-1000" style={{ width: `${(currentIndex / (timelineSteps.length - 1)) * 100}%` }} />
              
              <div className="relative flex justify-between">
                {labels.map((label, idx) => {
                  const isCompleted = idx <= currentIndex;
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
                <p className="text-sm text-[#D6B57A] tracking-widest" style={inter}>VLX8472192</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1" style={inter}>Shipping Address</p>
                <p className="text-sm text-white/80 leading-relaxed" style={inter}>
                  {order.address?.address_line_1 || order.address?.addressLine1 || order.shipping_address?.address_line_1 || 'N/A'},<br/>
                  {order.address?.city || order.shipping_address?.city}, {order.address?.state || order.shipping_address?.state} {order.address?.postal_code || order.address?.zip || order.shipping_address?.postal_code}
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
          
          <div className="flex gap-4">
            <ActionButton primary onClick={() => navigate(`/track-order?id=${order.orderId || order._id}`)}>
              Track Order
            </ActionButton>
            <ActionButton onClick={handleDownloadInvoice}>
              Download Invoice
            </ActionButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const OrdersTab = ({ activeOrderId, setActiveOrderId, navigate }: { activeOrderId: string | null, setActiveOrderId: (id: string | null) => void, navigate: any }) => {
  const { orders } = useOrderStore();
  const [activeSubTab, setActiveSubTab] = useState('active')

  if (activeOrderId) {
    return <OrderDetails orderId={activeOrderId} onBack={() => setActiveOrderId(null)} />
  }

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status))
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status))
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
          <div key={order.orderId || order._id || order.id} onClick={() => setActiveOrderId(order.orderId || order._id || order.id)} className="border border-white/10 bg-[#050505] overflow-hidden cursor-pointer group hover:border-[#D6B57A]/40 transition-colors">
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
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#D6B57A] shadow-[0_0_8px_#D6B57A]" />
                    <span className="text-[10px] uppercase tracking-widest text-white" style={inter}>{order.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                <ActionButton primary icon={ArrowRight} onClick={(e: any) => { e.stopPropagation(); setActiveOrderId(order.orderId || order._id || order.id); }}>View Details</ActionButton>
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

const AddressesTab = () => {
  const { user } = useAuthStore()
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useBuyerStore()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
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

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await addAddress(user.id, formData)
    setLoading(false)
    if (!error) {
        setIsAdding(false)
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
    }
  }

  const handleDelete = (id: string) => {
    deleteAddress(id)
  }

  const handleSetDefault = (id: string) => {
    if (user) setDefaultAddress(user.id, id)
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
        {!isAdding && <ActionButton primary icon={Plus} onClick={() => setIsAdding(true)}>Add New Address</ActionButton>}
      </div>

      {isAdding ? (
        <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-8 md:p-10 mb-8 shadow-[0_0_50px_rgba(214,181,122,0.05)]">
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>
              Delivery Information
            </p>
            <h3 className="text-3xl text-white" style={cormorant}>
              Add New Address
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Recipient Name <span className="text-red-400">*</span></p>
              <LuxuryInput label="Full Name" value={formData.full_name} onChange={(e: any) => setFormData({...formData, full_name: e.target.value})} required />
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Mobile Number <span className="text-red-400">*</span></p>
              <LuxuryInput label="Phone Number" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required />
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
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">Area / Street / Landmark</p>
              <LuxuryInput label="Address Line 2 (Optional)" value={formData.address_line_2} onChange={(e: any) => setFormData({...formData, address_line_2: e.target.value})} />
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">City <span className="text-red-400">*</span></p>
              <LuxuryInput label="City" value={formData.city} onChange={(e: any) => setFormData({...formData, city: e.target.value})} required />
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
            </div>

            <div>
              {/* TODO: Auto-fill city and state from PIN code API */}
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[#D6B57A]">PIN Code <span className="text-red-400">*</span></p>
              <LuxuryInput label="ZIP / Postal Code" value={formData.postal_code} onChange={(e: any) => setFormData({...formData, postal_code: e.target.value})} required />
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
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-[#D6B57A]/20 bg-[#D6B57A]/5 px-5 py-4">
            <div>
              <p className="text-xs text-white">Set as Default Address</p>
            </div>

            <ToggleSwitch
              active={formData.is_default}
              onClick={() => setFormData({ ...formData, is_default: !formData.is_default })}
            />
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <ActionButton primary loading={loading} onClick={handleSave}>Save Address</ActionButton>
            <ActionButton onClick={() => setIsAdding(false)}>Cancel</ActionButton>
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
                address.is_default
                  ? 'border-[#D6B57A]/40 bg-[#D6B57A]/5 shadow-[0_0_30px_rgba(214,181,122,0.08)]'
                  : 'border-white/10 bg-[#050505] hover:border-[#D6B57A]/20'
              } p-8 flex flex-col h-full transition-all duration-300`}
            >
              {address.is_default && (
                <div className="absolute right-6 top-6 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  <CheckCircle className="h-3 w-3" /> Default
                </div>
              )}
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/10 px-3 py-1 text-[9px] uppercase tracking-widest text-[#D6B57A]">
                  {address.address_type || 'Home'}
                </span>
              </div>
              <h4 className="text-xl text-white mb-4 pr-20" style={cormorant}>{address.full_name}</h4>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-white/60" style={inter}>{address.address_line_1}</p>
                {address.address_line_2 && <p className="text-sm text-white/60" style={inter}>{address.address_line_2}</p>}
                <p className="text-sm text-white/60" style={inter}>{address.city}, {address.state} {address.postal_code}</p>
                <p className="text-sm text-white/60" style={inter}>{address.country}</p>
                <p className="text-sm text-white/60 pt-2" style={inter}>{address.phone}</p>
              </div>
              <div className={`mt-8 pt-4 border-t ${address.is_default ? 'border-[#D6B57A]/20' : 'border-white/10'} flex gap-4`}>
                <button className="text-[10px] uppercase tracking-widest text-white hover:text-[#D6B57A] transition-colors flex items-center gap-2" style={inter}><Edit2 className="h-3 w-3" /> Edit</button>
                {!address.is_default && (
                  <>
                    <div className="w-px bg-white/20" />
                    <button onClick={() => handleDelete(address.id)} className="text-[10px] uppercase tracking-widest text-white hover:text-red-400 transition-colors flex items-center gap-2" style={inter}><Trash2 className="h-3 w-3" /> Delete</button>
                    <div className="w-px bg-white/20" />
                    <button onClick={() => handleSetDefault(address.id)} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors" style={inter}>Set Default</button>
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


const NotificationsTab = () => {
  const { user } = useAuthStore()
  const { preferences, updatePreferences } = useBuyerStore()

  const toggle = async (key: string) => {
    if (!user || !preferences) return
    await updatePreferences(user.id, { [key]: !preferences[key as keyof typeof preferences] })
  }

  const options = [
    {
      key: 'orderUpdates',
      title: 'Order Updates',
      desc: 'Delivery tracking, shipping updates and order status changes.'
    },
    {
      key: 'smsAlerts',
      title: 'SMS Alerts',
      desc: 'Receive important alerts directly on your mobile number.'
    },
    {
      key: 'emailNotif',
      title: 'Email Notifications',
      desc: 'Order confirmations, invoices and account related emails.'
    },
    {
      key: 'whatsapp',
      title: 'WhatsApp Notifications',
      desc: 'Instant updates through WhatsApp messages.'
    },
    {
      key: 'promo',
      title: 'Promotional Emails',
      desc: 'New launches, offers and exclusive seasonal campaigns.'
    },
    {
      key: 'vipAccess',
      title: 'VIP Collection Early Access',
      desc: 'Get access to limited collections before public release.'
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>
          Notification Preferences
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
          Manage How Veloria Communicates With You
        </p>
      </div>

      <div className="rounded-[32px] border border-[#D6B57A]/10 bg-gradient-to-b from-[#080808] to-[#040404] p-6 md:p-8 shadow-[0_0_50px_rgba(214,181,122,0.05)]">
        <div className="mb-8 rounded-[24px] border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-2" style={inter}>
            Notification Center
          </p>
          <h3 className="text-2xl text-white mb-2" style={cormorant}>
            Stay Updated Your Way
          </h3>
          <p className="text-sm text-white/50" style={inter}>
            Choose which alerts, updates and exclusive announcements you want to receive.
          </p>
        </div>

        <div className="space-y-4">
          {options.map((item) => (
            <div
              key={item.key}
              className="rounded-[22px] border border-white/10 bg-[#050505] px-6 py-5 hover:border-[#D6B57A]/25 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-white text-base mb-1" style={inter}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/45 max-w-xl" style={inter}>
                    {item.desc}
                  </p>
                </div>

                <ToggleSwitch
                  active={preferences?.[item.key as keyof typeof preferences] || false}
                  onClick={() => toggle(item.key)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const SecurityTab = () => {
  const { user } = useAuthStore()
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const strength = Math.min(
    100,
    (newPassword.length >= 8 ? 25 : 0) +
    (/[A-Z]/.test(newPassword) ? 25 : 0) +
    (/[0-9]/.test(newPassword) ? 25 : 0) +
    (/[^A-Za-z0-9]/.test(newPassword) ? 25 : 0)
  )

  const strengthColor = strength < 40 ? 'bg-red-500' : strength < 80 ? 'bg-yellow-500' : 'bg-green-500'

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    try {
      const res = await fetch(`${API_URL}/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true)
        setNewPassword('')
        setConfirmPassword('')
        setOldPassword('')
        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert(data.message || 'Failed to update password')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSignOutAllDevices = async () => {
    try {
      await fetch(`${API_URL}/auth/signout-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      useAuthStore.getState().logout?.();
    } catch (err) {
      console.error(err);
    }
  }
  
  const handleSendResetLink = async () => {
    if (user?.email) {
      try {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await res.json();
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
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]">
                Old Password
              </p>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border-b border-white/20 bg-transparent py-4 text-white outline-none"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-0 top-4 text-white/50 hover:text-[#D6B57A]">
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
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
                {/* Strength bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div className={`h-full rounded-full transition-all duration-500 ${strengthColor}`} style={{ width: `${strength}%` }} />
                </div>
                <p className="mt-3 text-[11px] text-white/40" style={inter}>
                  Password Strength: {strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong'}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex flex-col gap-4">
                <ActionButton primary onClick={handlePasswordUpdate}>Update Password</ActionButton>
                {success && (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-400">
                    Password Updated Successfully
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-[#050505] p-8 md:p-10 rounded-[28px]">
          <div className="flex items-center gap-3 mb-8 text-white">
            <ShieldCheck className="h-5 w-5 text-[#D6B57A]" />
            <h3 className="text-2xl" style={cormorant}>Password Recovery</h3>
          </div>

          {/* Gold badge */}
          <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
            Recovery Method
          </p>

          <div className="space-y-5">
            {/* Reset Password via Email block */}
            <div className="rounded-[24px] border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-[#D6B57A]" />
                <p className="text-white text-lg" style={cormorant}>Reset Password via Email</p>
              </div>
              <p className="text-xs text-white/55 leading-relaxed" style={inter}>
                A secure password reset link will be sent to your registered email address. Follow the instructions in the email to create a new password.
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
            <ActionButton primary icon={Mail} onClick={handleSendResetLink}>Send Reset Link</ActionButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}



const MaisonBenefitsTab = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
    <h2 className="mb-8 text-3xl md:text-4xl text-white" style={cormorant}>Maison Benefits</h2>
    <div className="relative overflow-hidden border border-[#D6B57A]/30 bg-gradient-to-br from-[#0A0A0A] to-[#050505] p-12 text-center">
      <Star className="mx-auto h-12 w-12 text-[#D6B57A] mb-6" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-2" style={inter}>Current Tier</p>
      <h2 className="text-5xl text-white font-light" style={cormorant}>Platinum Member</h2>
      <div className="max-w-md mx-auto mt-10">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-3" style={inter}><span>Platinum (37,600 pts)</span><span>Diamond (50,000 pts)</span></div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[75%] bg-[#D6B57A] shadow-[0_0_10px_#D6B57A]" /></div>
      </div>
    </div>
  </motion.div>
)

const SupportTab = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl text-white" style={cormorant}>Private Maison</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
          Exclusive Experiences & Bespoke Services
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-[32px] overflow-hidden border border-[#D6B57A]/15 min-h-[280px] bg-gradient-to-br from-[#111] to-[#050505] flex flex-col justify-center p-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-4" style={inter}>
            Private Maison
          </p>
          <h3 className="text-4xl text-white mb-4" style={cormorant}>
            Your Relationship With Veloria Extends Beyond Purchase
          </h3>
          <p className="text-white/60 mb-8" style={inter}>
            Private concierge access, bespoke creations, lifetime aftercare and exclusive maison experiences reserved for distinguished clients.
          </p>
          <ActionButton primary>
            Begin Your Private Experience
          </ActionButton>
        </div>
        {/* Right side: Platinum Circle Maison Access */}
        <div className="rounded-[32px] overflow-hidden border border-[#D6B57A]/15 h-full min-h-[280px] bg-gradient-to-br from-[#111] to-[#050505] flex items-center justify-center">
          <div className="text-center px-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-4" style={inter}>
              Maison Access
            </p>
            <h4 className="text-4xl text-white" style={cormorant}>
              Platinum Circle
            </h4>
            <p className="mt-4 text-white/45" style={inter}>
              Exclusive access to bespoke services, private appointments and luxury aftercare.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { title: 'Bespoke Creations', link: '/services/bespoke-creations' },
          { title: 'Aftercare Services', link: '/services/aftercare' },
          { title: 'Private Appointments', link: '/services/private-appointments' },
          { title: 'Jewellery Spa', link: '/services/jewellery-spa' },
          { title: 'Certification Requests', link: '/services/certification-requests' }
        ].map((service, i) => (
          <div key={i} className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#080808] to-[#050505] p-6 text-center transition-all duration-300 hover:border-[#D6B57A]/40 hover:shadow-[0_0_35px_rgba(214,181,122,0.08)] group cursor-pointer">
            <div>
              <p className="text-lg text-white mb-4" style={cormorant}>{service.title}</p>
              <button
                onClick={() => navigate(service.link)}
                className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A] hover:text-white transition-colors"
                style={inter}
              >
                Explore Service →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Maison Contact Section */}
      <div className="mt-12 rounded-[32px] border border-[#D6B57A]/20 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#D6B57A] mb-3" style={inter}>
          Maison Contact
        </p>

        <h3 className="text-4xl text-white mb-4" style={cormorant}>
          Need Personal Assistance?
        </h3>

        <p className="text-white/50 max-w-xl mx-auto mb-8" style={inter}>
          For bespoke requests, private appointments, certification assistance and luxury aftercare services.
        </p>

        <div className="space-y-3 mb-8">
          <p className="text-white">concierge@veloria.com</p>
          <p className="text-white/50">www.veloria.com</p>
          <p className="text-white/40 text-sm">Monday — Saturday • 10:00 AM — 8:00 PM</p>
        </div>

        <ActionButton primary>
          Contact Maison
        </ActionButton>
      </div>
    </motion.div>
  );
}


const ActivityTab = () => {
  const activities = [
    { type: 'order', title: 'Order Placed', desc: 'Order #VEL-2026-84721 has been confirmed.', date: 'Today, 10:42 AM', icon: Package },
    { type: 'security', title: 'New Login', desc: 'Account accessed from New York, USA (Mac OS).', date: 'Today, 10:30 AM', icon: Lock },
    { type: 'address', title: 'Address Book Updated', desc: 'A new delivery address was set as default.', date: 'Yesterday, 4:15 PM', icon: MapPin },
    { type: 'wishlist', title: 'Wishlist Updated', desc: 'Lumière Solitaire was added to your legacy collection.', date: 'June 2, 2026', icon: Heart }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="mb-8 text-3xl md:text-4xl text-white" style={cormorant}>Account Activity</h2>
      
      <div className="border border-white/10 bg-[#050505] p-8 md:p-12 relative">
        <div className="absolute left-[47px] md:left-[67px] top-12 bottom-12 w-px bg-white/10" />
        
        {activities.length === 0 && (
          <div className="py-10 text-center text-white/50 text-sm" style={inter}>
            No recent account activity.
          </div>
        )}
        <div className="flex flex-col gap-10">
          {activities.map((act, i) => (
            <div key={i} className="relative z-10 flex gap-6 md:gap-8">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/10 bg-[#0A0A0A] flex items-center justify-center shrink-0">
                <act.icon className="h-4 w-4 text-[#D6B57A]" />
              </div>
              <div className="pt-1">
                <h4 className="text-sm md:text-base text-white mb-1" style={inter}>{act.title}</h4>
                <p className="text-xs text-white/50 mb-2" style={inter}>{act.desc}</p>
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  <Clock className="h-3 w-3" /> {act.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchData(user.id)
    }
    if (user?.email) {
      fetchMyOrders(user.email)
    }
  }, [user?.id, user?.email, fetchData, fetchMyOrders])

  const activeOrdersCount = orders?.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status)).length || 0;

  const handleLogout = () => {
    if (logout) logout()
    navigate('/login')
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
    { id: 'profile', label: 'Profile', icon: UserCircle },
    
    { id: 'heading-2', label: 'Shopping', isHeading: true },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    
    { id: 'heading-3', label: 'Assistance', isHeading: true },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    
    { id: 'heading-4', label: 'Preferences', isHeading: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    
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
              {activeTab === 'orders' && <OrdersTab key="orders" activeOrderId={activeOrderId} setActiveOrderId={setActiveOrderId} navigate={navigate} />}
              {activeTab === 'addresses' && <AddressesTab key="addresses" />}
              {activeTab === 'security' && <SecurityTab key="security" />}
              {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
              {activeTab === 'benefits' && <MaisonBenefitsTab key="benefits" />}
              {activeTab === 'support' && <SupportTab key="support" />}
              {activeTab === 'help' && <SupportTab key="help" />}
              {activeTab === 'activity' && <ActivityTab key="activity" />}
            </AnimatePresence>
          </main>

        </div>
      </div>
      
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        activeOrdersCount={activeOrdersCount} 
        onDelete={handleLogout} 
      />
    </div>
  )
}