import React, { useState, useEffect, memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, ShieldCheck, Lock, Gift, MapPin, Info, 
  CreditCard, Sparkles, ArrowRight, ChevronRight, User
} from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCouponStore } from '@/store/couponStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

// ──────────────── MOCK DATA ────────────────

const parsePrice = (price: string | number) => {
  const num = typeof price === 'number' ? price : Number(String(price || 0).replace(/[^0-9.-]+/g, ''))
  return isNaN(num) ? 0 : num
}
const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)

// ──────────────── REUSABLE UI COMPONENTS ────────────────

const LuxuryInput = memo(({ label, type = "text", required = false, className = "", ...props }: any) => (
  <div className={`relative w-full ${className}`}>
    <input
      type={type}
      required={required}
      className="peer block w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0"
      placeholder=" "
      {...props}
    />
    <label className="absolute top-4 -z-10 origin-[0] -translate-y-6 scale-75 transform text-[10px] uppercase tracking-widest text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D6B57A]">
      {label} {required && <span className="text-[#D6B57A]">*</span>}
    </label>
  </div>
))

const CheckoutNavbar = memo(() => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-0">
        <button onClick={() => navigate('/')} className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</button>
        <div className="flex items-center gap-2 text-[#D6B57A]/80 text-[10px] uppercase tracking-widest" style={inter}>
          <Lock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">Secure Checkout</span>
          <div className="ml-4 h-3 w-px bg-[#D6B57A]/30" />
          <button 
            onClick={() => navigate(isAuthenticated && role ? `/${role.toLowerCase()}` : '/login')}
            className="ml-4 transition-all hover:scale-110 hover:text-white"
          >
            <User className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  )
})

const CheckoutProgress = memo(() => (
  <div className="mb-12 flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] md:text-[10px]" style={inter}>
    <span className="text-white/60 flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-[#D6B57A]"/> Cart</span>
    <div className="relative h-[1px] flex-1 overflow-hidden bg-white/10">
      <motion.div 
        initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1, ease: 'easeOut' }} 
        className="absolute inset-0 bg-[#D6B57A]" 
      />
    </div>
    <span className="text-[#D6B57A]">● Address</span>
    <div className="h-[1px] flex-1 bg-white/10" />
    <span className="text-white/40">○ Payment</span>
  </div>
))

const SkeletonLoader = memo(() => (
  <div className="animate-pulse">
    <div className="h-4 w-64 bg-white/10 mb-12" />
    <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-16">
      <div className="space-y-12">
        <div className="h-10 w-48 bg-white/10" />
        <div className="space-y-6">
          <div className="h-14 w-full bg-white/5" />
          <div className="h-14 w-full bg-white/5" />
        </div>
        <div className="h-10 w-48 bg-white/10 mt-16" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-14 w-full bg-white/5" />
          <div className="h-14 w-full bg-white/5" />
          <div className="h-14 w-full bg-white/5 col-span-2" />
        </div>
      </div>
      <div>
        <div className="h-[500px] w-full bg-white/5" />
      </div>
    </div>
  </div>
))

// ──────────────── CHECKOUT SECTIONS ────────────────

const SavedAddressCard = memo(({ selected }: { selected: boolean }) => (
  <div className={`mb-6 cursor-pointer border p-6 transition-all duration-500 ${selected ? 'border-[#D6B57A] bg-[#D6B57A]/5 shadow-[0_0_20px_rgba(214,181,122,0.1)]' : 'border-white/10 bg-[#050505] hover:border-white/30'}`}>
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <MapPin className={`h-5 w-5 mt-0.5 ${selected ? 'text-[#D6B57A]' : 'text-white/40'}`} />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Saved Address</p>
            <span className="rounded-full border border-[#D6B57A]/30 bg-[#D6B57A]/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Default Address</span>
          </div>
          <p className="text-lg text-white" style={cormorant}>Eleanor Vance</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60" style={inter}>
            1040 Fifth Avenue, Penthouse B<br/>
            New York, NY 10028<br/>
            United States
          </p>
          {selected && (
            <p className="mt-4 text-[10px] uppercase tracking-widest text-green-400 flex items-center gap-1.5" style={inter}>
              <CheckCircle className="h-3 w-3" /> This address is selected for delivery
            </p>
          )}
        </div>
      </div>
      {selected && <CheckCircle className="h-5 w-5 text-[#D6B57A]" />}
    </div>
  </div>
))

