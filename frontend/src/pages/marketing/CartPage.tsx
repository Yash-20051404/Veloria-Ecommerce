import React, { useState, useEffect, useRef, memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore, type CartItem } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useCouponStore } from '@/store/couponStore'
import { useProductStore } from '@/store/productStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Heart, ShoppingBag, User, Minus, Plus, Trash2, 
  ArrowRight, CheckCircle, ShieldCheck, ArrowLeft 
} from 'lucide-react'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

// ──────────────── MOCK DATA ────────────────





// ──────────────── UTILS ────────────────

const parsePrice = (price: string | number) => {
  const num = typeof price === 'number' ? price : Number(String(price || 0).replace(/[^0-9.-]+/g, ''))
  return isNaN(num) ? 0 : num
}
const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

// ──────────────── COMPONENTS ────────────────

const LuxuryNavbar: React.FC = memo(() => {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-16">
        <button onClick={() => navigate('/')} className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</button>
        <div className="flex items-center gap-6 text-white/60">
          <Search className="h-4 w-4 cursor-pointer hover:text-[#D6B57A] transition-colors" />
          <div className="relative cursor-pointer group" onClick={() => navigate('/wishlist')}>
            <Heart className="h-4 w-4 group-hover:text-[#D6B57A] transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] text-black">{wishlistCount}</span>
            )}
          </div>
          <div className="relative cursor-pointer group" onClick={() => navigate('/cart')}>
            <ShoppingBag className="h-4 w-4 group-hover:text-[#D6B57A] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] text-black">{cartCount}</span>
            )}
          </div>
          <button 
            onClick={() => navigate(isAuthenticated && role ? `/${role.toLowerCase()}` : '/login')}
            className="transition-all hover:scale-110 hover:text-[#D6B57A]"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </nav>
  )
})

const LuxuryToast: React.FC<{ show: boolean, message: string }> = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 z-[600] flex -translate-x-1/2 items-center gap-3 rounded-none border border-[#D6B57A]/30 bg-[#0A0A0A]/95 px-6 py-4 backdrop-blur-xl lg:bottom-10"
        >
          <CheckCircle className="h-4 w-4 text-[#D6B57A]" />
          <span className="text-[11px] uppercase tracking-widest text-white" style={inter}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const CartProgress = memo(() => (
  <div className="mb-12 flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] md:text-[10px]" style={inter}>
    <span className="text-[#D6B57A]">● Cart</span>
    <div className="relative h-[1px] flex-1 overflow-hidden bg-white/10">
      <motion.div 
        initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} 
        className="absolute inset-0 bg-[#D6B57A]" 
      />
    </div>
    <span className="text-white/40">○ Address</span>
    <div className="h-[1px] flex-1 bg-white/10" />
    <span className="text-white/40">○ Payment</span>
  </div>
))

const CartHero = memo(() => (
  <div className="mb-12 mt-12 text-center lg:mb-20 lg:mt-16">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      className="text-5xl font-light tracking-wide text-white lg:text-7xl" style={cormorant}
    >
      Shopping Bag
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
      className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/50 lg:text-xs" style={inter}
    >
      Your curated selection of timeless creations.
    </motion.p>
  </div>
))

