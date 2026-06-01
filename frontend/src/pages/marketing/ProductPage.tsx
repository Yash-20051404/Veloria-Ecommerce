import React, { useState, useRef, useEffect, useMemo, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag, Sparkles, ArrowRight,
  Search, User, Star, CheckCircle, Share2, X
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

// ──────────────── MOCK DATA EXTENDED ────────────────

const MOCK_PRODUCTS = [
  { 
    id: 1, name: 'Lumière Solitaire', collection: 'Eternity', material: '18K White Gold, Diamond', price: '$14,500', image: '/ring.jpeg', category: 'RINGS',
    rarity: 94, story: 'Created for those who understand that true luxury is inherited, not purchased. The Lumière Solitaire captures the essence of eternal light.',
    stone: { origin: 'Botswana', cut: 'Brilliant Round', clarity: 'VVS1', color: 'D - Colorless' }
  },
  { 
    id: 2, name: 'Aura Cuff', collection: 'Radiance', material: '18K Rose Gold, Sapphires', price: '$22,000', image: '/bracelet.jpg', category: 'BRACELETS',
    rarity: 88, story: 'Designed to move with elegance. Fluid forms that capture light from every angle, creating a halo of warmth around the wrist.',
    stone: { origin: 'Madagascar', cut: 'Oval Mixed', clarity: 'VS1', color: 'Royal Blue' }
  },
  { 
    id: 3, name: 'Eclipse Pendant', collection: 'Aurora', material: 'Platinum, Emerald', price: '$18,200', image: '/necklace.jpg', category: 'NECKLACES',
    rarity: 96, story: 'Light sculpted into form. A delicate balance of architectural grace and the profound depth of a flawless emerald.',
    stone: { origin: 'Colombia', cut: 'Emerald Step', clarity: 'VVS2', color: 'Vivid Green' }
  },
  { 
    id: 4, name: 'Celeste Drops', collection: 'Celestial', material: '18K Yellow Gold, Diamonds', price: '$9,800', image: '/earrings.jpg', category: 'EARRINGS',
    rarity: 85, story: 'Designed to frame beauty. Illuminating your profile with celestial grace and modern allure.',
    stone: { origin: 'Canada', cut: 'Pear Brilliant', clarity: 'VS2', color: 'E - Colorless' }
  },
]

type Product = typeof MOCK_PRODUCTS[0]

// ──────────────── INTERFACES ────────────────

interface ProductGalleryProps {
  product: Product
  selectedImage: number
  setSelectedImage: React.Dispatch<React.SetStateAction<number>>
}

interface DeliveryCheckerProps {
  deliveryResult: string
  setDeliveryResult: (val: string) => void
}

interface ProductActionsProps {
  product: Product
  quantity: number
  setQuantity: (val: number) => void
  setCartOpen: (val: boolean) => void
  setToast: (val: boolean) => void
}

interface ProductAccordionsProps {
  product: Product
}

interface ProductInfoProps {
  product: Product
  deliveryResult: string
  setDeliveryResult: (val: string) => void
  quantity: number
  setQuantity: (val: number) => void
  setCartOpen: (val: boolean) => void
  setToast: (val: boolean) => void
}

interface CartDrawerProps {
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
  product: Product
  quantity: number
}

interface ToastProps {
  show: boolean
  message: string
}
const LuxuryToast: React.FC<ToastProps> = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed right-6 top-24 z-[600] flex items-center gap-3 rounded-xl border border-[#D6B57A]/30 bg-[#0A0A0A]/95 px-5 py-4 backdrop-blur-xl"
        >
          <CheckCircle className="h-4 w-4 text-[#D6B57A]" />
          <span className="text-sm text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ──────────────── LUXURY NAVBAR ────────────────

const LuxuryNavbar: React.FC = memo(() => {
  const navigate = useNavigate()
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-16">
        <div className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</div>
        {/* Middle links block removed */}
        <div className="flex items-center gap-6 text-white/60">
          <Search className="h-4 w-4 hover:text-[#D6B57A]" />
          <div className="relative cursor-pointer group" onClick={() => navigate('/wishlist')}>
            <Heart className="h-4 w-4 group-hover:text-[#D6B57A] transition-colors" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] text-black">{wishlistCount}</span>
          </div>
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <ShoppingBag className="h-4 w-4 hover:text-[#D6B57A]" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] text-black">{cartCount}</span>
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

// ──────────────── PRODUCT GALLERY ────────────────

const ProductGallery: React.FC<ProductGalleryProps> = memo(({ product, selectedImage, setSelectedImage }) => {
  const navigate = useNavigate()
  const [autoSlide, setAutoSlide] = useState(true)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })

  const productImages = useMemo(() => [
    product.image,
    '/ring.jpeg',
    '/bracelet.jpg',
    '/necklace.jpg',
  ], [product.image])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setSpotlight({ x, y })

    // Map gallery coordinates to the 78% image area
    const imageX = ((x - 11) / 78) * 100
    const imageY = ((y - 11) / 78) * 100
    setZoomOrigin({ 
      x: Math.max(0, Math.min(100, imageX)), 
      y: Math.max(0, Math.min(100, imageY)) 
    })
  }

  const paginate = React.useCallback((newDirection: number) => {
    setSelectedImage((prev) => (prev + newDirection + productImages.length) % productImages.length)
  }, [productImages.length, setSelectedImage])

  useEffect(() => {
  if (!autoSlide || isHovering) return
  const timer = setInterval(() => {
    paginate(1)
  }, 5000)
  return () => clearInterval(timer)
  }, [autoSlide, isHovering, paginate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate])

  return (
    <div
      ref={imageRef}
      className="relative h-[70vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-[#050505] select-none group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Spotlight Glow */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500"
        animate={{ opacity: isHovering ? 1 : 0 }}
        style={{
          background: `radial-gradient(circle 300px at ${spotlight.x}% ${spotlight.y}%, rgba(214,181,122,0.08), transparent 80%)`
        }}
      />
      
      {/* Floating Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#D6B57A]/30 blur-[1px]"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={selectedImage}
            variants={{
              enter: { opacity: 0, scale: 0.96 },
              center: { zIndex: 1, opacity: 1, scale: 1 },
              exit: { zIndex: 0, opacity: 0, scale: 0.96 }
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) paginate(1);
              else if (swipe > 10000) paginate(-1);
            }}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              draggable={false}
              className="h-[78%] w-[78%] object-contain transition-transform duration-[350ms] ease-out"
              style={{
                filter: 'brightness(1.04)',
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                transform: isHovering ? 'scale(1.7)' : 'scale(1)'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-black/30 lg:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#030303] hidden lg:block opacity-80" />

      <button onClick={() => navigate(-1)} className="absolute left-6 top-8 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors lg:left-12 lg:top-12 text-[10px] uppercase tracking-widest" style={inter}>
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <button
        className="absolute left-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/50 opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[#D6B57A] hover:text-[#D6B57A] group-hover:opacity-100 lg:left-10"
        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        className="absolute right-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/50 opacity-0 backdrop-blur-md transition-all duration-300 hover:border-[#D6B57A] hover:text-[#D6B57A] group-hover:opacity-100 lg:right-10"
        onClick={(e) => { e.stopPropagation(); paginate(1); }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        {productImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
            className={`rounded-full transition-all duration-500 ${
              selectedImage === index
                ? 'h-[16px] w-[16px] bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.5)]'
                : 'h-[10px] w-[10px] bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
})

// ──────────────── DELIVERY CHECKER ────────────────

const DeliveryChecker: React.FC<DeliveryCheckerProps> = memo(({ deliveryResult, setDeliveryResult }) => {
  return (
    <div className="mt-8">
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/50" style={inter}>
        Delivery Availability
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Pincode"
          className="h-12 flex-1 border border-white/20 bg-transparent px-4 text-sm text-white outline-none focus:border-[#D6B57A]"
        />
        <button
          onClick={() => setDeliveryResult('✓ Available • Delivery in 2 Days')}
          className="border border-[#D6B57A]/40 px-6 text-[10px] uppercase tracking-[0.2em] text-[#D6B57A] hover:bg-[#D6B57A]/10"
        >
          Check
        </button>
      </div>
      {deliveryResult && (
        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>{deliveryResult}</span>
        </div>
      )}
    </div>
  )
})

// ──────────────── PRODUCT ACTIONS ────────────────

const ProductActions: React.FC<ProductActionsProps> = memo(({ product, quantity, setQuantity, setCartOpen, setToast }) => {
  const addToCart = useCartStore(state => state.addToCart)
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist)
  const isWishlisted = useWishlistStore(state => state.isWishlisted(product.id))
  return (
    <>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-32 items-center justify-between border border-white/20 px-4 text-white">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/50 hover:text-white"><Minus className="h-3 w-3" /></button>
          <span className="text-xs" style={inter}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="text-white/50 hover:text-white"><Plus className="h-3 w-3" /></button>
        </div>
        
        <button
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity
            })
            setCartOpen(true)
            setToast(true)
          }}
          className="group relative flex h-14 flex-1 items-center justify-center overflow-hidden bg-white text-black transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(214,181,122,0.35)]"
        >
          <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 transition-colors group-hover:text-black" style={inter}>
            Add To Cart
            <ShoppingBag className="h-3.5 w-3.5" />
          </span>
        </button>

        <button
          onClick={() => {
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image
            })
          }}
          className={`flex h-14 w-14 items-center justify-center border transition-colors ${
            isWishlisted
              ? 'border-[#D6B57A] text-[#D6B57A]'
              : 'border-white/20 text-white hover:border-[#D6B57A] hover:text-[#D6B57A]'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'fill-[#D6B57A]' : ''}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <button className="mt-4 w-full border border-white/20 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5" style={inter}>
        Book Private Consultation
      </button>
    </>
  )
})

// ──────────────── PRODUCT ACCORDIONS ────────────────

const ProductAccordions: React.FC<ProductAccordionsProps> = memo(({ product }) => {
  return (
    <div className="mt-12 border-t border-white/10 pt-10 space-y-4">
      <details className="border border-white/10 bg-[#050505] px-6 py-5 group" open>
        <summary className="flex cursor-pointer list-none items-center justify-between text-white">
          <span className="text-2xl" style={cormorant}>Product Details</span>
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
          <span className="text-white/40">Collection</span>
          <span>{product.collection}</span>

          <span className="text-white/40">Product Type</span>
          <span>{product.category}</span>

          <span className="text-white/40">Material</span>
          <span>{product.material}</span>

          <span className="text-white/40">Stone Origin</span>
          <span>{product.stone.origin}</span>

          <span className="text-white/40">Clarity</span>
          <span>{product.stone.clarity}</span>

          <span className="text-white/40">Cut</span>
          <span>{product.stone.cut}</span>

          <span className="text-white/40">Colour</span>
          <span>{product.stone.color}</span>
        </div>
      </details>

      <details className="border border-white/10 bg-[#050505] px-6 py-5 group">
        <summary className="flex cursor-pointer list-none items-center justify-between text-white">
          <span className="text-2xl" style={cormorant}>Shipping & Returns</span>
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-6 space-y-3 text-white/60 text-sm">
          <p>Complimentary insured worldwide delivery.</p>
          <p>Luxury signature packaging included.</p>
          <p>30 day exchange support.</p>
        </div>
      </details>

      <details className="border border-white/10 bg-[#050505] px-6 py-5 group">
        <summary className="flex cursor-pointer list-none items-center justify-between text-white">
          <span className="text-2xl" style={cormorant}>Make It A Rare Gift</span>
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-6 space-y-3 text-white/60 text-sm">
          <p>Personal engraving available.</p>
          <p>Luxury gift wrapping.</p>
          <p>Handwritten maison note.</p>
        </div>
      </details>
    </div>
  )
})

// ──────────────── PRODUCT INFO ────────────────

const ProductInfo: React.FC<ProductInfoProps> = memo(({ product, deliveryResult, setDeliveryResult, quantity, setQuantity, setCartOpen, setToast }) => {
  return (
    <div className="relative z-10 flex flex-col justify-center px-6 py-16 lg:min-h-screen lg:px-16 xl:px-24">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#D6B57A]" style={inter}>
          {product.collection} Collection
        </p>
        <h1 className="mt-4 text-5xl font-light leading-[1.1] tracking-wide text-white sm:text-6xl lg:text-7xl" style={cormorant}>
          {product.name}
        </h1>
        <p className="mt-6 text-2xl font-light tracking-widest text-white/90" style={inter}>
          {product.price}
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/30" style={inter}>
          Product ID • VEL-BR-002
        </p>
        <p
          className="mt-8 max-w-lg text-base leading-8 text-white/60"
          style={inter}
        >
          {product.story}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#D6B57A] text-[#D6B57A]" />
            ))}
          </div>
          <span className="text-sm text-white/60">4.9 / 5 • 2,847 Collectors</span>
        </div>
        
        <div className="mt-6 flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-[#D6B57A] hover:text-[#D6B57A]">
            <Share2 className="h-4 w-4" />
          </button>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Share This Piece</span>
        </div>
        
        <div className="mt-10 h-px w-full bg-white/10" />

        <div className="mt-10 space-y-6">
          <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/50" style={inter}>
            <span>Material</span>
            <span className="text-white">{product.material}</span>
          </div>
          <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/50" style={inter}>
            <span>Availability</span>
            <span className="text-[#D6B57A]">In Maison</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[#D6B57A] text-xs uppercase tracking-widest" style={inter}><Sparkles className="h-3 w-3" />Only 3 pieces available worldwide</div>
        </div>

        <DeliveryChecker deliveryResult={deliveryResult} setDeliveryResult={setDeliveryResult} />

        {/* Find Nearby Boutique */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/50" style={inter}>
            Find Nearby Boutique
          </p>
          <button className="w-full border border-white/20 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-[#D6B57A] hover:text-[#D6B57A] hover:bg-[#D6B57A]/5">
            Find Nearby Store
          </button>
        </div>
        
        <ProductActions
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          setCartOpen={setCartOpen}
          setToast={setToast}
        />

        <ProductAccordions product={product} />
      </motion.div>
    </div>
  )
})

