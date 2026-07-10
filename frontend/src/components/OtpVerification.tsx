import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface OtpVerificationProps {
  email: string;
  onSuccess?: () => void;
  isAdminCreation?: boolean; // Add this prop
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onSuccess, isAdminCreation = false }) => {
  const [otp, setOtp] = useState('')
  const { verifyEmail, loading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try { // The verifyEmail function in the store handles both regular and admin verification
      await verifyEmail(email, otp)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      // Error is caught and stored in `useAuthStore`
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-light mb-2 text-center text-gray-900 tracking-wide">VERIFY EMAIL</h2>
      <p className="text-gray-500 mb-6 text-center text-sm">
        We've sent a 6-digit security code to <span className="font-semibold text-gray-800">{email}</span>.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="------"
            required
            className="w-full border-b-2 border-gray-300 focus:border-black outline-none p-2 text-center text-3xl tracking-[1em] transition-colors"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-black text-white font-medium py-3 px-4 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors uppercase tracking-widest text-sm"
        >
          {loading ? 'Verifying...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  )
}