const CartItemCard = memo(({ 
  item, onUpdateQuantity, onRemove, onSaveForLater, onMoveToBag, isSaved, navigate 
}: { 
  item: CartItem, 
  onUpdateQuantity?: (id: string | number, delta: number) => void, 
  onRemove: (id: string | number) => void,
  onSaveForLater?: (id: string | number) => void,
  onMoveToBag?: (id: string | number) => void,
  isSaved?: boolean,
  navigate: ReturnType<typeof useNavigate>
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-6 border border-white/[0.08] bg-[#080808] p-4 transition-all duration-500 hover:border-[#D6B57A]/40 hover:shadow-[0_0_30px_rgba(214,181,122,0.08)] sm:flex-row sm:items-center sm:p-6"
    >
      <div 
        className="relative aspect-[4/5] w-28 shrink-0 cursor-pointer overflow-hidden bg-black sm:w-36"
        onClick={() => navigate(`/product/${item.id}`)}
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>{item.collection}</p>
        <h3 
          className="mt-2 cursor-pointer text-2xl font-light text-white transition-colors group-hover:text-[#D6B57A]" 
          style={cormorant}
          onClick={() => navigate(`/product/${item.id}`)}
        >
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-white/40" style={inter}>{item.material}</p>
        
        <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#D6B57A]/80" style={inter}>
          Estimated Delivery • 2–3 Business Days
        </p>
        
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
          {/* Quantity Selector */}
          {!isSaved && onUpdateQuantity ? (
            <div className="flex h-10 w-28 items-center justify-between border border-white/20 px-3 text-white transition-colors hover:border-[#D6B57A]/60">
              <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-white/50 transition-colors hover:text-white"><Minus className="h-3 w-3" /></button>
              <span className="text-[11px]" style={inter}>{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-white/50 transition-colors hover:text-white"><Plus className="h-3 w-3" /></button>
            </div>
          ) : (
            <div className="h-10 flex items-center text-[11px] text-white/50" style={inter}>Qty: {item.quantity}</div>
          )}

          {!isSaved && onSaveForLater && (
            <button onClick={() => onSaveForLater(item.id)} className="border-b border-transparent pb-0.5 text-[9px] uppercase tracking-widest text-white/50 transition-colors hover:border-white hover:text-white" style={inter}>Save For Later</button>
          )}
          
          {isSaved && onMoveToBag && (
            <button onClick={() => onMoveToBag(item.id)} className="border-b border-transparent pb-0.5 text-[9px] uppercase tracking-widest text-white/50 transition-colors hover:border-white hover:text-white" style={inter}>Move To Bag</button>
          )}

          <div className="flex-1 text-right sm:flex-none">
            <p className="text-sm tracking-widest text-white/90" style={inter}>{formatPrice(parsePrice(String(item.price)) * item.quantity)}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onRemove(item.id)}
        className="absolute right-4 top-4 text-white/30 transition-colors hover:text-red-400 sm:right-6 sm:top-6"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  )
})

const OrderSummary = memo(({ 
  subtotal, 
  discountType,
  discountValue,
  onApplyCoupon 
}: { 
  subtotal: number, 
  discountType: string,
  discountValue: number,
  onApplyCoupon: (code: string) => void 
}) => {
  const navigate = useNavigate()
  const couponCode = useCouponStore(state => state.couponCode)
  const [couponInput, setCouponInput] = useState(couponCode)
  
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) || 0;
  
  const estimatedArrival = useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() + 2)

    const end = new Date()
    end.setDate(end.getDate() + 3)

    const opts: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    }

    return {
      range: `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`,
      days: '2–3 Business Days'
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
      className="sticky top-32 flex flex-col gap-8"
    >
      <div className="border border-white/10 bg-[#050505] p-8">
        <h2 className="text-2xl text-white" style={cormorant}>Order Summary</h2>
        
        <div className="mt-6 flex gap-3">
          <input 
            type="text" 
            placeholder="Coupon Code" 
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

        <div className="mt-8 space-y-4">
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
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Taxes</span>
            <span className="text-white/40">Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Estimated Arrival</span>
            <div className="text-right">
              <div className="text-white">{estimatedArrival.range}</div>
              <div className="mt-1 text-[9px] uppercase tracking-widest text-[#D6B57A]">
                {estimatedArrival.days}
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        <div className="flex justify-between text-sm uppercase tracking-widest text-white" style={inter}>
          <span>Total</span>
          <span className="text-[#D6B57A]">{formatPrice(finalTotal)}</span>
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-white/40" style={inter}>
          <ShieldCheck className="h-3 w-3" /> Secure Checkout
        </p>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="group relative flex w-full items-center justify-center overflow-hidden bg-white py-4 text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(214,181,122,0.4)]"
          >
            <motion.div 
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors" style={inter}>
              Proceed To Checkout
            </span>
          </button>
          <button 
            onClick={() => navigate('/jewels')}
            className="w-full border border-white/20 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5" style={inter}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4 border-y border-white/10 py-6">
        {['Complimentary Insured Delivery', 'Maison Certified', 'Lifetime Care', 'Personal Concierge'].map((badge, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/60" style={inter}>
            <CheckCircle className="h-3.5 w-3.5 text-[#D6B57A]" />
            {badge}
          </div>
        ))}
      </div>
    </motion.div>
  )
})