// ──────────────── CART DRAWER ────────────────

const CartDrawer: React.FC<CartDrawerProps> = memo(({ cartOpen, setCartOpen, product, quantity }) => {
  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-[500] bg-black/60" onClick={() => setCartOpen(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-[420px] border-l border-white/10 bg-[#0A0A0A] p-8"
      >
        <h3 className="text-3xl text-white" style={cormorant}>Added To Cart</h3>
        <img src={product.image} alt={product.name} className="mt-6 h-56 w-full rounded-xl object-cover" />
        <p className="mt-4 text-white/60">{product.name}</p>
        <p className="mt-2 text-[#D6B57A]">{product.price}</p>
        <div className="mt-6 flex items-center justify-between text-white/70"><span>Quantity</span><span>{quantity}</span></div>
        <div className="mt-3 flex items-center justify-between text-white"><span>Subtotal</span><span>{product.price}</span></div>
        <button className="mt-8 w-full border border-white/20 py-4 text-white uppercase tracking-[0.2em]">View Cart</button>
        <button
          className="mt-8 w-full bg-white py-4 text-black uppercase tracking-[0.2em]"
          onClick={() => setCartOpen(false)}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  )
})

// ──────────────── PRODUCT HERO ────────────────

function ProductHero({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [deliveryResult, setDeliveryResult] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!showToast) return
    const timer = setTimeout(() => setShowToast(false), 2500)
    return () => clearTimeout(timer)
  }, [showToast])

  return (
    <section className="relative w-full bg-[#030303] lg:min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%]">
        <ProductGallery product={product} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        <ProductInfo
          product={product}
          deliveryResult={deliveryResult}
          setDeliveryResult={setDeliveryResult}
          quantity={quantity}
          setQuantity={setQuantity}
          setCartOpen={setCartOpen}
          setToast={setShowToast}
        />
      </div>
      <LuxuryToast
        show={showToast}
        message={`${product.name} added to cart`}
      />
      <CartDrawer cartOpen={cartOpen} setCartOpen={setCartOpen} product={product} quantity={quantity} />
    </section>
  )
}

