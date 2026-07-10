import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useInView, animate } from 'framer-motion'
import { 
  Heart, Search, SlidersHorizontal, ChevronDown, ArrowRight, 
  ShoppingBag, User, X
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useProductStore, type Product } from '@/store/productStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

const CATEGORIES = ['ALL', 'RINGS', 'BRACELETS', 'NECKLACES', 'EARRINGS']
const MATERIALS = ['All', '18K White Gold', '18K Rose Gold', '18K Yellow Gold', 'Platinum']
const PRICE_RANGES = ['All', 'Under $10,000', '$10,000 - $20,000', 'Over $20,000']
const STONE_TYPES = ['All', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'Onyx']
const OCCASIONS = ['All', 'Wedding', 'Engagement', 'Daily Wear', 'Luxury Event']

// ──────────────── MOCK DATA ────────────────


const EDITORIAL_CATEGORIES = [
  { title: 'Eternity Rings', description: 'Crafted to become part of your story. Sculpted with precision and adorned with the rarest stones.', image: '/ring-luxury.jpg', link: 'Explore Rings' },
  { title: 'Radiance Bracelets', description: 'Designed to move with elegance. Fluid forms that capture light from every angle.', image: '/bracelet-luxury.jpg', link: 'Explore Bracelets' },
  { title: 'Aurora Necklaces', description: 'Light sculpted into form. A delicate balance of architectural grace and timeless brilliance.', image: '/neck-showcase.jpeg', link: 'Explore Necklaces' },
  { title: 'Celestial Earrings', description: 'Designed to frame beauty. Illuminating your profile with celestial grace and modern allure.', image: '/earing-showcase.jpeg', link: 'Explore Earrings' },
]

// ──────────────── TYPES ────────────────


// ──────────────── NAVBAR ────────────────

function LuxuryNavbar() {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="fixed top-0 left-0 z-[100] w-full border-b border-white/[0.04] bg-[#030303]/70 backdrop-blur-xl transition-all">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <div className="hidden flex-1 items-center justify-start gap-8 md:flex">
          <a href="/" className="text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-[#D6B57A]" style={inter}>Home</a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <a href="/" className="text-2xl font-light tracking-[0.35em] text-white transition-colors hover:text-[#D6B57A] md:text-3xl" style={cormorant}>
            VELORIA
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end gap-5 text-white/60">
          <button className="transition-all hover:scale-110 hover:text-[#D6B57A]">
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <button 
            className="relative transition-all hover:scale-110 hover:text-[#D6B57A]"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">
                {wishlistCount}
              </span>
            )}
          </button>

        <button 
          className="relative transition-all hover:scale-110 hover:text-[#D6B57A]" 
          onClick={() => navigate('/cart')}
        >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">
              {cartCount}
            </span>
          )}
          </button>

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
}

// ──────────────── SECTION 1: HERO ────────────────

