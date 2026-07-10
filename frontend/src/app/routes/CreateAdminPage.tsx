import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthLayout, LuxuryInput, LuxuryButton } from './AuthUI';
import { OtpVerification } from '@/components/OtpVerification';

const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const;

export function CreateAdminPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ name: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setError('Invitation token is missing or invalid.');
    } else {
      setToken(urlToken);
      try {
        const decoded: { email: string } = jwtDecode(urlToken);
        setInvitedEmail(decoded.email);
      } catch (e) {
        setError('Invalid invitation token.');
      }
    }
  }, [searchParams]);

  const handleVerificationSuccess = () => {
    navigate('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const res = await fetch(`${API_URL}/auth/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create admin account.');
      }

      // Show OTP verification screen
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
return (
  <AuthLayout
    title="Invalid Invitation"
    subtitle="This invitation link is either invalid or has expired."
  >
    <div className="text-center text-white/70">
      Please request a new invitation.
    </div>
  </AuthLayout>
);
  }

  if (showOtp) {
    return (
      <AuthLayout title="Verify Your Email" subtitle="Enter the code sent to your inbox to become an admin.">
        <OtpVerification email={invitedEmail} onSuccess={handleVerificationSuccess} isAdminCreation={true} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Your Admin Account" subtitle="Complete your registration to access the dashboard.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <LuxuryInput label="Full Name" required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
        <LuxuryInput label="Password" type="password" required value={formData.password} onChange={(e: any) => setFormData({ ...formData, password: e.target.value })} />
        <LuxuryInput label="Confirm Password" type="password" required value={formData.confirm} onChange={(e: any) => setFormData({ ...formData, confirm: e.target.value })} />

        {error && <p className="text-red-400 text-xs text-center" style={inter}>{error}</p>}

        <LuxuryButton type="submit" loading={loading} className="mt-4">
          Create Account
        </LuxuryButton>
      </form>
    </AuthLayout>
  );
}