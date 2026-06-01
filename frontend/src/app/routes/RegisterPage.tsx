import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Store } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthLayout, LuxuryInput, LuxuryButton, SocialAuthSection, AuthDivider } from './AuthUI'
import { USER_ROLES } from '@/types/roles'

const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

const RoleSelector = ({ role, setRole }: any) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    <div 
      onClick={() => setRole(USER_ROLES.BUYER)}
      className={`group relative cursor-pointer border p-6 text-center transition-all duration-500 overflow-hidden ${role === USER_ROLES.BUYER ? 'border-[#D6B57A] bg-[#D6B57A]/5 shadow-[0_0_30px_rgba(214,181,122,0.15)] -translate-y-1' : 'border-white/10 bg-transparent hover:border-white/30'}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.15),transparent_60%)] transition-opacity duration-500 ${role === USER_ROLES.BUYER ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      <ShoppingBag className={`mx-auto h-6 w-6 mb-4 transition-colors duration-500 ${role === USER_ROLES.BUYER ? 'text-[#D6B57A]' : 'text-white/30 group-hover:text-white/60'}`} strokeWidth={1} />
      <h4 className={`text-[10px] uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${role === USER_ROLES.BUYER ? 'text-[#D6B57A]' : 'text-white/80'}`} style={inter}>Customer</h4>
      <p className="text-[9px] text-white/40 leading-relaxed" style={inter}>Discover and collect luxury creations.</p>
    </div>
    <div 
      onClick={() => setRole(USER_ROLES.SELLER)}
      className={`group relative cursor-pointer border p-6 text-center transition-all duration-500 overflow-hidden ${role === USER_ROLES.SELLER ? 'border-[#D6B57A] bg-[#D6B57A]/5 shadow-[0_0_30px_rgba(214,181,122,0.15)] -translate-y-1' : 'border-white/10 bg-transparent hover:border-white/30'}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,181,122,0.15),transparent_60%)] transition-opacity duration-500 ${role === USER_ROLES.SELLER ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      <Store className={`mx-auto h-6 w-6 mb-4 transition-colors duration-500 ${role === USER_ROLES.SELLER ? 'text-[#D6B57A]' : 'text-white/30 group-hover:text-white/60'}`} strokeWidth={1} />
      <h4 className={`text-[10px] uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${role === USER_ROLES.SELLER ? 'text-[#D6B57A]' : 'text-white/80'}`} style={inter}>Seller</h4>
      <p className="text-[9px] text-white/40 leading-relaxed" style={inter}>Build your luxury storefront.</p>
    </div>
  </div>
)

const PasswordStrength = ({ password }: { password: string }) => {
  const strength = Math.min(password.length * 10 + (/[A-Z]/.test(password) ? 20 : 0) + (/[0-9]/.test(password) ? 20 : 0), 100)
  
  let label = 'Weak'
  let bars = 1
  if (strength >= 80) { label = 'Luxury Grade'; bars = 4; }
  else if (strength >= 60) { label = 'Strong'; bars = 3; }
  else if (strength >= 40) { label = 'Moderate'; bars = 2; }
  else if (strength > 0) { label = 'Weak'; bars = 1; }
  else { bars = 0; }
  
  if (!password) return null
  
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => {
          const isActive = bars >= step;
          const isLuxury = bars === 4 && isActive;
          return (
            <div key={step} className={`h-full flex-1 overflow-hidden transition-all duration-500 ${isActive ? (isLuxury ? 'bg-[#D6B57A]' : 'bg-[#D6B57A]/60') : 'bg-white/10'}`} />
          )
        })}
      </div>
      <span className="text-[9px] uppercase tracking-widest text-right transition-colors duration-500" style={{ color: bars === 4 ? '#D6B57A' : 'rgba(255,255,255,0.4)', ...inter }}>
        {label}
      </span>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: USER_ROLES.BUYER, agree: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm) return // Add UI error handling for this
    try {
      await register(formData)
      navigate('/')
    } catch (err) {}
  }

  return (
    <AuthLayout title="Join Veloria" subtitle="Choose your experience.">
      <RoleSelector role={formData.role} setRole={(r: any) => setFormData({...formData, role: r})} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" onChange={clearError}>
        <LuxuryInput 
          label="Full Name" required 
          value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})}
        />
        <LuxuryInput 
          label="Email Address" type="email" required 
          value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})}
        />
        <LuxuryInput 
          label="Phone Number" type="tel" required 
          value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
        />
        
        <div className="relative">
          <LuxuryInput 
            label="Password" type="password" required 
            value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})}
          />
          <PasswordStrength password={formData.password} />
        </div>

        <LuxuryInput 
          label="Confirm Password" type="password" required 
          value={formData.confirm} onChange={(e: any) => setFormData({...formData, confirm: e.target.value})}
        />
        
        <label className="flex items-start gap-3 cursor-pointer group mt-2" style={inter}>
          <input type="checkbox" className="hidden" checked={formData.agree} onChange={(e) => setFormData({...formData, agree: e.target.checked})} />
          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${formData.agree ? 'border-[#D6B57A] bg-[#D6B57A]' : 'border-white/30 bg-transparent group-hover:border-white/60'}`}>
            {formData.agree && <div className="h-2 w-2 bg-black" />}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/50 leading-relaxed">
            I agree to the <a href="#" className="text-[#D6B57A] hover:underline">Terms of Service</a> & <a href="#" className="text-[#D6B57A] hover:underline">Privacy Policy</a>
          </span>
        </label>

        {error && <p className="text-red-400 text-xs text-center mt-2" style={inter}>{error}</p>}

        <LuxuryButton type="submit" loading={loading} className="mt-4" disabled={!formData.agree}>Create Account</LuxuryButton>
      </form>

      <AuthDivider text="OR CONTINUE WITH" />
      <SocialAuthSection />
      
      <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/50" style={inter}>
        Already a member? <Link to="/login" className="text-[#D6B57A] hover:text-white transition-colors ml-1 border-b border-[#D6B57A]/30 pb-0.5">Sign In</Link>
      </p>
    </AuthLayout>
  )
}