const DeliveryOptions = memo(({ selected, onSelect }: { selected: string, onSelect: (val: string) => void }) => {
  const options = [
    { id: 'complimentary', title: 'Complimentary Insured Delivery', desc: 'Arrives in 2-4 business days', price: 'Free', icon: ShieldCheck },
    { id: 'express', title: 'Express Priority Delivery', desc: 'Arrives in 1-2 business days', price: '$50', icon: Sparkles },
    { id: 'boutique', title: 'Boutique Collection', desc: 'Pick up from your nearest maison', price: 'Free', icon: MapPin },
  ]

  return (
    <div className="mt-12">
      <h3 className="mb-8 text-2xl font-light text-white" style={cormorant}>Delivery Method</h3>
      <div className="flex flex-col gap-4">
        {options.map(opt => {
          const isSelected = selected === opt.id
          const Icon = opt.icon
          return (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`group relative cursor-pointer border p-6 transition-all duration-500 ${
                isSelected 
                  ? 'border-[#D6B57A] bg-[#D6B57A]/5 shadow-[0_0_20px_rgba(214,181,122,0.1)]' 
                  : 'border-white/10 bg-[#050505] hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${isSelected ? 'border-[#D6B57A] bg-[#D6B57A]/10 text-[#D6B57A]' : 'border-white/10 text-white/40 group-hover:text-white'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`text-sm tracking-wide ${isSelected ? 'text-[#D6B57A]' : 'text-white'}`} style={inter}>{opt.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-white/50" style={inter}>{opt.desc}</p>
                  </div>
                </div>
                <span className="text-xs tracking-widest text-white" style={inter}>{opt.price}</span>
              </div>
              {opt.id === 'boutique' && isSelected && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 border-t border-[#D6B57A]/20 pt-4">
                  <button className="text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] hover:text-white transition-colors" style={inter}>
                    Find Nearby Boutique <ChevronRight className="inline h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})

const GiftPackaging = memo(({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
  <div className="mt-12 border-t border-white/10 pt-12">
    <h3 className="mb-8 text-2xl font-light text-white" style={cormorant}>Gifting Experience</h3>
    <div className="border border-white/10 bg-[#050505] p-6 transition-all duration-500 hover:border-white/20">
      <div className="flex items-start gap-4">
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${enabled ? 'border-[#D6B57A] bg-[#D6B57A]' : 'border-white/30 bg-transparent'}`}
        >
          {enabled && <CheckCircle className="h-3.5 w-3.5 text-black" />}
        </button>
        <div className="flex-1">
          <p className="text-sm tracking-wide text-white" style={inter}>Include Signature Gift Packaging</p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/50" style={inter}>
            Your creation will be beautifully wrapped in our iconic Maison box, tied with a premium ribbon, and securely placed in an unbranded outer box.
          </p>
          
          <AnimatePresence>
            {enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="h-16 w-16 shrink-0 bg-[#0A0A0A] border border-white/5 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-[#D6B57A]/50" />
                  </div>
                  <LuxuryInput label="Gift Message (Optional)" placeholder="Write your handwritten note..." />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
))

const OrderSummary = memo(({ 
  subtotal, discountType, discountValue, deliveryCost, onApplyCoupon, items 
}: { 
  subtotal: number, discountType: string, discountValue: number, deliveryCost: number, onApplyCoupon: (code: string) => void, items: CartItem[] 
}) => {
  const couponCode = useCouponStore(state => state.couponCode)
  const [couponInput, setCouponInput] = useState(couponCode)
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) + deliveryCost || 0;

  const estimatedArrival = useMemo(() => {
    const d1 = new Date(); d1.setDate(d1.getDate() + (deliveryCost === 50 ? 1 : 2));
    const d2 = new Date(); d2.setDate(d2.getDate() + (deliveryCost === 50 ? 2 : 4));
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${d1.toLocaleDateString('en-US', opts)} – ${d2.toLocaleDateString('en-US', opts)}`;
  }, [deliveryCost])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
      className="sticky top-32 flex flex-col gap-8"
    >
      <div className="border border-white/10 bg-[#050505] p-8">
        <h2 className="text-2xl text-white mb-8" style={cormorant}>Order Summary</h2>
        
        {/* Items Preview */}
        <div className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 bg-black">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[9px] text-white backdrop-blur-md">
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

        {/* Coupon */}
        <div className="mb-8 flex gap-3">
          <input 
            type="text" 
            placeholder="Privilege Code" 
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="h-12 flex-1 border border-white/20 bg-transparent px-4 text-[10px] uppercase tracking-widest text-white outline-none focus:border-[#D6B57A]" 
            style={inter}
          />
          <button 
            onClick={() => { onApplyCoupon(couponInput); setCouponInput(''); }}
            className="border border-[#D6B57A]/40 px-6 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:bg-[#D6B57A]/10"
            style={inter}
          >
            Apply
          </button>
        </div>

        {/* Totals */}
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
            <span className="text-white">{deliveryCost > 0 ? formatPrice(deliveryCost) : 'Complimentary'}</span>
          </div>
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Taxes</span>
            <span className="text-white/40">Calculated at checkout</span>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        <div className="flex justify-between text-sm uppercase tracking-widest text-white" style={inter}>
          <span>Total</span>
          <span className="text-lg text-[#D6B57A]">{formatPrice(finalTotal)}</span>
        </div>

        <div className="mt-8 flex items-center gap-3 border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-4">
          <Info className="h-4 w-4 text-[#D6B57A]" />
          <div className="flex flex-col text-[10px] uppercase tracking-widest" style={inter}>
            <span className="text-white/50">Estimated Arrival</span>
            
            <span className="mt-0.5 text-[#D6B57A]">{estimatedArrival}</span>
          </div>
        </div>
      </div>

      {/* Secure Badges */}
      <div className="grid grid-cols-1 gap-4 border-y border-white/10 py-6">
        {[
          '256-bit Secure Checkout', 
          'Delivery Protection Included', 
          'Complimentary Cleaning & Maintenance'
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/60" style={inter}>
            <ShieldCheck className="h-3.5 w-3.5 text-[#D6B57A]" />
            {badge}
          </div>
        ))}
      </div>

      <div className="border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
  <p
    className="text-[10px] uppercase tracking-[0.2em] text-[#D6B57A]"
    style={inter}
  >
    Maison Concierge
  </p>

  <h4
    className="mt-3 text-2xl text-white"
    style={cormorant}
  >
    Need Assistance?
  </h4>

  <p
    className="mt-2 text-xs leading-relaxed text-white/50"
    style={inter}
  >
    Our jewellery specialists are available 24/7 to help with
    sizing, gifting, delivery and boutique appointments.
  </p>

  <button
    className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:text-white"
    style={inter}
  >
    Speak With A Concierge →
  </button>
</div>

      {/* Payment Preview */}
      <div className="flex items-center justify-center gap-4 text-white/20">
        <CreditCard className="h-6 w-6" />
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest">Apple Pay</span>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest">Google Pay</span>
      </div>
    </motion.div>
  )
})

// ──────────────── MAIN PAGE COMPONENT ────────────────

export function CheckoutPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [deliveryMethod, setDeliveryMethod] = useState('complimentary')
  const [giftPackaging, setGiftPackaging] = useState(false)
  const { discountType, discountValue, applyCoupon } = useCouponStore()
  const [toast, setToast] = useState({ show: false, message: '' })

  const cartItems = useCartStore(state => state.items)
  const { isAuthenticated, user } = useAuthStore()
  const [useSavedAddress, setUseSavedAddress] = useState(true)
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const subtotal = useCartStore(state => state.cartTotal)
  const deliveryCost = deliveryMethod === 'express' ? 50 : 0
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) + deliveryCost || 0;

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toast.show) return
    const timer = setTimeout(() => setToast({ show: false, message: '' }), 3000)
    return () => clearTimeout(timer)
  }, [toast.show])

  const handleApplyCoupon = async (code: string) => {
    const res = await applyCoupon(code, subtotal)
    setToast({ show: true, message: res.message })
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white font-sans pb-32 lg:pb-0">
      
      <CheckoutNavbar />

      {/* Luxury Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 z-[600] flex -translate-x-1/2 items-center gap-3 border border-[#D6B57A]/30 bg-[#0A0A0A]/95 px-6 py-4 backdrop-blur-xl lg:bottom-10"
          >
            <CheckCircle className="h-4 w-4 text-[#D6B57A]" />
            <span className="text-[11px] uppercase tracking-widest text-white" style={inter}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-16">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] xl:grid-cols-[65fr_35fr] gap-16"
          >
            {/* LEFT: Checkout Form */}
            <div className="flex flex-col">
              <CheckoutProgress />

              {/* Contact Information */}
              <section>
                <div className="mb-8 flex items-center justify-between">
  <h3 className="text-2xl font-light text-white" style={cormorant}>Contact Information</h3>
  {!isAuthenticated && (
    <button className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors" style={inter}>
      Already have an account? Log In
    </button>
  )}
</div>

{isAuthenticated ? (
  <div className="border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-6">
    <p className="text-[10px] uppercase tracking-widest text-[#D6B57A] mb-2" style={inter}>
      Using Maison Account
    </p>
    <p className="text-white">{user?.email || 'customer@veloria.com'}</p>
<p className="mt-1 text-white/60 text-sm">{user?.phone || '+1 (000) 000-0000'}</p>
<p className="mt-4 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
  Contact details will be used for order updates and delivery notifications.
</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <LuxuryInput label="Email Address" type="email" required />
    <LuxuryInput label="Mobile Number" type="tel" required />
  </div>
)}
              </section>

              {/* Shipping Address */}
              <section className="mt-12 border-t border-white/10 pt-12">
                <h3 className="mb-2 text-2xl font-light text-white" style={cormorant}>Select Delivery Address</h3>
                <p className="mb-8 text-xs text-white/50" style={inter}>Choose a saved address or enter a new destination for this order.</p>
                
                <div className="space-y-4 mb-8">
  <button
    type="button"
    onClick={() => { setUseSavedAddress(true); setAddressConfirmed(false); }}
    className={`w-full text-left ${useSavedAddress ? '' : 'opacity-70'}`}
  >
    <SavedAddressCard selected={useSavedAddress} />
  </button>

  <button
    type="button"
    onClick={() => { setUseSavedAddress(false); setAddressConfirmed(false); }}
    className={`border p-6 text-left w-full transition-all duration-500 ${!useSavedAddress ? 'border-[#D6B57A] bg-[#D6B57A]/5' : 'border-white/10 bg-[#050505] hover:border-white/30'}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-[10px] uppercase tracking-widest ${!useSavedAddress ? 'text-[#D6B57A]' : 'text-white/60'}`} style={inter}>
          Add New Address
        </p>
        <p className="mt-2 text-white/60 text-xs" style={inter}>
          Enter a new delivery destination for this order.
        </p>
      </div>
      {!useSavedAddress && <CheckCircle className="h-5 w-5 text-[#D6B57A]" />}
    </div>
  </button>
</div>

                {!useSavedAddress && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 border-t border-white/10 pt-8">
                    <div className="mb-8">
                      <h4 className="text-2xl text-white" style={cormorant}>
                        Maison Delivery Destination
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-white/60" style={inter}>
                        Where should we deliver your Veloria creation? This address will be used for shipping, delivery updates and order verification.
                      </p>
                    </div>

                    {!addressConfirmed ? (
                      <div className="space-y-10">
                        {/* SECTION 1 */}
                        <div>
                          <p className="mb-4 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Recipient Information</p>
                          <p className="mb-6 text-xs text-white/50" style={inter}>
                            Please enter the recipient&apos;s details exactly as they should appear during delivery.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>First Name <span className="text-[#D6B57A]">*</span></p>
                              <LuxuryInput label="First Name" required />
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>Last Name <span className="text-[#D6B57A]">*</span></p>
                              <LuxuryInput label="Last Name" required />
                            </div>
                            <div className="md:col-span-2">
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>Mobile Number <span className="text-[#D6B57A]">*</span></p>
                              <LuxuryInput label="Mobile Number" type="tel" required />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2 */}
                        <div>
                          <p className="mb-4 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Location Details</p>
                          <p className="mb-6 text-xs text-white/50" style={inter}>
                            Select the destination where you would like this order delivered.
                          </p>
                          <div className="mb-6 border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-4">
                            <p className="text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                              Required Delivery Information
                            </p>
                            <p className="mt-2 text-xs text-white/60" style={inter}>
                              Please provide Country, State, City, Postal Code and Complete Address so our concierge team can arrange secure delivery.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>Country <span className="text-[#D6B57A]">*</span></p>
                              <select className="w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0">
                                <option value="IN" className="bg-[#050505]">India</option>
                                <option value="US" className="bg-[#050505]">United States</option>
                                <option value="UK" className="bg-[#050505]">United Kingdom</option>
                                <option value="CA" className="bg-[#050505]">Canada</option>
                                <option value="AU" className="bg-[#050505]">Australia</option>
                              </select>
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>State <span className="text-[#D6B57A]">*</span></p>
                              <select className="w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0">
                                <option value="">Select State</option>
                                <option>Andhra Pradesh</option>
                                <option>Arunachal Pradesh</option>
                                <option>Assam</option>
                                <option>Bihar</option>
                                <option>Chhattisgarh</option>
                                <option>Goa</option>
                                <option>Gujarat</option>
                                <option>Haryana</option>
                                <option>Himachal Pradesh</option>
                                <option>Jharkhand</option>
                                <option>Karnataka</option>
                                <option>Kerala</option>
                                <option>Madhya Pradesh</option>
                                <option>Maharashtra</option>
                                <option>Manipur</option>
                                <option>Meghalaya</option>
                                <option>Mizoram</option>
                                <option>Nagaland</option>
                                <option>Odisha</option>
                                <option>Punjab</option>
                                <option>Rajasthan</option>
                                <option>Sikkim</option>
                                <option>Tamil Nadu</option>
                                <option>Telangana</option>
                                <option>Tripura</option>
                                <option>Uttar Pradesh</option>
                                <option>Uttarakhand</option>
                                <option>West Bengal</option>
                                <option>Andaman and Nicobar Islands</option>
                                <option>Chandigarh</option>
                                <option>Dadra and Nagar Haveli and Daman and Diu</option>
                                <option>Delhi</option>
                                <option>Jammu and Kashmir</option>
                                <option>Ladakh</option>
                                <option>Lakshadweep</option>
                                <option>Puducherry</option>
                              </select>
                            </div>
                            <div className="flex flex-col justify-end">
                              <div>
                                <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>
                                  City / Town <span className="text-[#D6B57A]">*</span>
                                </p>
                                <LuxuryInput label="City / Town" required />
                                <p className="mt-2 text-[11px] text-white/40" style={inter}>
                                  Example: Noida, Mumbai, Bengaluru
                                </p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <div>
                                <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>
                                  ZIP / Postal Code <span className="text-[#D6B57A]">*</span>
                                </p>
                                <LuxuryInput label="ZIP / Postal Code" required />
                                <p className="mt-2 text-[11px] text-white/40" style={inter}>
                                  Example: 201301
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3 */}
                        <div>
                          <p className="mb-4 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Street Address</p>
                          <p className="mb-6 text-xs text-white/50" style={inter}>
                            Enter the complete delivery address including building, apartment or locality details.
                          </p>
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>
                                Address Line 1 <span className="text-[#D6B57A]">*</span>
                              </p>
                              <LuxuryInput label="House No., Apartment, Building Name" required />
                              <p className="mt-2 text-[11px] text-white/40" style={inter}>
                                Example: Flat 1204, Tower B, Palm Residency
                              </p>
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50" style={inter}>
                                Address Line 2 <span className="text-white/30">(Optional)</span>
                              </p>
                              <LuxuryInput label="Street, Area, Landmark" />
                              <p className="mt-2 text-[11px] text-white/40" style={inter}>
                                Example: Near Metro Station, Sector 62
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-5">
                            <p className="text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                              Delivery Preview
                            </p>
                            <p className="mt-3 text-sm text-white/60" style={inter}>
                              The address entered above will be used for shipping and delivery updates.
                            </p>
                          </div>
                        </div>
                        <div className="mt-8">
                          <button 
                            onClick={() => setAddressConfirmed(true)} 
                            className="w-full border border-white/20 bg-white py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-black transition-all hover:bg-transparent hover:text-white hover:border-[#D6B57A]" style={inter}
                          >
                            Save &amp; Use This Address
                          </button>
                          <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-white/40" style={inter}>
                            This address will be used for shipping, delivery updates and order verification.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-green-500/30 bg-green-500/5 p-6 flex items-start gap-4">
                        <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-lg text-white" style={cormorant}>Address Confirmed</h4>
                          <p className="mt-1 text-xs text-white/60 leading-relaxed" style={inter}>Your delivery destination has been successfully saved and will be used for this order.</p>
                          <button onClick={() => setAddressConfirmed(false)} className="mt-4 text-[10px] uppercase tracking-widest text-[#D6B57A] hover:text-white border-b border-[#D6B57A]/30 pb-0.5 transition-colors" style={inter}>Edit Address</button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </section>

              <DeliveryOptions selected={deliveryMethod} onSelect={setDeliveryMethod} />
              
              <GiftPackaging enabled={giftPackaging} setEnabled={setGiftPackaging} />

              {/* Special Requests */}
              <div className="mt-12 border-t border-white/10 pt-12">
                <h3 className="mb-8 text-2xl font-light text-white" style={cormorant}>Special Requests</h3>
                <div className="relative w-full">
                  <textarea
                    rows={4}
                    className="peer block w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0 resize-none"
                    placeholder=" "
                  />
                  <label className="absolute top-4 -z-10 origin-[0] -translate-y-6 scale-75 transform text-[10px] uppercase tracking-widest text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D6B57A]">
                    Delivery Notes or Special Instructions
                  </label>
                </div>
              </div>

              {/* Desktop Continue Button */}
              <div className="mt-16 hidden lg:block">
                <button onClick={() => navigate('/payment')} className="group relative flex w-full items-center justify-center overflow-hidden bg-white py-5 text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(214,181,122,0.4)]">
                  <motion.div 
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  />
                  <span className="relative z-10 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-3" style={inter}>
                    Continue To Payment <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

            </div>

            {/* RIGHT: Order Summary */}
            <div>
              <OrderSummary 
                subtotal={subtotal} 
                  discountType={discountType}
                  discountValue={discountValue}
                deliveryCost={deliveryCost} 
                onApplyCoupon={handleApplyCoupon}
                items={cartItems}
              />
            </div>
            
          </motion.div>
        )}
      </main>

      {/* MOBILE STICKY CONTINUE BAR */}
      {!loading && (
        <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-[#050505]/90 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60" style={inter}>Total</span>
            <span className="text-lg text-[#D6B57A]" style={inter}>{formatPrice(finalTotal)}</span>
          </div>
          <button onClick={() => {
              if (!useSavedAddress && !addressConfirmed) {
                setToast({
                  show: true,
                  message: 'Please confirm your delivery address'
                })
                return
              }
              navigate('/payment')
            }} className="group relative flex w-full items-center justify-center overflow-hidden bg-white py-4 text-black transition-transform active:scale-[0.98]">
            <motion.div 
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium" style={inter}>
              Continue To Payment
            </span>
          </button>
        </div>
      )}
    </div>
  )
}