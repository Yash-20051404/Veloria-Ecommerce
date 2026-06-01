import React, { useEffect, useState, memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check, Truck, Package, ShieldCheck, Phone, Download,
  MapPin, Heart, Search, ShoppingBag, User, ArrowRight, Star
} from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useCouponStore } from '@/store/couponStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

// ──────────────── MOCK DATA ────────────────

const MOCK_RECOMMENDED = [
  { id: 3, name: 'Eclipse Pendant', collection: 'Aurora', price: '$18,200', image: '/necklace.jpg' },
  { id: 4, name: 'Celeste Drops', collection: 'Celestial', price: '$9,800', image: '/earrings.jpg' },
  { id: 5, name: 'Nocturne Ring', collection: 'Eternity', price: '$11,400', image: '/ring.jpg' },
  { id: 6, name: 'Horizon Bangle', collection: 'Radiance', price: '$16,500', image: '/bracelet.jpg' }
]

const parsePrice = (price: string) => Number(price.replace(/[^0-9.-]+/g, ''))
const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)

// ──────────────── CENTRAL MOCK ORDER OBJECT (BACKEND READY) ────────────────

export const MOCK_ORDER = {
  id: "VEL-2026-84721",
  status: "CREATION_PREPARING",
  progress: 25,
  paymentStatus: "PAID",
  createdAt: "2026-06-01",
  estimatedArrival: "Jun 3 – Jun 5",
  trackingNumber: "VELTRK928371",
  invoiceAvailable: true,
  deliveryMethod: "Complimentary Insured Delivery",
  timeline: [
    "ORDER_CONFIRMED",
    "PAYMENT_RECEIVED",
    "CREATION_PREPARING",
    "INSURED_SHIPMENT",
    "DELIVERED"
  ]
};

export type OrderData = typeof MOCK_ORDER;

export const getStatusLabel = (status: string) => {
  const mapping: Record<string, string> = {
    ORDER_CONFIRMED: 'Order Confirmed',
    PAYMENT_RECEIVED: 'Payment Received',
    CREATION_PREPARING: 'Preparing Your Creation',
    INSURED_SHIPMENT: 'Insured Shipment',
    OUT_FOR_DELIVERY: 'Out For Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    PAID: 'Paid',
    PROCESSING: 'Processing'
  };
  return mapping[status] || status;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'PROCESSING':
    case 'CREATION_PREPARING':
      return 'text-[#D6B57A] bg-[#D6B57A]/10 border-[#D6B57A]/20';
    case 'SHIPPED':
    case 'INSURED_SHIPMENT':
    case 'OUT_FOR_DELIVERY':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'CANCELLED':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-white/60 bg-white/5 border-white/10';
  }
};

export const getProgressPercentage = (order: OrderData) => {
  return order.progress || 0;
};

// ──────────────── REUSABLE COMPONENTS ────────────────

const SuccessNavbar = memo(() => {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-0">
        <button onClick={() => navigate('/')} className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</button>
        <div className="flex items-center gap-6 text-white/60">
          <Search className="hidden h-4 w-4 cursor-pointer hover:text-[#D6B57A] transition-colors sm:block" />
          <button 
            onClick={() => navigate(isAuthenticated && role ? `/${role.toLowerCase()}` : '/login')}
            className="transition-all hover:scale-110 hover:text-[#D6B57A]"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </button>
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
        </div>
      </div>
    </nav>
  )
})

const ParticleBurst = memo(() => {
  const particles = Array.from({ length: 32 })
  return (
    <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const radius = 80 + Math.random() * 140
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const duration = 1.2 + Math.random() * 0.8
        return (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.8)]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: Math.random() * 1.5 + 0.5 }}
            transition={{ duration, ease: "easeOut", delay: 0.1 }}
          />
        )
      })}
    </div>
  )
})

