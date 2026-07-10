// ──────────────── SECTION COMPONENTS FOR LANDING PAGE ────────────────

function BrandRevealSection({ typography }: { typography: { sans: { fontFamily: string } } }) {
  return (
    // ══════════════════════ BRAND REVEAL BAND ═════════════════════════════
<section id="jewels" className="relative min-h-screen w-full overflow-hidden bg-[#030303] flex items-center justify-center">     
  <motion.div
        initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8}}
        style={{
          padding: '0',
          minHeight: '110vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign:'center',
          overflow:'hidden',
          position:'relative'
        }}
      >
        <p style={{...typography.sans, fontSize:15, letterSpacing:'0.32em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:25}}>
        A SYMBOL OF ETERNAL RADIANCE
        </p>
        <motion.h2
          initial={{
            letterSpacing: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.4em' : '1.4em',
            opacity: 0,
            filter: 'blur(12px)',
            scale: 1.08,
          }}
          whileInView={{
            letterSpacing: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.12em' : '0.32em',
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            fontSize: 'clamp(68px,18vw,160px)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.06em' : '0.28em',
            fontFamily: "'Cormorant Garamond', serif",
            width:'100%',
            overflow:'visible',
          }}
        >
          VELORIA
        </motion.h2>
      </motion.div>
    </section>
  )
}

function LuxuryMarqueeSection({ marqueeCopy }: { marqueeCopy: string }) {
  return (
    <section className="relative mx-auto w-full overflow-hidden border-y border-white/15 bg-black">
      <div className="relative flex h-[58px] items-center md:h-[66px]">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <span className="px-8 text-[10px] uppercase tracking-[0.55em] text-white/55 md:px-12 md:text-xs md:tracking-[0.7em]">
            {marqueeCopy}
          </span>
          <span className="px-8 text-[10px] uppercase tracking-[0.55em] text-white/55 md:px-12 md:text-xs md:tracking-[0.7em]">
            {marqueeCopy}
          </span>
          <span className="px-8 text-[10px] uppercase tracking-[0.55em] text-white/55 md:px-12 md:text-xs md:tracking-[0.7em]">
            {marqueeCopy}
          </span>
          <span className="px-8 text-[10px] uppercase tracking-[0.55em] text-white/55 md:px-12 md:text-xs md:tracking-[0.7em]">
            {marqueeCopy}
          </span>
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/70 to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/70 to-transparent md:w-28" />
      </div>
    </section>
  )
}