// ──────────────── LUXURY ASSURANCE STRIP ────────────────

const LuxuryAssuranceStrip: React.FC = memo(() => {
  return (
    <section className="border-y border-white/10 bg-[#050505] py-10">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-8 px-6 text-center lg:justify-between lg:px-16">
        <div className="     px-5 py-2 text-[12px] uppercase tracking-[0.25em] text-white/70">✓ Maison Certified</div>
        <div className="     px-5 py-2 text-[12px] uppercase tracking-[0.25em] text-white/70">✓ Lifetime Care</div>
        <div className="     px-5 py-2 text-[12px] uppercase tracking-[0.25em] text-white/70">✓ Complimentary Insured Delivery</div>
        <div className="     px-5 py-2 text-[12px] uppercase tracking-[0.25em] text-white/70">✓ Personal Concierge</div>
      </div>
    </section>
  )
})

// ──────────────── SECTION: RECENTLY VIEWED ────────────────

function RecentlyViewedSection() {
  const items = MOCK_PRODUCTS.slice(0,3)
  return (
    <section className="bg-[#030303] py-24 px-6 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <h3 className="text-4xl text-white" style={cormorant}>Recently Viewed</h3>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#D6B57A]" style={inter}>Continue Exploring</p>
        <div className="mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {items.map(item => (
            <div key={item.id} className="group snap-center min-w-[320px] overflow-hidden border border-white/10 bg-[#0A0A0A] transition-transform duration-500     hover:-translate-y-3 hover:border-[#D6B57A]/30">
              <img src={item.image} alt={item.name} className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-6 text-center">
                <h4 className="text-2xl text-white" style={cormorant}>{item.name}</h4>
                <p className="mt-2 text-[#D6B57A]">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────── RELATED PRODUCTS ────────────────

function RelatedProducts({ currentId }: { currentId: number }) {
  const navigate = useNavigate()
  const related = MOCK_PRODUCTS.filter(p => p.id !== currentId).slice(0, 4)

  return (
    <section className="w-full bg-[#030303] px-6 py-32 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-3xl font-light text-white md:text-4xl" style={cormorant}>You May Also Like</h3>
            <p className="mt-2 text-xs uppercase tracking-widest text-[#D6B57A]" style={inter}>Curated Match</p>
          </div>
          <button onClick={() => navigate('/jewels')} className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors" style={inter}>
            View All Collections <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((prod, idx) => (
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
                <img src={prod.image} alt={prod.name} className="h-full w-full object-cover transition-all duration-[1.2s]  group-hover:scale-[1.15] group-hover:brightness-110" />
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
      </div>
    </section>
  )
}

// ──────────────── MAISON FOOTER ────────────────

const MaisonFooter: React.FC = memo(() => {
  return (
    <section className="bg-[#050505] py-24 text-center">
      <p className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]">Veloria Maison</p>
      <h3 className="mt-6 text-5xl text-white" style={cormorant}>Crafted For Generations</h3>
      <p className="mx-auto mt-6 max-w-xl text-white/50">
        Every creation is designed to outlive trends and become part of a legacy.
      </p>
    </section>
  )
})

// ──────────────── MAIN PAGE COMPONENT ────────────────

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0]
  const [isDesktop, setIsDesktop] = useState(true)
  const cursorGlowRef = useRef<HTMLDivElement | null>(null)
  const cursorRingRef = useRef<HTMLDivElement | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches)
    window.scrollTo(0, 0)
    setPageLoading(true)
    const loadingTimer = setTimeout(() => setPageLoading(false), 900)
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
      clearTimeout(loadingTimer)
    }
  }, [id])

  if (!product) return <div className="h-screen w-full bg-black flex items-center justify-center text-white">Product not found.</div>

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#030303] p-10">
        <div className="animate-pulse">
          <div className="mb-10 h-12 w-48 bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
            <div className="h-[80vh] bg-white/5" />
            <div className="space-y-6">
              <div className="h-8 w-40 bg-white/10" />
              <div className="h-20 w-full bg-white/10" />
              <div className="h-12 w-32 bg-white/10" />
              <div className="h-64 w-full bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${isDesktop ? 'cursor-none' : ''} bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white min-h-screen font-sans`}>
      
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

      <ProductHero product={product} />

      <LuxuryAssuranceStrip />

      <RecentlyViewedSection />

      <RelatedProducts currentId={product.id} />

      <MaisonFooter />
    </div>
  )
}