import React, { useEffect, useState, memo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Search, ShoppingBag, User, ArrowRight, Star, Heart,
  Truck, ShieldCheck, Phone, Download, Package
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

const parsePrice = (price: string | number) => {
  const num = typeof price === 'number' ? price : Number(String(price || 0).replace(/[^0-9.-]+/g, ''))
  return isNaN(num) ? 0 : num
}
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
    CANCELLED: 'Cancelled'
  };
  return mapping[status] || status;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'PROCESSING':
    case 'PREPARING':
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

const TrackingNavbar = memo(() => {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-16">
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

const TrackingHero = memo(({ order }: { order: OrderData }) => (
  <div className="relative mb-16 mt-8 flex flex-col items-center text-center lg:mb-20 lg:mt-12">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      className="text-5xl font-light tracking-wide text-white lg:text-7xl" style={cormorant}
    >
      Track Your Creation
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
      className="mt-6 max-w-lg text-[10px] uppercase tracking-[0.25em] leading-relaxed text-white/50 lg:text-xs" style={inter}
    >
      Follow the journey of your Veloria creation from our atelier to your doorstep.
    </motion.p>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12"
    >
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2" style={inter}>Order Number</span>
        <span className="text-lg tracking-widest text-[#D6B57A]" style={inter}>#{order.id}</span>
      </div>
      <div className="hidden sm:block h-10 w-px bg-white/10" />
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2" style={inter}>Estimated Arrival</span>
        <span className="text-lg tracking-widest text-white" style={inter}>{order.estimatedArrival}</span>
      </div>
    </motion.div>
  </div>
))

const OrderStatusCard = memo(({ order }: { order: OrderData }) => {
  const progress = getProgressPercentage(order);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-12 border border-[#D6B57A]/30 bg-[#0A0A0A] p-8 md:p-12 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.08),transparent_50%)]" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A] mb-4" style={inter}>
            <Package className="h-4 w-4" />
            <span>Current Status</span>
          </div>
          <h3 className="text-3xl md:text-4xl text-white font-light" style={cormorant}>{getStatusLabel(order.status)}</h3>
        </div>
        <div className={`flex items-center gap-3 border px-5 py-2.5 rounded-full ${getStatusColor(order.status)}`}>
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"
          />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={inter}>{getStatusLabel(order.status)}</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs text-white/50" style={inter}>Atelier Assembly</span>
          <span className="text-sm font-medium text-white tracking-widest" style={inter}>{progress}% Complete</span>
        </div>
        <div className="relative h-1 w-full bg-white/10 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-[#D6B57A] shadow-[0_0_10px_#D6B57A]"
          />
        </div>
      </div>
    </motion.div>
  )
})

const TrackingTimeline = memo(({ order }: { order: OrderData }) => {
  const currentIndex = order.timeline.indexOf(order.status);
  const heightPercent = currentIndex >= 0 ? (currentIndex / (order.timeline.length - 1)) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-12 border border-white/10 bg-[#050505] p-8 md:p-12"
    >
      <h3 className="mb-10 text-2xl font-light text-white" style={cormorant}>Tracking Timeline</h3>
      <div className="relative pl-3 md:pl-4">
        <div className="absolute left-[15px] md:left-[19px] top-2 bottom-4 w-px bg-white/10" />
        <motion.div 
          initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
          className="absolute left-[15px] md:left-[19px] top-2 w-px bg-[#D6B57A] shadow-[0_0_8px_#D6B57A]" 
        />
        
        <div className="flex flex-col gap-10">
          {order.timeline.map((step, i) => {
            const status = i < currentIndex ? 'completed' : i === currentIndex ? 'active' : 'pending';
            return (
              <div key={i} className="relative flex items-center gap-6 md:gap-8">
                <div className={`relative z-10 flex h-2 w-2 md:h-3 md:w-3 items-center justify-center rounded-full ${
                  status === 'completed' ? 'bg-[#D6B57A] shadow-[0_0_10px_#D6B57A]' : 
                  status === 'active' ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] ring-4 ring-white/20' : 
                  'bg-[#222] border border-white/20'
                }`} />
                <div className="flex flex-col">
                  <motion.span 
                    animate={{ opacity: status === 'active' ? [0.5, 1, 0.5] : 1 }}
                    transition={{ duration: 2, repeat: status === 'active' ? Infinity : 0 }}
                    className={`text-[11px] md:text-xs uppercase tracking-widest ${
                    status === 'pending' ? 'text-white/30' : 
                    status === 'active' ? 'text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 
                    'text-[#D6B57A]'
                  }`} style={inter}>
                    {getStatusLabel(step)}
                  </motion.span>
                  {status === 'active' && (
                    <span className="mt-2 text-xs text-white/50 max-w-sm leading-relaxed" style={inter}>
                      Our master artisans are currently assembling, polishing, and perfecting every detail of your piece.
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
})


const ShipmentDetails = memo(({ order }: { order: OrderData }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
    className="mb-8 border border-white/10 bg-[#050505] p-8"
  >
    <h3 className="mb-8 text-2xl font-light text-white" style={cormorant}>Shipment Details</h3>
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Courier Partner</span>
        <span className="text-sm text-white" style={inter}>Veloria Secure Logistics</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Tracking Number</span>
        <span className="text-sm text-[#D6B57A] tracking-widest cursor-pointer hover:underline" style={inter}>{order.trackingNumber}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Shipping Method</span>
        <span className="text-sm text-white" style={inter}>{order.deliveryMethod}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Package Protection</span>
        <span className="text-sm text-white flex items-center gap-2" style={inter}><ShieldCheck className="h-4 w-4 text-[#D6B57A]"/> Included</span>
      </div>
    </div>
  </motion.div>
))

const EstimatedDelivery = memo(({ order }: { order: OrderData }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
    className="mb-8 border border-[#D6B57A]/30 bg-[#D6B57A]/5 p-8 flex gap-5 items-center"
  >
    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D6B57A]/30 bg-[#D6B57A]/10 text-[#D6B57A]">
      <Truck className="h-5 w-5" />
    </div>
    <div className="flex flex-col justify-center">
      <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A] mb-1.5" style={inter}>Estimated Arrival</h4>
      <p className="text-2xl font-light text-white" style={cormorant}>{order.estimatedArrival}</p>
    </div>
  </motion.div>
))

const DeliveryAddressCard = memo(({ order }: { order: OrderData | any }) => {
  const addr = order.address || order.shipping_address || {};
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mb-12 border border-white/10 bg-[#050505] p-8 md:p-12"
    >
      <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
        Delivery Destination
      </p>

      <h3 className="text-2xl text-white" style={cormorant}>{addr.full_name || addr.fullName || 'Valued Client'}</h3>

      <p className="mt-2 text-white/60" style={inter}>{addr.phone || 'N/A'}</p>

      <p className="mt-6 leading-8 text-white/70" style={inter}>
        {addr.address_line_1 || addr.addressLine1 || 'Pending Address Details'}<br/>
        {addr.address_line_2 || addr.addressLine2 ? <>{addr.address_line_2 || addr.addressLine2}<br/></> : null}
        {addr.city}, {addr.state} {addr.postal_code || addr.postalCode}<br/>
        {addr.country || 'India'}
      </p>

      <div className="mt-6 border-t border-white/10 pt-6">
        <p className="text-xs text-white/50" style={inter}>
          Your Veloria creation will be delivered to the address above.
        </p>
      </div>
    </motion.div>
  )
})

const OrderDetailsCard = memo(({ order }: { order: OrderData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.55 }}
    className="mb-12 border border-white/10 bg-[#050505] p-8 md:p-12"
  >
    <h3 className="mb-8 text-2xl text-white" style={cormorant}>Order Details</h3>

    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Order Number</p>
        <p className="mt-2 text-white" style={inter}>{order.id}</p>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Order Date</p>
        <p className="mt-2 text-white" style={inter}>{order.createdAt}</p>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Payment Status</p>
        <span className={`mt-2 inline-flex border px-3 py-1 text-[10px] uppercase tracking-widest ${getStatusColor(order.paymentStatus)}`}>
          {order.paymentStatus}
        </span>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={inter}>Delivery Method</p>
        <p className="mt-2 text-white" style={inter}>{order.deliveryMethod}</p>
      </div>
    </div>
  </motion.div>
))

const OrderSummary = memo(({ items, subtotal, finalTotal, discountType, discountValue }: { items: CartItem[], subtotal: number, finalTotal: number, discountType: string, discountValue: number }) => {
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  return (
    <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
    className="mb-8 flex flex-col gap-6 border border-white/10 bg-[#050505] p-8"
  >
    <h2 className="text-2xl text-white mb-2" style={cormorant}>Order Summary</h2>
    
    <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
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
            {formatPrice(parsePrice(item.price as any) * item.quantity)}
          </div>
        </div>
      ))}
    </div>

    <div className="space-y-4">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/60" style={inter}>
        <span>Subtotal</span>
        <span className="text-white">{formatPrice(subtotal)}</span>
      </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
            <span>Privilege Savings</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/60" style={inter}>
        <span>Shipping</span>
        <span className="text-white">Complimentary</span>
      </div>
    </div>

    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D6B57A]/50 to-transparent" />

    <div className="flex justify-between items-end text-sm uppercase tracking-widest text-white" style={inter}>
      <span>Total</span>
        <span className="text-2xl text-[#D6B57A] font-light" style={cormorant}>{formatPrice(finalTotal)}</span>
    </div>
  </motion.div>
  )
})

const ConciergeCard = memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
    className="mb-8 border border-white/10 bg-[#0A0A0A] p-8 text-center relative overflow-hidden group"
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(214,181,122,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <Phone className="mx-auto h-5 w-5 text-[#D6B57A] mb-4" />
    <h4 className="text-xl text-white" style={cormorant}>Need Assistance?</h4>
    <p className="mt-3 text-[11px] leading-relaxed text-white/50" style={inter}>
      Our specialists are available 24/7 to assist with delivery, gifting, care and boutique services.
    </p>
    <div className="mt-8 flex flex-col gap-3">
      <button className="w-full border border-[#D6B57A]/30 bg-[#D6B57A]/5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:bg-[#D6B57A]/10 hover:border-[#D6B57A]/60" style={inter}>
        Speak With A Concierge
      </button>
      <button className="w-full border border-white/10 bg-transparent py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:bg-white/5 hover:text-white" style={inter}>
        Contact Boutique
      </button>
    </div>
  </motion.div>
))

const CarePackageBenefits = memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
    className="mb-8 border border-white/10 bg-[#050505] p-8"
  >
    <h4 className="mb-6 text-[10px] uppercase tracking-[0.2em] text-white/50" style={inter}>Care Package Included</h4>
    <ul className="space-y-4">
      {['Lifetime Care', 'Complimentary Cleaning', 'Delivery Protection', 'Maison Certification', 'Personal Concierge'].map((privilege, i) => (
        <li key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/80" style={inter}>
          <ShieldCheck className="h-3 w-3 text-[#D6B57A]" />
          {privilege}
        </li>
      ))}
    </ul>
  </motion.div>
))

