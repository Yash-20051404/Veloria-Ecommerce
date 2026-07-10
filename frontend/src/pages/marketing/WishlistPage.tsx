import React, { useState, useEffect, useRef, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Heart, ShoppingBag, User, Trash2, 
  ArrowRight, ArrowLeft 
} from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

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

const WishlistHero = memo(() => (
  <div className="mb-12 mt-12 text-center lg:mb-20 lg:mt-16">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      className="text-5xl font-light tracking-wide text-white lg:text-7xl" style={cormorant}
    >
      Your Wishlist
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
      className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/50 lg:text-xs" style={inter}
    >
      A curated collection of your most desired creations.
    </motion.p>
  </div>
))

const EmptyWishlistState = memo(() => {
  const navigate = useNavigate()
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="flex min-h-[50vh] flex-col items-center justify-center border border-white/5 bg-[#050505] py-24 text-center"
    >
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#D6B57A]/20 bg-[#D6B57A]/5">
        <Heart className="h-8 w-8 text-[#D6B57A]" strokeWidth={1} />
      </div>
      <h2 className="text-4xl text-white md:text-5xl" style={cormorant}>Your Wishlist is Empty</h2>
      <p className="mt-4 max-w-md text-sm text-white/50" style={inter}>
        Discover timeless creations crafted for generations. Start building your legacy collection.
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

export function WishlistPage() {
  const navigate = useNavigate()
  const [isDesktop, setIsDesktop] = useState(true)
  const cursorGlowRef = useRef<HTMLDivElement | null>(null)
  const cursorRingRef = useRef<HTMLDivElement | null>(null)
  
  const wishlistItems = useWishlistStore(state => state.items)
  const removeWishlist = useWishlistStore(state => state.removeWishlist)
  const addToCart = useCartStore(state => state.addToCart)

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

  const handleMoveToBag = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: item.stock
    })
    removeWishlist(item.id)
  }

  return (
    <div className={`relative ${isDesktop ? 'cursor-none' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans pb-24 md:pb-0`}>
      
      {/* Custom Cursor Overlay */}
      {isDesktop && (
        <>
          <div ref={cursorGlowRef} className="pointer-events-none fixed left-0 top-0 z-[9998] h-[140px] w-[140px] rounded-full bg-[#D6B57A]/10 blur-[80px] transition-transform duration-300 ease-out" />
          <div ref={cursorRingRef} className="pointer-events-none fixed left-0 top-0 z-[9999] h-12 w-12 rounded-full border border-[#D6B57A]/50 transition-transform duration-100 ease-out">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.9)]" />
          </div>
        </>
      )}

      <LuxuryNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-6 lg:px-16 mb-24 min-h-[55vh]">
        <button 
          onClick={() => navigate('/jewels')} 
          className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 transition-colors hover:text-white" style={inter}
        >
          <ArrowLeft className="h-3 w-3" /> Continue Exploring
        </button>

        <WishlistHero />

        {wishlistItems.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item, idx) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  key={item.id}
                  className="group flex flex-col cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0A0A]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-all duration-[1s] group-hover:scale-110 group-hover:brightness-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeWishlist(item.id); }}
                      className="absolute right-4 top-4 z-30 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-5 text-center flex flex-col items-center">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>{item.collection || 'Collection'}</p>
                    <h4 className="mt-2 text-xl font-light text-white transition-colors group-hover:text-[#D6B57A]" style={cormorant}>{item.name}</h4>
                    <p className="mt-2 text-xs tracking-widest text-white/50" style={inter}>{item.price}</p>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveToBag(item); }}
                      className="mt-6 border-b border-[#D6B57A]/50 pb-1 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:border-[#D6B57A] hover:text-white"
                      style={inter}
                    >
                      Move to Bag
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <MaisonFooter />
    </div>
  )
}