const EmptyCartState = memo(() => {
  const navigate = useNavigate()
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="flex min-h-[50vh] flex-col items-center justify-center border border-white/5 bg-[#050505] py-24 text-center"
    >
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/5">
        <ShoppingBag className="h-8 w-8 text-[#D6B57A]" strokeWidth={1} />
      </div>
      <h2 className="text-4xl text-white md:text-5xl" style={cormorant}>Your Selection Awaits</h2>
      <p className="mt-4 max-w-md text-sm text-white/50" style={inter}>
        Discover timeless creations crafted for generations. Your shopping bag is currently empty.
      </p>
      <button 
        onClick={() => navigate('/jewels')}
        className="group mt-10 inline-flex items-center gap-4 border border-white/20 bg-transparent px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black"
      >
        <span style={inter}>Explore Collections</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
      </button>
    </motion.div>
  )
})


const MaisonFooter = memo(() => {
  return (
    <section className="bg-[#050505] py-24 text-center border-t border-white/5">
      <p className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]" style={inter}>Veloria Maison</p>
      <h3 className="mt-6 text-4xl text-white md:text-5xl" style={cormorant}>Crafted For Generations</h3>
      <p className="mx-auto mt-6 max-w-xl text-sm text-white/50" style={inter}>
        Every creation is designed to outlive trends and become part of a legacy.
      </p>
    </section>
  )
})

// ──────────────── MAIN PAGE COMPONENT ────────────────

