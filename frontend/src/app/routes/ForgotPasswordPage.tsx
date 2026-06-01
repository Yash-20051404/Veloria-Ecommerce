import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout, LuxuryInput, LuxuryButton } from './AuthUI'

const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout title="Email Sent" subtitle="Check your inbox.">
        <p className="text-center text-sm text-white/60 leading-relaxed mb-8" style={inter}>
          We have sent a password recovery link to <span className="text-white">{email}</span>. Please follow the instructions to regain access to your account.
        </p>
        <Link to="/login"><LuxuryButton>Return to Sign In</LuxuryButton></Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recover Access" subtitle="Enter your email to receive a reset link.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <LuxuryInput label="Email Address" type="email" required value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <LuxuryButton type="submit">Send Reset Link</LuxuryButton>
      </form>
      <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/50" style={inter}>
        Remembered your password? <Link to="/login" className="text-[#D6B57A] hover:text-white transition-colors ml-1 border-b border-[#D6B57A]/30">Sign In</Link>
      </p>
    </AuthLayout>
  )
}