const SuccessHero = memo(() => (
  <div className="relative mb-16 mt-10 flex flex-col items-center text-center lg:mb-24 lg:mt-16">
    <ParticleBurst />
    
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#D6B57A]/40 bg-[#D6B57A]/10 shadow-[0_0_40px_rgba(214,181,122,0.2)] mb-8"
    >
      <Check className="h-10 w-10 text-[#D6B57A]" strokeWidth={1.5} />
    </motion.div>

    <motion.h1 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
      className="text-5xl font-light tracking-wide text-white lg:text-7xl" style={cormorant}
    >
      Order Confirmed
    </motion.h1>
    
    <motion.p 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-6 max-w-lg text-[10px] uppercase tracking-[0.25em] leading-relaxed text-white/50 lg:text-xs" style={inter}
    >
      Thank you for choosing Veloria.<br/><br/>
      Your creation is now being prepared by our artisans and will soon begin its journey to you.
    </motion.p>
  </div>
))

const OrderDetailsCard = memo(({ order }: { order: OrderData }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(order.createdAt))
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
      className="mb-10 border border-[#D6B57A]/30 bg-[#050505] p-8"
    >
      <h3 className="mb-6 text-2xl font-light text-white" style={cormorant}>Order Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 items-start">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Order Number</span>
          <span className="mt-1 text-sm text-white" style={inter}>#{order.id}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Order Date</span>
          <span className="mt-1 text-sm text-white" style={inter}>{formattedDate}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Payment Status</span>
          <span className={`mt-2 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${getStatusColor(order.paymentStatus)}`} style={inter}>{getStatusLabel(order.paymentStatus)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Delivery Method</span>
          <span className="mt-1 text-sm text-white" style={inter}>{order.deliveryMethod}</span>
        </div>
      </div>
    </motion.div>
  )
})

const TrackOrderPreview = memo(({ order }: { order: OrderData }) => {
  const progress = getProgressPercentage(order);
  return (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
    className="mb-10 border border-white/10 bg-[#080808] p-8 relative overflow-hidden"
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(214,181,122,0.05),transparent_50%)]" />
    
    <div className="relative z-10 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
        <Package className="h-4 w-4" />
        <span>Current Status</span>
      </div>
      <span className="text-sm font-medium text-white/40" style={inter}>{progress}%</span>
    </div>
    
    <h4 className="text-xl text-white mb-6" style={cormorant}>{getStatusLabel(order.status)}</h4>
    
    <div className="relative h-1 w-full bg-white/10 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
        className="absolute inset-y-0 left-0 bg-[#D6B57A] shadow-[0_0_10px_#D6B57A]"
      />
    </div>
  </motion.div>
  )
})

const DeliveryTimeline = memo(({ order }: { order: OrderData }) => {
  const currentIndex = order.timeline.indexOf(order.status);
  const heightPercent = currentIndex >= 0 ? (currentIndex / (order.timeline.length - 1)) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
      className="mb-16 border border-white/10 bg-[#050505] p-8"
    >
      <h3 className="mb-10 text-2xl font-light text-white" style={cormorant}>Delivery Timeline</h3>
      <div className="relative pl-3">
        <div className="absolute left-[15px] top-2 bottom-4 w-px bg-white/10" />
        <motion.div 
          initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 1.5, delay: 1 }}
          className="absolute left-[15px] top-2 w-px bg-[#D6B57A] shadow-[0_0_5px_#D6B57A]" 
        />
        
        <div className="flex flex-col gap-8">
          {order.timeline.map((step, i) => {
            const status = i < currentIndex ? 'completed' : i === currentIndex ? 'active' : 'pending';
            return (
              <div key={i} className="relative flex items-center gap-6">
                <div className={`relative z-10 flex h-2 w-2 items-center justify-center rounded-full ${
                  status === 'completed' ? 'bg-[#D6B57A] shadow-[0_0_8px_#D6B57A]' : 
                  status === 'active' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] ring-4 ring-white/20' : 
                  'bg-[#333]'
                }`} />
                <motion.span 
                  animate={{ opacity: status === 'active' ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 2, repeat: status === 'active' ? Infinity : 0 }}
                  className={`text-[11px] uppercase tracking-widest ${
                  status === 'pending' ? 'text-white/30' : 
                  status === 'active' ? 'text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 
                  'text-[#D6B57A]'
                }`} style={inter}>
                  {getStatusLabel(step)}
                </motion.span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
})

const ActionButtons = memo(() => {
  const navigate = useNavigate()
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
      className="flex flex-col sm:flex-row gap-4 mb-16"
    >
      <button 
        onClick={() => {
          // TODO: Connect carrier tracking API
          console.log("Track Order clicked")
          navigate('/track-order')
        }}
        className="group relative flex flex-1 items-center justify-center overflow-hidden bg-white py-5 text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(214,181,122,0.4)]"
      >
        <motion.div 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-3" style={inter}>
          <MapPin className="h-4 w-4" /> Track Order
        </span>
      </button>
      
      <button 
        onClick={() => {
          // TODO: Connect invoice PDF API
          console.log("Download Invoice clicked")
        }}
        className="flex flex-1 items-center justify-center gap-3 border border-white/20 bg-transparent py-5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5" style={inter}>
        <Download className="h-4 w-4" /> Download Invoice
      </button>
    </motion.div>
  )
})

const EstimatedDeliveryCard = memo(({ order }: { order: OrderData }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
      className="mb-8 border border-[#D6B57A]/30 bg-[#D6B57A]/5 p-6 flex gap-5 items-center"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D6B57A]/30 bg-[#D6B57A]/10 text-[#D6B57A]">
        <Truck className="h-5 w-5" />
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-xs uppercase tracking-widest text-white/50" style={inter}>Estimated Arrival</h4>
        <p className="mt-1.5 text-xl font-light text-white" style={cormorant}>{order.estimatedArrival}</p>
      </div>
    </motion.div>
  )
})

