import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout, LuxuryInput, LuxuryButton } from './AuthUI';

const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const;

export function InviteAdminPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuthStore.getState();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/admin/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send invitation.');
      }

      setSuccess(data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Invite New Admin" subtitle="Enter the email to send an invitation.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <LuxuryInput
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-400 text-xs text-center" style={inter}>{error}</p>}
        {success && <p className="text-green-400 text-xs text-center" style={inter}>{success}</p>}

        <LuxuryButton type="submit" loading={loading} className="mt-4">
          Send Invitation
        </LuxuryButton>
      </form>
    </AuthLayout>
  );
}