function CollectionHero({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) {
  return (
    <section className="relative flex min-h-[55vh] w-full flex-col items-center justify-center overflow-hidden bg-[#030303] pt-24 md:min-h-[60vh] md:pt-32">
      {/* Luxury Glow & Particles */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
      
      {/* Floating Dust */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#D6B57A]/40 blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-[10px] uppercase tracking-[0.6em] text-[#D6B57A] md:text-xs"
          style={inter}
        >
          Veloria Collections
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-5xl font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          style={cormorant}
        >
          Curated masterpieces <br className="hidden md:block" /> crafted for generations.
        </motion.h1>
      </div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-16 flex w-full max-w-3xl flex-wrap items-center justify-center gap-6 px-6 md:mt-24 md:gap-12"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="group relative pb-2 text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white md:text-[11px]"
            style={inter}
          >
            <span className={activeTab === cat ? 'text-white' : ''}>{cat}</span>
            {activeTab === cat && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 h-[1px] w-full bg-[#D6B57A]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </section>
  )
}

// ──────────────── SECTION 2: FEATURED COLLECTION BANNER ────────────────

function FeaturedCollectionBanner({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative isolate h-[70vh] min-h-[600px] w-full overflow-hidden bg-[#030303] md:h-[80vh]">
      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <img
          src="/img-show.jpeg"
          alt="The Eternity Collection"
          className="h-full w-full object-cover object-[center_30%] brightness-[0.97] contrast-[1.0]"
        />
        {/* Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-90" />
      </motion.div>

      <div className="relative z-10 flex h-full w-full max-w-[1600px] mx-auto items-center px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]" style={inter}>
            New Arrivals
          </p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] text-white sm:text-6xl md:text-[5rem]" style={cormorant}>
            The Eternity <br /> Collection
          </h2>
          <p className="mt-8 text-sm leading-[1.8] text-white/60 md:text-base" style={inter}>
            For those who wear legacy. Discover pieces designed to transcend time, sculpted with rare diamonds and master precision.
          </p>          
        </motion.div>
      </div>
    </section>
  )
}

// ──────────────── DROPDOWN COMPONENT ────────────────

function LuxuryDropdown({ label, options, active, onChange }: { label: string, options: string[], active: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 transition-colors ${active !== 'All' ? 'text-white' : 'hover:text-white'}`}
      >
        <span>{active !== 'All' ? active : label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-4 w-48 border border-white/10 bg-[#0A0A0A] py-2 shadow-2xl z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`block w-full px-4 py-2 text-left text-[10px] uppercase tracking-[0.1em] transition-colors ${active === opt ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ──────────────── SECTION 3: LUXURY FILTER EXPERIENCE ────────────────

function FilterBar({ 
  searchQuery, 
  setSearchQuery,
  activeMaterial,
  setActiveMaterial,
  activePrice,
  setActivePrice,
  activeStone,
  setActiveStone,
  activeOccasion,
  setActiveOccasion
}: { 
  searchQuery: string; 
  setSearchQuery: (s: string) => void;
  activeMaterial: string;
  setActiveMaterial: (s: string) => void;
  activePrice: string;
  setActivePrice: (s: string) => void;
  activeStone: string;
  setActiveStone: (s: string) => void;
  activeOccasion: string;
  setActiveOccasion: (s: string) => void;
    }) {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <div className="sticky top-[72px] md:top-[76px] z-40 w-full border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#030303]/60">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/60 md:gap-10 md:text-[11px]" style={inter}>
          <button className="flex items-center gap-2 transition-colors hover:text-white">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
          <div className="hidden h-3 w-px bg-white/20 md:block" />
          <div className="hidden gap-8 md:flex">
            <LuxuryDropdown label="Material" options={MATERIALS} active={activeMaterial} onChange={setActiveMaterial} />
            <LuxuryDropdown label="Stone" options={STONE_TYPES} active={activeStone} onChange={setActiveStone} />
            <LuxuryDropdown label="Occasion" options={OCCASIONS} active={activeOccasion} onChange={setActiveOccasion} />
            <LuxuryDropdown label="Price Range" options={PRICE_RANGES} active={activePrice} onChange={setActivePrice} />
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/60 md:text-[11px]" style={inter}>
          {isSearching ? (
            <motion.div 
              initial={{ opacity: 0, width: 0 }} 
              animate={{ opacity: 1, width: 'auto' }} 
              className="flex items-center border-b border-white/30 pb-1"
            >
              <Search className="h-3.5 w-3.5 mr-2 text-white" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search Jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none placeholder:text-white/30 w-32 md:w-48 text-[10px] uppercase tracking-[0.1em]"
              />
              <button onClick={() => {setIsSearching(false); setSearchQuery('')}}>
                <X className="h-3.5 w-3.5 ml-2 hover:text-white transition-colors" />
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={() => setIsSearching(true)}
              className="flex items-center gap-2 border-l border-white/10 pl-6 transition-colors hover:text-white"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:block">Search</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ──────────────── SECTION 4: PRODUCT GRID & CARD ────────────────

function ProductCard({ 
  product, 
  index,
}: { 
  product: Product; 
  index: number;
}) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist)
  const isWishlisted = useWishlistStore(state => state.isWishlisted(product.id ?? ""))
  const addToCart = useCartStore(state => state.addToCart)

  return (
    <motion.article
      onClick={() => navigate(`/product/${product.id}`)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex cursor-pointer flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0A0A]">
        {/* Subtle cinematic shadow / glow behind image */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        
        {imgError ? (
          <div className="relative z-10 flex h-full w-full items-center justify-center bg-[#050505]">
            <span className="text-4xl text-[#D6B57A]/20" style={cormorant}>V</span>
          </div>
        ) : (
          <motion.img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="relative z-10 h-full w-full object-cover transition-all duration-[1.2s] ease-[0.22,1,0.36,1] group-hover:scale-110 group-hover:brightness-110"
          />
        )}
        
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}    
                className="
                    absolute bottom-5 left-1/2 z-30
                    -translate-x-1/2
                    translate-y-4
                    border border-white/20
                    bg-black/70
                    backdrop-blur-md
                    px-6 py-3
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-white
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    "
                onClick={(e) => {
                    e.stopPropagation()
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity: 1,
                      stock: product.stock
                    })
                }}
                >
                Add To Cart
        </motion.button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({...product , id: product.id! ,  image: product.image ?? "",});
          }}
          className={`absolute right-4 top-4 z-30 transition-all duration-500 hover:scale-110 ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-[#D6B57A] text-[#D6B57A]' : 'text-white hover:fill-white'}`} 
            strokeWidth={1.5} 
          />
        </button>
      </div>

      <div className="mt-5 flex flex-col items-center text-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>
          {(product as any).collection || 'Veloria Collection'}
        </p>
        <h3 className="mt-2 text-xl font-light tracking-wide text-white md:text-2xl" style={cormorant}>
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs text-white/40" style={inter}>
          {product.metal ? `${product.purity || ''} ${product.metal}`.trim() : product.category || 'Maison Crafted'}
        </p>
        <p className="mt-3 text-xs tracking-widest text-white/70" style={inter}>
          {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
        </p>
      </div>
    </motion.article>
  )
}

function ProductGrid({ 
  products,
}: { 
  products: Product[];
}) {
  return (
    <section id="product-grid" className="relative w-full bg-[#030303] px-6 py-20 md:px-12 md:py-32 lg:px-16 min-h-[50vh]">
      {products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-white/40">
          <Search className="h-8 w-8 mb-4 opacity-50" />
          <p className="text-sm tracking-widest uppercase" style={inter}>No masterpieces found.</p>
        </div>
      ) : (
        <>
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-24">
            {products.map((product, idx) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={idx} 
              />
            ))}
          </div>
          
          <div className="mt-24 flex justify-center">
            <button className="group relative overflow-hidden border border-white/20 px-10 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black">
              <span className="relative z-10" style={inter}>Load More</span>
            </button>
          </div>
        </>
      )}
    </section>
  )
}

// ──────────────── SECTION 5: COLLECTION STATS (NEW) ────────────────

function AnimatedCounter({ value, suffix, label }: { value: number, suffix: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  
  useEffect(() => {
    if (inView && ref.current) {
      animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) ref.current.textContent = Math.round(v).toString()
        }
      })
    }
  }, [inView, value])

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center text-4xl sm:text-5xl md:text-6xl text-white font-light tracking-wide" style={cormorant}>
        <span ref={ref}>0</span>{suffix}
      </div>
      <p className="mt-3 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]/80" style={inter}>
        {label}
      </p>
    </div>
  )
}

