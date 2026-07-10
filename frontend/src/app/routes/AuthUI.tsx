import React, { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

const AuthParticles = memo(() => {
  const dust = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: `dust-${i}`,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() > 0.8 ? 2 : 1,
    opacity: 0.1 + Math.random() * 0.4,
    duration: 8 + Math.random() * 15,
    delay: Math.random() * 5,
    drift: (Math.random() - 0.5) * 20,
  })), [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dust.map((p) => (
        <motion.span key={p.id} className="absolute rounded-full bg-[#D6B57A]" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }} animate={{ y: [0, -p.drift, 0], x: [0, p.drift * 0.5, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }} transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }} />
      ))}
    </div>
  )
})
AuthParticles.displayName = 'AuthParticles'

export const LuxuryInput = React.forwardRef<HTMLInputElement, any>(({ label, type = "text", required = false, className = "", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={ref}
        type={inputType}
        required={required}
        className="peer block w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0"
        placeholder=" "
        {...props}
      />
      <label className="absolute top-4 -z-10 origin-[0] -translate-y-6 scale-75 transform text-[10px] uppercase tracking-widest text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D6B57A]">
        {label} {required && <span className="text-[#D6B57A]">*</span>}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-4 text-white/40 hover:text-[#D6B57A] transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
})
LuxuryInput.displayName = 'LuxuryInput'

export const LuxuryButton = ({ children, loading, onClick, type = 'button', className = '' }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    className={`group relative flex w-full items-center justify-center overflow-hidden bg-white py-4 text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(214,181,122,0.4)] disabled:opacity-70 disabled:hover:scale-100 ${className}`}
  >
    {!loading && (
      <motion.div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    )}
    <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center" style={inter}>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
          PROCESSING...
        </div>
      ) : children}
    </span>
  </button>
)

export const SocialAuthButton = ({ icon, provider, onClick, primary = false }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-center gap-4 border py-4 transition-all duration-500 hover:-translate-y-0.5 ${
      primary 
        ? 'border-[#D6B57A]/40 bg-[#D6B57A]/5 hover:bg-[#D6B57A]/15 hover:border-[#D6B57A]/80 shadow-[0_0_20px_rgba(214,181,122,0)] hover:shadow-[0_0_20px_rgba(214,181,122,0.15)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'
    }`}
  >
    <img src={icon} alt={provider} className="h-[18px] w-[18px] object-contain" />
    <span className={`text-[10px] uppercase tracking-widest ${primary ? 'text-[#D6B57A]' : 'text-white/80'}`} style={inter}>
      Continue with {provider}
    </span>
  </button>
)

export const SocialAuthSection = () => (
  <div className="flex flex-col gap-4 w-full">
    <SocialAuthButton 
      primary
      provider="Google" 
      icon="https://www.svgrepo.com/show/475656/google-color.svg" 
    />
    <div className="grid grid-cols-2 gap-4">
      <SocialAuthButton 
        provider="Apple" 
        icon="https://www.svgrepo.com/show/511330/apple-173.svg" 
      />
      <SocialAuthButton 
        provider="GitHub" 
        icon="https://www.svgrepo.com/show/475654/github-color.svg" 
      />
    </div>
  </div>
)

export const AuthDivider = ({ text = "OR" }: { text?: string }) => (
  <div className="relative my-8 flex items-center justify-center">
    <div className="absolute w-full border-t border-white/10" />
    <span className="relative bg-[#030303] lg:bg-black/50 lg:backdrop-blur-md px-4 py-1 text-[9px] uppercase tracking-widest text-white/40 rounded-full" style={inter}>
      {text}
    </span>
  </div>
)

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => (
  <div className="relative flex min-h-screen w-full bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white font-sans overflow-hidden">
    
    {/* FULL BACKGROUND IMAGE (Visible on desktop behind the glass) */}
    <div className="absolute inset-0 hidden lg:block">
      <motion.img initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }} src="/ring.jpeg" className="h-full w-full object-cover brightness-[0.5]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/60 to-transparent" />
      <AuthParticles />
    </div>

    {/* LEFT CONTENT (55%) */}
    <div className="relative hidden w-[55%] flex-col justify-center px-16 xl:px-28 lg:flex z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(214,181,122,0.15),transparent_60%)] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-[#D6B57A]" style={inter}>Veloria Maison</p>
        <h1 className="max-w-xl text-5xl font-light leading-[1.15] text-white xl:text-[4.5rem]" style={cormorant}>
          ENTER THE WORLD OF<br />TIMELESS LUXURY
        </h1>
        <div className="mt-10 h-px w-16 bg-gradient-to-r from-[#D6B57A] to-transparent" />
        <p className="mt-8 text-base font-light tracking-wide text-white/60 leading-relaxed" style={inter}>
          Crafted for collectors.<br />Curated for connoisseurs.
        </p>
      </motion.div>
    </div>

    {/* RIGHT CONTENT GLASSMORPHISM (45%) */}
    <div className="relative flex w-full flex-col items-center justify-center overflow-y-auto px-6 py-12 lg:w-[45%] lg:px-12 xl:px-20 h-screen [&::-webkit-scrollbar]:hidden z-20">
      <div className="absolute inset-0 bg-[#030303] lg:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,181,122,0.1),transparent_50%)] lg:hidden" />

      <div className="hidden lg:block absolute inset-0 bg-[#030303]/60 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.6)]" />
      <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.08),transparent_50%)]" />

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-[420px]">
        <div className="mb-14 text-center">
          <Link to="/" className="text-3xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A] md:text-4xl" style={cormorant}>VELORIA</Link>
        </div>
        
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-light text-white sm:text-4xl" style={cormorant}>{title}</h2>
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>{subtitle}</p>
        </div>

        {children}
      </motion.div>
    </div>
  </div>
)