const ActionButtons = memo(({ orderId }: { orderId: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
    className="flex flex-col sm:flex-row gap-4 mb-16"
  >
    <button 
      onClick={() => {
        // TODO: Connect carrier tracking API
        console.log("Track Order clicked");
      }}
      className="flex flex-1 items-center justify-center gap-3 border border-white/20 bg-transparent py-5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black" style={inter}>
      Track Another Order
    </button>
    <button 
      onClick={async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
          const res = await fetch(`${API_URL}/orders/${orderId}/invoice`);
          if (!res.ok) throw new Error("Invoice not found. Make sure this is a real order ID.");
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Veloria-Invoice-${orderId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        } catch (e: any) {
          alert(e.message || "Failed to download invoice");
        }
      }}
      className="flex flex-1 items-center justify-center gap-3 border border-white/20 bg-transparent py-5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5" style={inter}>
      <Download className="h-4 w-4" /> Download Invoice
    </button>
  </motion.div>
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

export function OrderTrackingPage() {
  const [isDesktop, setIsDesktop] = useState(true)
  const [searchParams] = useSearchParams()
  
  const cartItems = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.cartTotal)
  const { discountType, discountValue } = useCouponStore()
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) || 0;


  const currentOrderId = searchParams.get('id') || MOCK_ORDER.id;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsDesktop(window.matchMedia('(pointer: fine)').matches)

    const fetchOrder = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
        const token = useAuthStore.getState().token || localStorage.getItem('token') || '';
        const res = await fetch(`${API_URL}/orders/${currentOrderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setOrder({ ...MOCK_ORDER, id: currentOrderId });
        }
      } catch (e) {
        setOrder({ ...MOCK_ORDER, id: currentOrderId });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

  }, [currentOrderId])

  if (loading || !order) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-[#D6B57A] text-sm uppercase tracking-widest" style={inter}>Retrieving Details...</div>;
  }

  return (
    <div className={`relative ${isDesktop ? 'cursor-default' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans pb-24 md:pb-0`}>
      <TrackingNavbar />

      <main className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:py-16">
        <TrackingHero order={order} />
        
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] xl:grid-cols-[60fr_40fr] gap-x-12 xl:gap-x-16 gap-y-10">
          {/* LEFT COLUMN: Timeline & Status */}
          <div className="flex flex-col">
            <OrderStatusCard order={order} />
            <TrackingTimeline order={order} />
            <DeliveryAddressCard order={order} />
            <OrderDetailsCard order={order} />
            <ActionButtons orderId={currentOrderId} />
          </div>

          {/* RIGHT COLUMN: Details & Settings */}
          <div className="flex flex-col">
            <EstimatedDelivery order={order} />
            <ShipmentDetails order={order} />
            <OrderSummary 
              items={order.items && order.items.length > 0 ? order.items : cartItems} 
              subtotal={order.amount || subtotal} 
              finalTotal={order.amount || finalTotal} 
              discountType={discountType} 
              discountValue={discountValue} 
            />
            <ConciergeCard />
            <CarePackageBenefits />
          </div>
        </div>
        
      </main>
      
      <MaisonFooter />

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-[#050505]/90 px-6 py-4 backdrop-blur-xl lg:hidden">
        <button className="group relative flex w-full items-center justify-center overflow-hidden bg-white py-4 text-black transition-transform active:scale-[0.98]">
          <motion.div 
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2" style={inter}>
            <Phone className="h-4 w-4" /> Speak With A Concierge
          </span>
        </button>
      </div>
    </div>
  )
}