function CollectionStats() {
  return (
    <section className="relative w-full bg-[#030303] py-20 border-y border-white/[0.04] overflow-hidden">
      {/* Subtle Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} 
      />
      
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-12 px-6 md:grid-cols-4 md:gap-8 lg:px-12">
        <AnimatedCounter value={120} suffix="+" label="Masterpieces" />
        <AnimatedCounter value={18} suffix="K" label="Gold Standard" />
        <AnimatedCounter value={50} suffix="+" label="Rare Stones" />
        <AnimatedCounter value={100} suffix="%" label="Hand Finished" />
      </div>
    </section>
  )
}

// ──────────────── SECTION 6: EDITORIAL CATEGORY SHOWCASE ────────────────

function EditorialCategoryShowcase({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
  
  const mapLinkToCategory = (linkText: string) => {
    if (linkText.includes('Rings')) return 'RINGS'
    if (linkText.includes('Bracelets')) return 'BRACELETS'
    if (linkText.includes('Necklaces')) return 'NECKLACES'
    if (linkText.includes('Earrings')) return 'EARRINGS'
    return 'ALL'
  }

  return (
    <section className="relative w-full bg-[#030303] py-24 md:py-40">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-32 px-6 md:gap-48 md:px-12 lg:px-16">
        {EDITORIAL_CATEGORIES.map((category, index) => {
          const isEven = index % 2 === 0

          return (
            <div
              key={category.title}
              className={`flex flex-col items-center gap-10 md:gap-20 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Image Block */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full overflow-hidden md:w-1/2"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A] lg:aspect-[4/5]">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                </div>
              </motion.div>

              {/* Text Block */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full flex-col justify-center text-center md:w-1/2 md:text-left"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D6B57A]" style={inter}>
                  Editorial Spotlight
                </p>
                <h3 className="mt-6 text-4xl font-light leading-[1.1] tracking-wide text-white sm:text-5xl lg:text-[4rem]" style={cormorant}>
                  {category.title}
                </h3>
                <div className={`mt-8 h-px w-12 bg-white/20 ${isEven ? 'md:mx-0' : 'mx-auto md:mx-0'}`} />
                <p className="mt-8 max-w-md text-sm leading-[1.9] text-white/50 md:text-base" style={inter}>
                  {category.description}
                </p>
                <div className="mt-10">
                  <button 
                    onClick={() => {
                      onCategorySelect(mapLinkToCategory(category.link))

                      document
                        .getElementById('product-grid')
                        ?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                    }}
                    className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:text-[#D6B57A]" style={inter}
                  >
                    <span className="border-b border-transparent transition-colors group-hover:border-[#D6B57A] pb-1">
                      {category.link}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ──────────────── SECTION 7: MOST DESIRED PIECES ────────────────

function TrendingPieces() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { products } = useProductStore()

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.03)_0%,transparent_70%)]" />

      <div className="relative z-10 px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-center text-center md:mb-20 md:flex-row md:justify-between md:text-left"
        >
          <div>
            <h3 className="text-3xl font-light text-white md:text-5xl" style={cormorant}>Most Desired Pieces</h3>
            <p className="mt-4 text-xs text-white/50 md:text-sm flex items-center gap-2" style={inter}>
              The icons of our maison, coveted globally. <span className="hidden md:inline-block px-2 py-0.5 border border-white/10 rounded-full text-[9px] bg-white/5">Drag to explore</span>
            </p>
          </div>
          <div className="mt-6 hidden md:mt-0 md:block">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white" style={inter}>
              View All Icons &rarr;
            </button>
          </div>
        </motion.div>

        {/* Horizontal Scroll / Drag Area */}
        <div className="relative -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16">
          <div 
            ref={containerRef}
            className="flex w-full overflow-x-auto pb-10 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <div className="flex gap-6 md:gap-10">
              {products.slice(0, 5).map((product, idx) => (
                <motion.div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group relative w-[280px] shrink-0 cursor-pointer md:w-[360px]"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover opacity-80 transition-all duration-[1s] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="mt-5 text-center">
                    <h4 className="text-xl font-light text-white transition-colors group-hover:text-[#D6B57A]" style={cormorant}>{product.name}</h4>
                    <p className="mt-2 text-xs tracking-widest text-white/50" style={inter}>{typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────── SECTION 8: MAISON PHILOSOPHY ────────────────

function MaisonPhilosophy() {
  return (
    <section className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden bg-[#030303] px-6 py-32">
      {/* Cinematic Grain & Lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,181,122,0.05)_0%,transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]/80 md:text-xs" style={inter}>
          Crafted For Generations
        </p>
        <h2 className="mt-10 text-3xl font-light leading-[1.3] text-white sm:text-4xl md:text-5xl lg:text-[3.5rem]" style={cormorant}>
          <span className="text-white/40 italic">"</span>
          Every Veloria creation begins with rare materials, master craftsmanship, and timeless intention.
          <span className="text-white/40 italic">"</span>
        </h2>
        <div className="mx-auto mt-12 h-px w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    </section>
  )
}

// ──────────────── SECTION 9: PRIVATE CLIENT EXPERIENCE ────────────────

function LuxuryNewsletter() {
  return (
    <section className="relative w-full border-t border-white/[0.04] bg-[#030303] px-6 py-32 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-16 md:flex-row md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full text-center md:w-1/2 md:text-left"
        >
          <h3 className="text-4xl font-light text-white md:text-5xl" style={cormorant}>
            Become A Veloria Insider
          </h3>
          <p className="mt-6 max-w-sm text-sm leading-[1.8] text-white/50 mx-auto md:mx-0" style={inter}>
            Join our private client list to receive early access to high-jewellery releases, private collections, and exclusive maison events.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md md:w-1/2"
        >
          <form className="relative flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full border-b border-white/20 bg-transparent pb-4 pl-0 pr-12 text-sm text-white placeholder-white/30 transition-colors focus:border-[#D6B57A] focus:outline-none"
                style={inter}
              />
              <button
                type="submit"
                className="absolute bottom-4 right-0 text-white/50 transition-colors hover:text-[#D6B57A]"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/30" style={inter}>
              By subscribing, you agree to our Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

// ──────────────── MAIN PAGE COMPONENT ────────────────

export function CollectionPage() {
  const cursorGlowRef = useRef<HTMLDivElement | null>(null)
  const cursorRingRef = useRef<HTMLDivElement | null>(null)
  const [isDesktop, setIsDesktop] = useState(true)
  const [searchParams] = useSearchParams()

  // State Management
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMaterial, setActiveMaterial] = useState('All')
  const [activePrice, setActivePrice] = useState('All')
  const [activeStone, setActiveStone] = useState('All')
  const [activeOccasion, setActiveOccasion] = useState('All')

  const { products, fetchProducts, semanticSearch, clearSearch, searchResults, isSearching } = useProductStore()
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Debounced semantic search: fires 400ms after user stops typing
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    
    if (searchQuery.trim().length > 0) {
      debounceRef.current = setTimeout(() => {
        semanticSearch(searchQuery, {
          category: activeTab !== 'ALL' ? activeTab : undefined,
          metal: activeMaterial !== 'All' ? activeMaterial : undefined,
          gemstone: activeStone !== 'All' ? activeStone : undefined,
          occasion: activeOccasion !== 'All' ? activeOccasion : undefined,
        })
      }, 400)
    } else {
      clearSearch()
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, activeTab, activeMaterial, activeStone, activeOccasion])

  useEffect(() => {
  const category = searchParams.get('category')

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto',
  })

  if (!category) return

  const categoryMap: Record<string, string> = {
    rings: 'RINGS',
    bracelets: 'BRACELETS',
    necklaces: 'NECKLACES',
    earrings: 'EARRINGS',
  }

  const mappedCategory = categoryMap[category.toLowerCase()]

  if (mappedCategory) {
    setActiveTab(mappedCategory)
  }
}, [searchParams])

  // Filter Logic
  const parsePrice = (priceStr: string | number) => typeof priceStr === 'number' ? priceStr : parseInt(String(priceStr).replace(/\$|,/g, ''))

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category
      if (activeTab !== 'ALL' && (product.category || '').toUpperCase() !== activeTab) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(q) && 
            !(product.description || '').toLowerCase().includes(q) && 
            !(product.category || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      // Material
      const materialString = product.metal ? `${product.purity || ''} ${product.metal}`.trim() : ((product as any).material || '');
      if (
        activeMaterial !== 'All' &&
        !materialString.toLowerCase().includes(activeMaterial.toLowerCase())
      ) {
        return false;
      }   
      
      // Stone Type
      const stoneString = product.gemstone || ((product as any).stone?.origin || '');
      if (
        activeStone !== 'All' &&
        !stoneString.toLowerCase().includes(activeStone.toLowerCase())
      ) {
        return false;
      }

      // Occasion
      const occasionString = product.occasion || '';
      if (activeOccasion !== 'All' && activeOccasion !== 'Engagement' && !occasionString.toLowerCase().includes(activeOccasion.toLowerCase())) {
        return false;
      } else if (activeOccasion === 'Engagement' && !product.name.toLowerCase().includes('ring') && !occasionString.toLowerCase().includes('engagement')) {
        return false;
      }
    
      // Price
      if (activePrice !== 'All') {
        const price = parsePrice(product.price);
        if (activePrice === 'Under $10,000' && price >= 10000) return false;
        if (activePrice === '$10,000 - $20,000' && (price < 10000 || price > 20000)) return false;
        if (activePrice === 'Over $20,000' && price <= 20000) return false;
      }
      return true;
    })
}, [products, activeTab, searchQuery, activeMaterial, activeStone, activeOccasion, activePrice])

  React.useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches)

    const moveGlow = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${e.clientX - 70}px, ${e.clientY - 70}px)`
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`
      }
    }

    window.addEventListener('mousemove', moveGlow)
    return () => {
      window.removeEventListener('mousemove', moveGlow)
    }
  }, [])

  const handleScrollToGrid = (category?: string) => {
    if (category) setActiveTab(category);
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`relative ${isDesktop ? 'cursor-none' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen`}>
      <LuxuryNavbar />
      
      {/* Custom Cursor */}
      {isDesktop && (
        <>
        <div
          ref={cursorGlowRef}
          className="pointer-events-none fixed left-0 top-0 z-[100] h-[140px] w-[140px] rounded-full bg-[#D6B57A]/10 blur-[90px] transition-transform duration-500 ease-out"
        />
        <div
          ref={cursorRingRef}
          className="pointer-events-none fixed left-0 top-0 z-[999] h-12 w-12 rounded-full border border-[#D6B57A]/50 transition-transform duration-100 ease-out"
        >
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.9)]" />
        </div>
      </>
      )}

      <CollectionHero activeTab={activeTab} setActiveTab={setActiveTab} />
      <FeaturedCollectionBanner onExplore={() => handleScrollToGrid('ALL')} />
      <FilterBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        activeMaterial={activeMaterial} setActiveMaterial={setActiveMaterial}
        activePrice={activePrice} setActivePrice={setActivePrice}
        activeStone={activeStone}
        setActiveStone={setActiveStone}
        activeOccasion={activeOccasion}
        setActiveOccasion={setActiveOccasion}
        
      />
      {/* Show semantic search results when query is active, otherwise show client-filtered products */}
      <ProductGrid 
        products={searchQuery.trim().length > 0 ? searchResults : filteredProducts}
      />
      
      {/* Show search status indicator */}
      {searchQuery.trim().length > 0 && (
        <div className="flex justify-center pb-4 -mt-8">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
            {isSearching ? (
              <span className="animate-pulse">⟳ Searching with AI...</span>
            ) : searchResults.length > 0 ? (
              <span>✓ Found {searchResults.length} results — Hybrid AI Search</span>
            ) : (
              <span>No results found</span>
            )}
          </div>
        </div>
      )}
      <CollectionStats />
      <EditorialCategoryShowcase onCategorySelect={(cat) => handleScrollToGrid(cat)} />
      <TrendingPieces />
      <MaisonPhilosophy />
      <LuxuryNewsletter />
    </div>
  )
}