const OrderSummary = memo(({ subtotal, finalTotal, items, discountPercent }: { subtotal: number, finalTotal: number, items: CartItem[], discountPercent: number }) => {
  const discountAmount = subtotal * (discountPercent / 100)
  return (
    <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
    className="mb-8 flex flex-col gap-8 border border-white/10 bg-[#050505] p-8"
  >
    <h2 className="text-2xl text-white mb-4" style={cormorant}>Order Summary</h2>
    
    <div className="flex flex-col gap-6 border-b border-white/10 pb-8">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="relative h-20 w-16 shrink-0 bg-black border border-white/5">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 border border-white/20 text-[9px] text-white backdrop-blur-md">
              {item.quantity}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h4 className="text-lg text-white" style={cormorant}>{item.name}</h4>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>{item.collection}</p>
          </div>
          <div className="flex items-center text-xs tracking-widest text-white/70" style={inter}>
            {formatPrice(parsePrice(String(item.price)) * item.quantity)}
          </div>
        </div>
      ))}
    </div>

    <div className="space-y-4">
      <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
        <span>Subtotal</span>
        <span className="text-white">{formatPrice(subtotal)}</span>
      </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-xs uppercase tracking-widest text-[#D6B57A]" style={inter}>
            <span>Privilege Savings</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
      <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
        <span>Shipping</span>
        <span className="text-white">Complimentary</span>
      </div>
    </div>

    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D6B57A]/50 to-transparent" />

    <div className="flex justify-between items-end text-sm uppercase tracking-widest text-white" style={inter}>
      <span>Total Paid</span>
      <span className="text-3xl text-[#D6B57A] font-light" style={cormorant}>{formatPrice(finalTotal)}</span>
    </div>
  </motion.div>
  )
})

const LuxuryPrivileges = memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
    className="mb-8"
  >
    <h4 className="mb-5 text-[10px] uppercase tracking-[0.2em] text-white/50" style={inter}>Included Privileges</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
      {['Maison Certified', 'Lifetime Care', 'Complimentary Cleaning', 'Delivery Protection', 'Personal Concierge'].map((privilege, i) => (
        <div key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/80" style={inter}>
          <ShieldCheck className="h-3.5 w-3.5 text-[#D6B57A]" />
          {privilege}
        </div>
      ))}
    </div>
  </motion.div>
))

const ConciergeCard = memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1 }}
    className="border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-8 text-center"
  >
    <Phone className="mx-auto h-6 w-6 text-[#D6B57A] mb-4" />
    <h4 className="text-2xl text-white" style={cormorant}>Need Assistance?</h4>
    <p className="mt-3 text-xs leading-relaxed text-white/50" style={inter}>
      Our specialists are available 24/7 to assist with delivery, gifting, care, and boutique services.
    </p>
    <button className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:text-white pb-1 border-b border-[#D6B57A]/30 hover:border-white" style={inter}>
      Speak With A Concierge
    </button>
  </motion.div>
))