function SignatureCollectionSection({ signatureCollection }: { signatureCollection: SignaturePiece[] }) {
  return (
<section className="relative isolate overflow-hidden bg-[#000000] pt-10 pb-24 md:pt-14 md:pb-32 lg:pt-16 lg:pb-40">      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.08),transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 md:px-12 lg:px-16">
        <motion.div
           className="relative mt-30 mb-14 md:mt-48 md:mb-18 lg:mt-46 lg:mb-20"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-[min(100%,42rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,181,122,0.14)_0%,transparent_68%)] blur-2xl" />
          <p className="relative text-[10px] font-light uppercase tracking-[0.55em] text-[#d6b57a] md:text-[11px] md:tracking-[0.62em]">
            Signature Collection
          </p>
          <h3
            className="relative mt-6 max-w-4xl text-[2.75rem] font-light leading-[0.92] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            style={cormorant}
          >
            Sculpted For Modern Royalty
          </h3>
          <div className="relative mt-8 h-px w-16 bg-gradient-to-r from-[#d6b57a]/70 via-[#d6b57a]/25 to-transparent" />
          <p className="relative mt-8 max-w-2xl text-base font-light leading-[1.85] text-white/55 md:text-lg md:leading-[1.9]">
            Iconic silhouettes. Rare materials. Timeless allure.
          </p>
          <p className="relative mt-4 max-w-xl text-sm font-light italic leading-[1.9] text-white/38 md:text-base">
            Crafted not just to be worn, but to be remembered.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          <SignatureLuxuryCard item={signatureCollection[0]} staggerDelay={0} />
          <div className="flex w-full flex-col gap-6 md:gap-8 lg:flex-[0_0_35%] lg:gap-10">
            {signatureCollection.slice(1).map((item, index) => (
              <SignatureLuxuryCard key={item.title} item={item} staggerDelay={(index + 1) * 0.12} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CraftsmanshipSection() {
  return (
    <section id="craftsmanship" className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.img
          src="/craftsmanship.jpeg"
          alt=""
          aria-hidden
          className="h-full w-full scale-105 object-cover opacity-[0.55]"
          style={{
            objectPosition: 'center',
            filter: 'brightness(1.08) contrast(1.12)',
          }}
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1.1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/22" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_18%_42%,rgba(255,255,255,0.14),transparent_42%)]" />
      <motion.div
        className="pointer-events-none absolute left-[8%] top-[30%] z-[2] h-72 w-72 rounded-full bg-white/10 blur-[120px]"
        animate={{ opacity: [0.25, 0.42, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_50%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0 1px, transparent 1px 4px)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-6 py-32 md:px-16 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl space-y-8 md:space-y-12"
        >
          <div className="absolute -left-4 top-8 h-40 w-40 rounded-full bg-white/10 blur-[100px]" />
          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-[10px] uppercase tracking-[0.52em] text-white/50 md:text-xs md:tracking-[0.6em]"
          >
              HAND-FORGED LUXURY
          </motion.p>

          <h3
            className="relative z-10 text-[3.4rem] font-light leading-[0.78] tracking-[-0.04em] text-white sm:text-[5.2rem] md:text-[7.5rem]"
            style={cormorant}
          >
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="block"
            >
              Where Art
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 1 }}
              className="block"
            >
              Meets
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="block"
            >
              Precision
            </motion.span>
          </h3>

          <motion.p
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.42, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-base font-light italic leading-[1.9] text-zinc-200/90 md:text-xl"
          >
            Each creation is refined by master artisans using timeless <br/> techniques,
            balancing rare stones, handcrafted detail, and <br/> cinematic elegance. Designed not just to shine , but to leave <br/> an unforgettable mark across generations.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  Hammer,
  Heart,
  Infinity as InfinityIcon,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const

function LuxuryNavLink({ href, children }: { href: string; children: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()

      const section = document.querySelector(href)

      section?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group relative py-1 text-sm tracking-[0.16em] text-zinc-400 transition-all duration-500 hover:text-white hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.28)]"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-white/75 via-white/35 to-transparent transition-all duration-500 ease-out group-hover:w-full" />
    </a>
  )
}

function HeroAtmosphere() {
  const dust = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: `dust-${i}`,
        left: 6 + Math.random() * 88,
        top: 10 + Math.random() * 80,
        size: Math.random() > 0.8 ? 1.5 : 1,
        opacity: 0.06 + Math.random() * 0.18,
        duration: 6 + Math.random() * 9,
        delay: Math.random() * 5,
        drift: (Math.random() - 0.5) * 28,
      })),
    [],
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: `spark-${i}`,
        left: 28 + Math.random() * 58,
        top: 18 + Math.random() * 58,
        duration: 2.8 + Math.random() * 3.5,
        delay: Math.random() * 4,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dust.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/90"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -p.drift, 0],
            x: [0, p.drift * 0.25, 0],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute h-px w-px rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.65)]"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

type SignaturePiece = {
  category: string
  title: string
  description: string
  image: string
  objectPosition: string
  featured?: boolean
}

function SignatureLuxuryCard({ item, staggerDelay }: { item: SignaturePiece; staggerDelay: number }) {
  const isFeatured = Boolean(item.featured)

  return (
    <motion.article
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: staggerDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10 }}
      className={[
        'group relative flex flex-col overflow-hidden rounded-none border border-white/[0.08] bg-[#050505]',
        'transition-[border-color,transform] duration-700 ease-out hover:border-white/[0.25]',
        isFeatured ? 'w-full lg:min-h-[44rem] lg:flex-[0_0_65%]' : 'w-full flex-1 lg:min-h-0',
      ].join(' ')}
    >
      <div
        className={[
          'relative flex-shrink-0 overflow-hidden',
          isFeatured
            ? 'h-[26rem] sm:h-[32rem] lg:h-[min(38rem,58vh)] lg:flex-1 lg:min-h-[32rem]'
            : 'h-[18rem] sm:h-[20rem] lg:h-auto lg:min-h-[10rem] lg:flex-1',
        ].join(' ')}
      >
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-[1.12]"
          style={{ objectPosition: item.objectPosition }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-[#050505]/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[rgba(214,181,122,0.06)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 22% 18%, rgba(255,255,255,0.18) 0 1px, transparent 1px 3px)',
          }}
        />
      </div>

      <div className={['relative z-10 flex-shrink-0', isFeatured ? 'p-7 md:p-10 lg:p-12' : 'p-6 md:p-8'].join(' ')}>
        <p className="text-[9px] font-light uppercase tracking-[0.48em] text-[#d6b57a] md:text-[10px] md:tracking-[0.52em]">
          {item.category}
        </p>
        <div className="mt-4 h-px w-10 bg-gradient-to-r from-[#d6b57a]/50 to-transparent" />
        <h4
          className={[
            'mt-4 font-light leading-[0.95] text-white',
            isFeatured
              ? 'text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]'
              : 'text-2xl sm:text-3xl md:text-[2.1rem]',
          ].join(' ')}
      style={cormorant}
        >
          {item.title}
        </h4>
        <p
          className={[
            'mt-4 font-light leading-[1.85] text-white/48',
            isFeatured ? 'max-w-lg text-sm md:text-base' : 'max-w-md text-sm',
          ].join(' ')}
        >
          {item.description}
        </p>
      </div>
    </motion.article>
  )
}