export function CartPage() {
  const navigate = useNavigate()
  const [isDesktop, setIsDesktop] = useState(true)
  const cursorGlowRef = useRef<HTMLDivElement | null>(null)
  const cursorRingRef = useRef<HTMLDivElement | null>(null)

  // Cart State from Zustand
  const cartItems = useCartStore(state => state.cart)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const increaseQuantity = useCartStore(state => state.increaseQuantity)
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity)
  const addWishlist = useWishlistStore(state => state.addWishlist)
  const wishlistItems = useWishlistStore(state => state.wishlist)
  const removeWishlist = useWishlistStore(state => state.removeWishlist)
  const { discountType, discountValue, applyCoupon } = useCouponStore()
  const [toast, setToast] = useState({ show: false, message: '' })

  // Cursor tracking
  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches)
    window.scrollTo(0, 0)
    
    const moveGlow = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${e.clientX - 70}px, ${e.clientY - 70}px)`
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`
      }
    }
    window.addEventListener('mousemove', moveGlow)
    return () => window.removeEventListener('mousemove', moveGlow)
  }, [])

  // Toast timer
  useEffect(() => {
    if (!toast.show) return
    const timer = setTimeout(() => setToast({ show: false, message: '' }), 3000)
    return () => clearTimeout(timer)
  }, [toast.show])

  // Actions
  const handleUpdateQuantity = (id: string | number, delta: number) => {
    if (delta > 0) {
      const item = cartItems.find(i => i.id === id)
      
      let availableStock = item?.stock;
      if (availableStock === undefined) {
        const productInStore = useProductStore.getState().products.find(p => p.id === id);
        if (productInStore) availableStock = productInStore.stock;
      }

      if (item && availableStock !== undefined && item.quantity >= availableStock) {
        setToast({ show: true, message: `Only ${availableStock} items available in stock` })
        return
      }
      increaseQuantity(id)
    } else {
      decreaseQuantity(id)
    }
  }

  const handleRemove = (id: string | number) => {
    removeFromCart(id)
    setToast({ show: true, message: 'Item removed from bag' })
  }

  const handleSaveForLater = (id: string | number) => {
    const itemToSave = cartItems.find(i => i.id === id)

    if (itemToSave) {
      addWishlist({
          id: itemToSave.id,
          name: itemToSave.name,
          price: itemToSave.price,
          image: itemToSave.image,
          quantity: itemToSave.quantity,
          collection: itemToSave.collection,
          material: itemToSave.material,
          stock: itemToSave.stock
        })

      removeFromCart(id)

      setToast({
        show: true,
        message: 'Moved To Wishlist'
      })
    }
  }

  const handleMoveToBag = (id: string | number) => {
    const itemToMove = wishlistItems.find(i => i.id === id)

    if (itemToMove) {
      const existingCartItem = cartItems.find(i => i.id === id)
      
      let availableStock = existingCartItem?.stock;
      if (availableStock === undefined) {
        const productInStore = useProductStore.getState().products.find(p => p.id === id);
        if (productInStore) availableStock = productInStore.stock;
      }

      if (existingCartItem && availableStock !== undefined && existingCartItem.quantity >= availableStock) {
        setToast({ show: true, message: `Only ${availableStock} items available in stock` })
        return
      }

      removeWishlist(id)

      useCartStore.getState().addToCart({
        ...itemToMove,
        quantity: 1,
        collection: 'Veloria Collection',
        material: 'Maison Crafted',
        stock: itemToMove.stock
      } as CartItem)

      setToast({ show: true, message: 'Moved To Bag' })
    }
  }

  const handleRemoveSaved = (id: string | number) => {
    removeWishlist(id)
    setToast({ show: true, message: 'Removed From Wishlist' })
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (parsePrice(String(item.price)) * item.quantity), 0)
  const handleApplyCoupon = async (code: string) => {
    const res = await applyCoupon(code, subtotal)
    setToast({ show: true, message: res.message })
  }

  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) || 0;

  return (
    <div className={`relative ${isDesktop ? 'cursor-none' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans pb-24 md:pb-0`}>
      
      {/* Custom Cursor Overlay */}
      {isDesktop && (
        <>
          <div
            ref={cursorGlowRef}
            className="pointer-events-none fixed left-0 top-0 z-[9998] h-[140px] w-[140px] rounded-full bg-[#D6B57A]/10 blur-[80px] transition-transform duration-300 ease-out"
          />
          <div
            ref={cursorRingRef}
            className="pointer-events-none fixed left-0 top-0 z-[9999] h-12 w-12 rounded-full border border-[#D6B57A]/50 transition-transform duration-100 ease-out"
          >
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.9)]" />
          </div>
        </>
      )}

      <LuxuryNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-6 lg:px-16 mb-24">
        <button 
          onClick={() => navigate('/jewels')} 
          className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 transition-colors hover:text-white" style={inter}
        >
          <ArrowLeft className="h-3 w-3" /> Continue Exploring
        </button>

        <CartHero />
        
        {cartItems.length > 0 && <CartProgress />}

        {cartItems.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[70fr_30fr]">
            {/* LEFT: Cart Items */}
            <div className="flex flex-col gap-6">
              <div className="hidden border-b border-white/10 pb-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-6">
                <span className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Creation</span>
                <span />
                <span className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Total</span>
              </div>
              <AnimatePresence mode="popLayout">
                {cartItems.map(item => (
                  <CartItemCard 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemove={handleRemove} 
                    onSaveForLater={handleSaveForLater}
                    navigate={navigate}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT: Order Summary */}
            <div>
              <OrderSummary subtotal={subtotal} discountType={discountType} discountValue={discountValue} onApplyCoupon={handleApplyCoupon} />
            </div>
          </div>
        )}

        {/* SAVED ITEMS SECTION */}
        {wishlistItems.map(item => (
          <CartItemCard
            key={`saved-${item.id}`}
            item={{
              ...item,
              quantity: 1,
              collection: item.collection || 'Veloria Collection',
              material: item.material || 'Maison Crafted',
              stock: item.stock
            }}
            isSaved
            onMoveToBag={handleMoveToBag}
            onRemove={handleRemoveSaved}
            navigate={navigate}
          />
        ))}
      </main>

      {/* <RecommendedProducts /> */}
      <MaisonFooter />
      
      <LuxuryToast show={toast.show} message={toast.message} />

      {/* MOBILE STICKY CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-[#050505]/90 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60" style={inter}>Total</span>
            <span className="text-lg text-[#D6B57A]" style={inter}>{formatPrice(finalTotal)}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-white py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-black transition-transform active:scale-[0.98]" style={inter}
          >
            Proceed To Checkout
          </button>
        </div>
      )}
    </div>
  )
}