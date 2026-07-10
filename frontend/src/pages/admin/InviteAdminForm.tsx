import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/layouts/toast';
import { Mail } from 'lucide-react';

export function InviteAdminForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore.getState();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      toast(data.message, "success");
      setEmail('');
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Invite New Admin</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-gray-500">Enter the email address of the user you want to invite as an administrator. They will receive an email with a link to create their account.</p>
            <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="email"
                    placeholder="new.admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]"
                />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#D6B57A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#c9a76d] transition-colors disabled:opacity-70">
                {loading ? 'Sending...' : 'Send Invitation'}
            </button>
        </form>
    </div>
  );
}