const editorialGrain =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

const inter = { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif' } as const

const editorialProducts = [
  {
    image: '/ring.jpg',
    label: 'ETERNAL SOLITAIRES',
    heading: 'Timeless Rings Crafted For Eternity',
    paragraph:
      'From classic solitaires to modern masterpieces, every ring is designed to become a lifelong symbol.',
    button: 'Explore Rings',
    path: '/jewels?category=rings',
  },
  {
    image: '/bracelet.jpg',
    label: 'WRAPPED IN RADIANCE',
    heading: 'Bracelets That Define Elegance',
    paragraph:
      'Delicate silhouettes sculpted with precision and crafted to elevate every movement.',
    button: 'Explore Bracelets',
    path: '/jewels?category=bracelets',

  },
  {
    image: '/necklace.jpg',
    label: 'ICONS OF LIGHT',
    heading: 'Necklaces That Rest Close To The Heart',
    paragraph:
      'Minimal yet unforgettable forms designed to shine with quiet sophistication.',
    button: 'Explore Necklaces',
    path: '/jewels?category=necklaces',
  },
  {
    image: '/earrings.jpg',
    label: 'CELESTIAL DROPS',
    heading: 'Earrings That Illuminate You',
    paragraph:
      'Refined brilliance crafted to frame beauty through timeless detail and modern grace.',
    button: 'Explore Earrings',
    path: '/jewels?category=earrings',
  },
] as const

function EditorialShowcaseCard({ product, index }: { product: (typeof editorialProducts)[number]; index: number }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const imageLeft = index % 2 === 0
  const navigate = useNavigate()

  const handleParallax = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10
    setParallax({ x, y })
  }

  const imagePanel = (
    <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[24rem] md:h-full md:min-h-[500px] lg:min-h-[560px] xl:min-h-[620px]">
      <motion.img
        src={product.image}
        alt={product.heading}
        className="absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-[0.85s] group-hover:brightness-[1.08]"
        animate={{ x: parallax.x, y: parallax.y, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 110, damping: 24 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.08)_0%,transparent_42%,rgba(255,255,255,0.03)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
    </div>
  )

  const textPanel = (
    <div className="flex min-h-[20rem] flex-col justify-center px-8 py-12 sm:min-h-[22rem] sm:px-10 sm:py-14 md:min-h-0 md:px-14 md:py-16 lg:px-20 lg:py-20 xl:px-24">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-[10px] font-light uppercase tracking-[0.48em] text-white/45"
        style={inter}
      >
        {product.label}
      </motion.p>
      <motion.h3
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-xl text-[2.15rem] font-light leading-[0.9] tracking-[-0.02em] text-white sm:text-[2.5rem] md:mt-7 md:text-[2.85rem] lg:text-[3.1rem] xl:text-[3.35rem]"
        style={cormorant}
      >
        {product.heading}
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 h-px w-12 origin-left bg-gradient-to-r from-white/40 to-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 max-w-lg text-sm font-light leading-[1.9] text-white/55 md:mt-8 md:text-[1.05rem]"
        style={inter}
      >
        {product.paragraph}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 md:mt-12"
      >
        <button
          type="button"
          onClick={() => navigate(product.path)}
          className="rounded-none border border-white/25 bg-transparent px-9 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all duration-700 ease-out hover:bg-white hover:text-black"
          style={inter}
        >
          {product.button}
        </button>
      </motion.div>
    </div>
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onMouseMove={handleParallax}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
      className="group overflow-hidden rounded-none border border-white/[0.08] bg-black transition-[border-color,transform] duration-700 hover:border-white/[0.25]"
    >
      <div
        className={[
          'grid grid-cols-1 md:items-stretch',
          imageLeft ? 'md:grid-cols-[1.12fr_0.88fr]' : 'md:grid-cols-[0.88fr_1.12fr]',
        ].join(' ')}
      >
        {imageLeft ? (
          <>
            {imagePanel}
            {textPanel}
          </>
        ) : (
          <>
            {textPanel}
            {imagePanel}
          </>
        )}
      </div>
    </motion.article>
  )
}

const assurancePillars = [
  {
    title: 'Certified Authenticity',
    icon: ShieldCheck,
    description: 'Certified & Verified',
  },
  {
    title: 'Master Craftsmanship',
    icon: Hammer,
    description: 'Handcrafted To Perfection',
  },
  {
    title: 'Ethically Sourced',
    icon: Leaf,
    description: 'Responsibly Selected',
  },
  {
    title: 'Lifetime Care',
    icon: InfinityIcon,
    description: 'A Commitment Beyond Generations',
  },
  {
    title: 'White Glove Delivery',
    icon: PackageCheck,
    description: 'Secure & Insured Worldwide',
  },
] as const

function AssurancePillarCard({
  title,
  description,
  icon: Icon,
  index,
  total,
}: {
  title: string
  description: string
  icon: LucideIcon
  index: number
  total: number
}) {
  const isLast = index === total - 1
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex w-[280px] flex-col items-center justify-start px-8 md:w-auto md:flex-1 md:px-10 lg:px-12 ${!isLast ? 'border-r border-white/5' : ''}`}
    >
      <Icon
        className="mb-10 h-[1.35rem] w-[1.35rem] text-white/95 transition-all duration-700 group-hover:text-[#D6B57A] group-hover:drop-shadow-[0_0_12px_rgba(214,181,122,0.4)]"
        strokeWidth={1}
      />
      <h4
        className="whitespace-nowrap text-lg font-medium tracking-wide text-white/95 transition-colors duration-700 group-hover:text-white md:text-xl lg:text-[1.45rem]"
        style={cormorant}
      >
        {title}
      </h4>
      <p
        className="mt-3 text-center text-[11px] font-medium tracking-[0.08em] text-white/55 transition-colors duration-700 group-hover:text-white/80 md:text-[12px]"
        style={inter}
      >
        {description}
      </p>
    </motion.div>
  )
}

function LuxuryAssuranceSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#030303] py-24 md:py-32 lg:py-40">
      {/* Extremely subtle background elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.03)_0%,transparent_50%)]" />
      
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14 xl:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <p
            className="mb-20 text-[15px] font-bold uppercase tracking-[0.6em] text-[#D6B57A]/80 md:mb-24 lg:mb-28"
            style={inter}
          >
            OUR PROMISE
          </p>

          <div className="flex w-full items-center justify-center overflow-x-auto pb-6 md:justify-center lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex min-w-max items-start justify-center gap-16 md:min-w-0 md:w-full md:gap-0 lg:gap-0">
              {assurancePillars.map((pillar, index) => (
                <AssurancePillarCard
                  key={pillar.title}
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  index={index}
                  total={assurancePillars.length}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EditorialProductShowcase() {
  return (
    <section className="relative isolate overflow-hidden bg-[#030303] py-24 md:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.03)_0%,transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: editorialGrain }}
      />
      <div className="pointer-events-none absolute -left-24 top-[20%] h-72 w-72 rounded-full bg-white/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-[15%] h-64 w-64 rounded-full bg-white/[0.03] blur-[90px]" />

      <div className="relative mx-auto w-full max-w-[1520px] px-5 md:px-10 lg:px-14 xl:px-16">
        <motion.header
          className="relative mb-14 md:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -top-12 left-0 h-40 w-[min(100%,36rem)] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_68%)] blur-2xl" />
          <p
            className="relative text-[10px] font-light uppercase tracking-[0.52em] text-white/40 md:text-[11px]"
            style={inter}
          >
            SIGNATURE COLLECTION
          </p>
          <h2
            className="relative mt-6 max-w-4xl text-[2.5rem] font-light leading-[0.9] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          style={cormorant}
          >
            Curated Icons Of Modern Luxury
          </h2>
          <div className="relative mt-8 h-px w-14 bg-gradient-to-r from-white/35 to-transparent" />
          <p
            className="relative mt-8 max-w-2xl text-base font-light leading-[1.9] text-white/50 md:text-lg"
            style={inter}
          >
            Designed to transcend trends through timeless craftsmanship and sculpted elegance.
          </p>
        </motion.header>

        <div className="flex flex-col gap-10 md:gap-14 lg:gap-16">
          {editorialProducts.map((product, index) => (
            <EditorialShowcaseCard key={product.label} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EditorialModelShowcase() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-gradient-to-b from-[#040404] via-[#050505] to-[#050505] pb-32 md:pb-40 lg:pb-48">
    
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[35%_65%] lg:min-h-[85vh]">
        {/* ── LEFT: CONTENT ── */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-20 md:px-16 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[10px] font-light uppercase tracking-[0.45em] text-white/50"
              style={inter}
            >
              JEWELLERY ON HUMAN MODEL
            </p>
            <h2
              className="mt-8 text-[3rem] font-light leading-[1] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem]"
              style={cormorant}
            >
              Adorned By Elegance
            </h2>
            <div className="mt-8 h-px w-16 bg-gradient-to-r from-white/40 to-transparent" />
            <p
              className="mt-8 max-w-sm text-base font-light leading-[1.8] text-white/60 md:text-lg"
              style={inter}
            >
              Timeless beauty, <br/> crafted to be lived in.
            </p>
            <div className="mt-12">
              <a
                href="/#/jewels"
                className="group relative inline-flex items-center gap-4 text-xs font-light uppercase tracking-[0.2em] text-white transition-colors hover:text-white/80"
                style={inter}
              >
                <span className="border-b border-white/30 pb-1 transition-colors group-hover:border-white/80">Discover Collection</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: IMAGE ── */}
        <div className="relative h-[60vh] w-full overflow-hidden lg:h-full">
          <motion.img
            src="/girl.jpeg"
            alt="Adorned By Elegance"
            className="absolute inset-0 h-full w-full origin-center object-cover object-center lg:object-[center_20%] brightness-125 contrast-115 saturate-110"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Overlays for dark luxury mood and blending */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-90 lg:hidden" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/35 to-transparent opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-black/10 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_50%)]" />
        </div>
      </div>
    </section>
  )
}

const rareStones = [
  {
    name: 'DIAMOND',
    image: '/diamond-show.jpeg',
    glow: 'rgba(255, 255, 255, 0.08)',
    reflection: 'rgba(255, 255, 255, 0.08)',
  },
  {
    name: 'SAPPHIRE',
    image: '/saphire-show.jpeg',
    glow: 'rgba(15, 82, 186, 0.12)',
    reflection: 'rgba(15, 82, 186, 0.12)',
  },
  {
    name: 'EMERALD',
    image: '/emerald-show.jpeg',
    glow: 'rgba(23, 114, 69, 0.12)',
    reflection: 'rgba(23, 114, 69, 0.12)',
  },
  {
    name: 'RUBY',
    image: '/ruby-show.jpeg',
    glow: 'rgba(155, 17, 30, 0.12)',
    reflection: 'rgba(155, 17, 30, 0.12)',
  },
] as const

function RareStonesShowcase() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#030303] py-20 lg:py-0 lg:min-h-[85vh]">
      {/* Background Visual Effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: editorialGrain }}
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />

      <div className="flex flex-col lg:grid lg:grid-cols-[35%_65%] lg:min-h-[85vh]">
        {/* ── LEFT: CONTENT ── */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[10px] font-light uppercase tracking-[0.45em] text-[#D6B57A]"
              style={inter}
            >
              RARE STONES COLLECTION
            </p>
            <h2
              className="mt-8 text-[2.75rem] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem]"
              style={cormorant}
            >
              Born From The<br />World's Rarest<br />Stones
            </h2>
            <div className="mt-8 h-px w-16 bg-gradient-to-r from-[#D6B57A]/80 to-transparent" />
            <p
              className="mt-8 max-w-sm text-base font-light leading-[1.8] text-white/60 md:text-lg"
              style={inter}
            >
              Handpicked. Ethically sourced.<br />Naturally exceptional.
            </p>
            <div className="mt-12">
              <a
                href="#"
                className="group relative inline-flex items-center gap-4 text-xs font-light uppercase tracking-[0.2em] text-[#D6B57A] transition-colors hover:text-[#e8ce9e]"
                style={inter}
              >
                <span>Explore Rare Stones &rarr;</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: STONES DISPLAY ── */}
        <div className="relative z-10 flex items-center overflow-x-auto overflow-y-visible px-8 pb-20 pt-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] lg:overflow-visible lg:px-0 lg:py-0">
          <div className="flex w-max gap-8 md:gap-12 lg:grid lg:w-full lg:grid-cols-4 lg:gap-4 lg:pr-16">
            {rareStones.map((stone, i) => (
              <motion.div
                key={stone.name}
                className="group relative flex w-[200px] cursor-pointer flex-col items-center justify-center md:w-[240px] lg:w-full"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Stone Image Container */}
                <motion.div
                  className="relative z-10 flex h-[240px] w-full items-center justify-center md:h-[280px] lg:h-[320px]"
                  whileHover={{ scale: 1.08, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Responsive Glow behind the stone */}
                  <div
                    className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[40px] transition-all duration-500 group-hover:h-40 group-hover:w-40 group-hover:opacity-70 group-hover:blur-[50px]"
                    style={{ backgroundColor: stone.glow }}
                  />
                  <img src={stone.image} alt={stone.name} className="relative z-10 h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
                </motion.div>

                {/* Reflective Surface underneath */}
                <div className="relative mt-2 flex w-full flex-col items-center">
                  <div className="absolute left-1/2 top-0 h-[2px] w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] blur-[1px]" />
                  <motion.div
                    className="h-16 w-32 origin-top rounded-[100%] opacity-50 blur-md transition-all duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at top, ${stone.reflection} 0%, transparent 70%)` }}
                  />
                  <p className="absolute top-8 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-500 group-hover:text-white/80 lg:top-12">{stone.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Film() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  // Smooth parallax scroll mapping
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section
      id="maison"
      ref={containerRef}
      className="group relative isolate w-full h-[70vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-[#030303]"
    >
      {/* ── VIDEO BACKGROUND WITH PARALLAX ── */}
      <motion.div className="absolute inset-0 z-0 h-[100%] w-full" style={{ y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/film.mp4"
          className="h-full w-full object-cover transition-all duration-[2s]  group-hover:brightness-110"
          style={{ filter: 'brightness(0.99) contrast(1.15) saturate(1.1)' }}
        />
      </motion.div>

      {/* Black gradient overlays for cinematic mood */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#030303] via-black/50 to-transparent opacity-95" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

      <div className="relative z-10 h-full w-full" />
    </section>
  )
}

function FinalThankYouSection() {
  return (
    <section className="mx-auto mt-16 mb-16 w-[92%] max-w-[900px] md:mt-20 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050505] px-8 py-8 md:px-12 md:py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,181,122,0.06)_0%,transparent_65%)]" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-5 h-px w-20 bg-gradient-to-r from-transparent via-[#D6B57A] to-transparent" />

          <p
            className="text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]/70"
            style={inter}
          >
            THANK YOU
          </p>

          <p
            className="mt-7 text-lg italic text-white/50 md:text-xl"
            style={cormorant}
          >
            Thank you for becoming part of our story.
          </p>

          <div className="mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#D6B57A] to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

function MaisonFilmShowcase() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  // Smooth parallax scroll mapping
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section
      ref={containerRef}
      className="group relative isolate w-full h-screen min-h-screen overflow-hidden bg-[#030303]"
    >
      {/* ── VIDEO BACKGROUND WITH PARALLAX ── */}
      <motion.div className="absolute inset-0 z-0 h-[100%] w-full" style={{ y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/veloria-film.mp4"
          className="h-full w-full object-cover transition-all duration-[2s]  group-hover:scale-105 group-hover:brightness-110"
          style={{ filter: 'brightness(0.8) contrast(1.15) saturate(1.1)' }}
        />
      </motion.div>

      {/* ── LUXURY OVERLAYS ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#030303] via-black/50 to-transparent opacity-95" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_25%_50%,rgba(214,181,122,0.15),transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: editorialGrain }}
      />
      <div className="pointer-events-none absolute inset-0 z-[2] opacity-40 mix-blend-screen">
        {/* Reuse the subtle floating dust particles you already have */}
        <HeroAtmosphere />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-center px-6 md:px-12 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p
            className="text-[10px] font-light uppercase tracking-[0.5em] text-white/50"
            style={inter}
          >
            MAISON FILM
          </p>
          <h2
            className="mt-6 text-5xl font-light leading-none text-white sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              style={cormorant}
          >
            VELORIA
          </h2>
          <h3
            className="mt-3 text-2xl font-light text-[#d6b57a] md:text-3xl lg:text-[2rem]"
            style={cormorant}
          >
            A House Of Eternal Beauty
          </h3>
          <div className="mt-7 h-px w-16 bg-gradient-to-r from-[#d6b57a]/60 to-transparent" />
          <p
            className="mt-6 max-w-md text-sm font-light leading-[1.9] text-white/60 md:text-base"
            style={inter}
          >
            A cinematic journey through timeless craftsmanship, rare stones and the artistry behind every masterpiece.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
                className="rounded-none bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-all duration-500 hover:bg-transparent hover:text-white hover:border hover:border-white"
              style={inter}
            >
              Watch The Film
            </button>
            <button
              type="button"
                className="rounded-none border border-white/20 bg-transparent px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
              style={inter}
            >
              Discover The Maison
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function LuxuryFooter() {
  const links = [
  { label: 'Instagram', icon: MessageCircle , href: 'https://instagram.com/jain.yash.04'},
  { label: 'LinkedIn', icon: MessageCircle , href: 'https://www.linkedin.com/in/yashjain1404/'},
  { label: 'WhatsApp', icon: MessageCircle , href: 'https://wa.me/919457775559' } ,
  { label: 'Call', icon: Phone , href: 'tel:+919457775559' },
]

  const [parallaxX, setParallaxX] = useState(0)

  return (
    <footer
      id="contact"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const offset = ((e.clientX - rect.left) / rect.width - 0.5) * 30
        setParallaxX(offset)
      }}
      onMouseLeave={() => setParallaxX(0)}
className="relative isolate overflow-hidden border-white/[0.06] bg-[#030303] pt-8 pb-8 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12"    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(214,181,122,0.05)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6B57A]/[0.05] blur-[120px]" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(214,181,122,0.035) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        animate={{ x: parallaxX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="text-[260px] font-light leading-none text-white/[0.025] md:text-[360px] lg:text-[460px]"
          style={cormorant}
        >
          V
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <div className="pointer-events-none absolute left-[20%] top-[42%] hidden h-24 w-px bg-[#D6B57A]/20 lg:block" />
        <div className="pointer-events-none absolute right-[20%] top-[42%] hidden h-24 w-px bg-[#D6B57A]/20 lg:block" />
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          animate={{
            backgroundPosition: ['-200% center', '200% center', '-200% center'],
          }}
          transition={{
            backgroundPosition: {
              duration: 9,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="flex bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(214,181,122,0.95)_50%,rgba(255,255,255,1)_100%)] bg-[length:200%_100%] bg-clip-text text-[52px] font-light tracking-[0.28em] text-transparent text-[#F6F1E8] md:text-[80px] lg:text-[96px]"
          style={cormorant}
        >
          {'VELORIA'.split('').map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h2>

        <p
          className="mt-4 text-[10px] uppercase tracking-[0.65em] text-white/45 md:text-xs"
          style={inter}
        >
          Crafted For Eternity
        </p>

        <p
          className="mt-6 text-sm italic text-white/40 md:text-base"
          style={cormorant}
        >
          Jewellery that transcends generations.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-y-5 md:mt-16">
          {links.map((link, index) => {
            const Icon = link.icon

            return (
              <div key={link.label} className="flex items-center">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-5 text-[11px] uppercase tracking-[0.28em] text-white/55 transition-all duration-500 hover:text-[#D6B57A] hover:drop-shadow-[0_0_12px_rgba(214,181,122,0.6)]"                  
                  style={inter}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span>{link.label}</span>
                  <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#D6B57A] transition-all duration-500 group-hover:w-[70%]" />
                </a>

                {index !== links.length - 1 && (
                  <div className="mx-2 h-1.5 w-1.5 rotate-45 bg-[#D6B57A]/50" />
                )}
              </div>
            )
          })}
        </div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '120px' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#D6B57A] to-transparent md:mt-20"
        />

        <div className="mt-8 flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-white/35"
            style={inter}
          >
            © 2026 VELOria all rights reserved
          </p>

          <p
            className="text-[10px] uppercase tracking-[0.28em] text-white/35"
            style={inter}
          >
            made with 🩵 by yash jain
          </p>
        </div>
      </div>
    </footer>
  )
}

function LuxuryLoader() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: ['0%', '0%', '-100%'] }}
      transition={{ duration: 4, times: [0, 0.82, 1], ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1, 1, 0.6],
            filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'],
          }}
          transition={{
            duration: 4,
            times: [0, 0.25, 0.90, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-[34vw] leading-none text-[#D6B57A]/10"
          style={cormorant}
        >
          V
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: '1em', filter: 'blur(10px)' }}
          animate={{
            opacity: [0, 1, 1, 0],
            letterSpacing: ['1em', '0.25em', '0.25em', '1em'],
            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
          }}
          transition={{
            duration: 4,
            times: [0, 0.55, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-white md:text-8xl"
          style={cormorant}
        >
          VELORIA
        </motion.h1>
      </div>
    </motion.div>
  )
}

export function LandingPage() {
  const [showScroll, setShowScroll] = useState(true)
  const [loading, setLoading] = useState(() => {
  return !sessionStorage.getItem('veloria-loader-shown')
})
  const cursorGlowRef = useRef<HTMLDivElement | null>(null)
  const cursorRingRef = useRef<HTMLDivElement | null>(null)
  const cartCount = useCartStore(state => state.cartCount)
  const wishlistCount = useWishlistStore(state => state.wishlistCount)
  const { isAuthenticated, role } = useAuthStore()
  const navigate = useNavigate()
  const typography = {
    sans: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif' },
  }

  useEffect(() => {
    let loaderTimer: ReturnType<typeof setTimeout> | undefined

    if (loading) {
      loaderTimer = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('veloria-loader-shown', 'true')
      }, 5000)
    }

    let timeout: ReturnType<typeof setTimeout> | undefined

    const handleScroll = () => {
      setShowScroll(false)

      if (timeout) clearTimeout(timeout)

      timeout = setTimeout(() => {
        setShowScroll(true)
      }, 800)
    }

    const moveGlow = (e: MouseEvent) => {
      if (cursorGlowRef.current) cursorGlowRef.current.style.opacity = '1'
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1'
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform =
          `translate(${e.clientX - 70}px, ${e.clientY - 70}px)`
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform =
          `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', moveGlow)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', moveGlow)

      if (timeout) clearTimeout(timeout)
      if (loaderTimer) clearTimeout(loaderTimer)
    }
  }, [loading])

  useEffect(() => {
    const showCursor = () => {
      if (cursorGlowRef.current) cursorGlowRef.current.style.opacity = '1'
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1'
    }

    const hideCursor = () => {
      if (cursorGlowRef.current) cursorGlowRef.current.style.opacity = '0'
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0'
    }

    window.addEventListener('mouseenter', showCursor)
    window.addEventListener('mouseleave', hideCursor)

    return () => {
      window.removeEventListener('mouseenter', showCursor)
      window.removeEventListener('mouseleave', hideCursor)
    }
  }, [])

  const marqueeCopy = 'ETERNAL • RARE • SCULPTED • ICONIC • VELORIA'
  const signatureCollection = [
    {
      category: 'Signature Halo',
      title: 'Nocturne Solstice',
      description: 'Sculpted white gold curves embracing a singular brilliant stone.',
      image: '/ring-luxury.jpg',
      objectPosition: '50% 42%',
      featured: true,
    },
    {
      category: 'Atelier Series',
      title: 'Lune Crest',
      description: 'Quiet geometry cast in platinum with mirror-polished facets.',
      image: '/bracelet-luxury.jpg',
      objectPosition: '48% 50%',
      featured: false,
    },
    {
      category: 'Maison Archive',
      title: 'Eternal Arc',
      description: 'A minimal heirloom composition designed for modern icons.',
      image: '/pendant-luxury.jpg',
      objectPosition: '55% 45%',
      featured: false,
    },
  ]


  return (
    <div className="relative cursor-none bg-[#030303] text-zinc-100">
      {loading && <LuxuryLoader />}
      <>
    <div
      ref={cursorGlowRef}
      className="pointer-events-none fixed left-0 top-0 z-40 h-[140px] w-[140px] rounded-full bg-[#D6B57A]/10 blur-[90px] transition-transform duration-500 ease-out opacity-0 will-change-transform"
    />

    <div
      ref={cursorRingRef}
      className="pointer-events-none fixed left-0 top-0 z-[999] h-12 w-12 rounded-full border border-[#D6B57A]/50 transition-transform duration-100 ease-out opacity-0 will-change-transform"
    >

    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6B57A] shadow-[0_0_12px_rgba(214,181,122,0.9)]" />

  </div>

</>

      <header className="sticky top-0 z-50 mx-auto w-full max-w-[1500px] px-4 pt-4 md:px-10 md:pt-5">
        <motion.div
          className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-6 py-4 shadow-[0_8px_48px_rgba(0,0,0,0.55),0_0_80px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-3xl md:px-9 md:py-5"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs font-light tracking-[0.48em] text-white/95 md:text-sm md:tracking-[0.5em]">
            VELORIA
          </div>
          <nav className="hidden items-center gap-9 md:flex lg:gap-11">
            <LuxuryNavLink href="/#/jewels">Jewels</LuxuryNavLink>
            <LuxuryNavLink href="#craftsmanship">Craftsmanship</LuxuryNavLink>
            <LuxuryNavLink href="#maison">Maison</LuxuryNavLink>
            <LuxuryNavLink href="#contact">Contact</LuxuryNavLink>
          </nav>
          <div className="flex items-center gap-4 text-white md:gap-5">
            {(
              [
                ['search', Search],
                ['heart', Heart],
                ['bag', ShoppingBag],
                ['user', User],
              ] as const
            ).map(([key, Icon]) => (
          <div 
            key={key} 
            className="relative group cursor-pointer"
            onClick={() => {
              if (key === 'bag') navigate('/cart')
              if (key === 'heart') navigate('/wishlist')
              if (key === 'user') navigate(isAuthenticated && role ? `/${role.toLowerCase()}` : '/login')
            }}
          >
            <Icon
              className="h-[1.15rem] w-[1.15rem] text-zinc-500 transition-all duration-500 hover:scale-110 hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] md:h-5 md:w-5"
            />
            {key === 'heart' && wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">
                {wishlistCount}
              </span>
            )}
            {key === 'bag' && cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D6B57A] text-[8px] font-semibold text-black">
                {cartCount}
              </span>
            )}
          </div>
            ))}
          </div>
        </motion.div>
      </header>

      <MaisonFilmShowcase />
      <BrandRevealSection typography={typography} />
      <LuxuryMarqueeSection marqueeCopy={marqueeCopy} />
      <LuxuryAssuranceSection />
      <CraftsmanshipSection />
      <SignatureCollectionSection signatureCollection={signatureCollection} />
      <EditorialModelShowcase />
      <RareStonesShowcase />
      <Film />
      <EditorialProductShowcase />
      <FinalThankYouSection />
      <LuxuryFooter />
    </div>
  )
}
