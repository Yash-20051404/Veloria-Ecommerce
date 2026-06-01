import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout, LuxuryInput, LuxuryButton } from './AuthUI'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // API logic here
    navigate('/login')
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password below.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <LuxuryInput label="New Password" type="password" required value={password} onChange={(e: any) => setPassword(e.target.value)} />
        <LuxuryInput label="Confirm Password" type="password" required value={confirm} onChange={(e: any) => setConfirm(e.target.value)} />
        <LuxuryButton type="submit">Update Password</LuxuryButton>
      </form>
    </AuthLayout>
  )
}