const RecommendedProducts = memo(() => {
  const navigate = useNavigate()

  return (
    <section className="w-full border-white/10 bg-[#030303] py-24">
      <div className="mb-16 text-center">
        <h3 className="text-3xl font-light text-white md:text-4xl" style={cormorant}>Continue Exploring</h3>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>Curated For You</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {MOCK_RECOMMENDED.map((prod, idx) => (
          <motion.article
            key={prod.id}
            onClick={() => {
              navigate(`/product/${prod.id}`);
              window.scrollTo(0,0);
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0A0A]">
              <img src={prod.image} alt={prod.name} className="h-full w-full object-cover transition-all duration-[1.2s] group-hover:scale-[1.15] group-hover:brightness-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="mt-5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>{prod.collection}</p>
              <h4 className="mt-2 text-xl font-light text-white" style={cormorant}>{prod.name}</h4>
              <p className="mt-2 text-xs tracking-widest text-white/50" style={inter}>{prod.price}</p>
            </div>
          </motion.article>
        ))}
      </div>
      
      <div className="mt-16 flex justify-center">
        <button 
          onClick={() => navigate('/jewels')}
          className="border border-white/20 bg-transparent px-10 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black" style={inter}
        >
          Continue Shopping
        </button>
      </div>
    </section>
  )
})

const SocialProof = memo(() => (
  <div className=" border-white/10 py-16 text-center bg-[#050505]">
    <div className="flex justify-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D6B57A] text-[#D6B57A]" />)}
    </div>
    <h4 className="text-xl text-white mb-2" style={cormorant}>Trusted By Thousands Worldwide</h4>
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>4.9 / 5 Rating</p>
  </div>
))

const MaisonFooter = memo(() => {
  return (
    <section className="bg-[#020202] py-24 text-center border-t border-white/5">
      <p className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]" style={inter}>Veloria Maison</p>
      <h3 className="mt-6 text-4xl text-white md:text-5xl" style={cormorant}>Crafted For Generations</h3>
      <p className="mx-auto mt-6 max-w-xl text-sm text-white/50" style={inter}>
        Every creation is designed to outlive trends and become part of a legacy.
      </p>
    </section>
  )
})

// ──────────────── MAIN PAGE COMPONENT ────────────────

export function OrderSuccessPage() {
  const [isDesktop, setIsDesktop] = useState(true)
  
  const cartItems = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.cartTotal)
  const { discountPercent } = useCouponStore()
  const finalTotal = subtotal - (subtotal * (discountPercent / 100))
  
  // Replace with backend call later:
  // const order = await getOrder(orderId)
  const order = MOCK_ORDER;

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsDesktop(window.matchMedia('(pointer: fine)').matches)
  }, [])

  return (
    <div className={`relative ${isDesktop ? 'cursor-default' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans pb-24 md:pb-0`}>
      <SuccessNavbar />

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:py-16">
        <SuccessHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] xl:grid-cols-[65fr_35fr] gap-x-16 gap-y-10">
          {/* LEFT: Status & Timeline */}
          <div className="flex flex-col">
            <TrackOrderPreview order={order} />
            <DeliveryTimeline order={order} />
            <OrderDetailsCard order={order} />
            <ActionButtons />
          </div>

          {/* RIGHT: Order Summary & Privileges */}
          <div className="flex flex-col">
            <EstimatedDeliveryCard order={order} />
            <OrderSummary subtotal={subtotal} finalTotal={finalTotal} items={cartItems} discountPercent={discountPercent} />
            <LuxuryPrivileges />
            <ConciergeCard />
          </div>
        </div>
        
        <RecommendedProducts />
      </main>
      
      <SocialProof />
      <MaisonFooter />

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-[#050505]/90 px-6 py-4 backdrop-blur-xl lg:hidden">
        <button 
          onClick={() => navigate('/track-order')}
          className="group relative flex w-full items-center justify-center overflow-hidden bg-white py-4 text-black transition-transform active:scale-[0.98]"
        >
          <motion.div 
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2" style={inter}>
            <MapPin className="h-4 w-4" /> Track Order
          </span>
        </button>
      </div>
    </div>
  )
}