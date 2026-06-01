import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { AuthLayout, LuxuryInput, LuxuryButton, SocialAuthSection, AuthDivider } from './AuthUI'

const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData)
      // Navigation is handled implicitly by GuestRoute, but we can safely fallback
      navigate('/') 
    } catch (err) {
      // Error is handled in store
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Continue your luxury journey.">
      <div className="flex flex-col">
        <SocialAuthSection />
        
        <AuthDivider text="OR CONTINUE WITH EMAIL" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" onChange={clearError}>
        <LuxuryInput 
          label="Email Address" type="email" required 
          value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})}
        />
        <LuxuryInput 
          label="Password" type="password" required 
          value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})}
        />
        
        <div className="flex items-center justify-between mt-2" style={inter}>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="hidden" checked={formData.remember} onChange={(e) => setFormData({...formData, remember: e.target.checked})} />
            <div className={`flex h-4 w-4 items-center justify-center border transition-colors ${formData.remember ? 'border-[#D6B57A] bg-[#D6B57A]' : 'border-white/30 bg-transparent group-hover:border-white/60'}`}>
              {formData.remember && <div className="h-2 w-2 bg-black" />}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest text-[#D6B57A] hover:text-white transition-colors">Forgot Password?</Link>
        </div>

        {error && <p className="text-red-400 text-xs text-center mt-2" style={inter}>{error}</p>}

        <LuxuryButton type="submit" loading={loading} className="mt-4">Sign In</LuxuryButton>
      </form>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/50" style={inter}>
        New to Veloria? <Link to="/register" className="text-[#D6B57A] hover:text-white transition-colors ml-1 border-b border-[#D6B57A]/30 pb-0.5">Create an Account</Link>
      </p>
    </AuthLayout>
  )
}