import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tag, Type, Percent, IndianRupee, ShoppingCart, Users, Calendar, ToggleLeft } from 'lucide-react';
import { useAdminCouponStore } from '@/store/adminCouponStore';
import { toast } from '../../layouts/toast';

type DiscountType = 'percentage' | 'fixed';
type StatusType   = 'Active' | 'Draft';

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-400">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center"><Icon size={15} className="text-[#D6B57A]" /></div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]';

export default function EditCoupon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { coupons, fetchCoupons, updateCoupon } = useAdminCouponStore();
  const coupon = coupons.find((c: any) => c.id === id);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder] = useState('2000');
  const [usageLimit, setUsageLimit] = useState('');
  const [perUser, setPerUser] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<StatusType>('Active');

  useEffect(() => {
    if (coupons.length === 0) fetchCoupons();
  }, [fetchCoupons, coupons.length]);

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code || '');
      setDescription(coupon.description || '');
      setDiscountType(coupon.discount?.includes('₹') ? 'fixed' : 'percentage');
      setDiscountValue(coupon.discount?.replace(/[^0-9]/g, '') || '');
      setMinOrder(coupon.minOrder?.toString() || '');
      setUsageLimit(coupon.limit === -1 ? '' : coupon.limit?.toString() || '');
      setStartDate(coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '');
      setExpiryDate(coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '');
      setStatus(coupon.status === 'Active' ? 'Active' : 'Draft');
    } else if (coupons.length > 0) {
      toast('Coupon not found');
      navigate('/admin/coupons');
    }
  }, [coupon, coupons.length, navigate]);

  async function handleUpdate() {
    if (!code || !discountValue || !minOrder) {
      toast('Please fill all required fields');
      return;
    }
    if (!id) return;
    try {
      await updateCoupon(id, {
        code,
        description,
        discountType,
        discountValue: Number(discountValue),
        minOrder: Number(minOrder),
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        perUser: Number(perUser),
        status
      });
      toast(`Coupon "${code}" updated successfully!`);
      navigate('/admin/coupons');
    } catch (err: any) {
      toast(err.message || 'Failed to update coupon');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
          <span className="mx-1">›</span>
          <Link to="/admin/coupons" className="hover:text-[#D6B57A]">Coupons</Link>
          <span className="mx-1">›</span>
          <span className="text-gray-600">Edit</span>
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-8">
            <Section icon={Tag} title="Basic Information">
              <Field label="Coupon Code" required>
                <div className="relative">
                  <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} className={`${inputCls} pr-10 font-mono tracking-widest`} />
                  <Type size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </Field>
              <Field label="Description" required>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </Field>
            </Section>

            <Section icon={Percent} title="Discount Settings">
              <Field label="Discount Type" required>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'percentage', label: 'Percentage (%)', icon: Percent }, { value: 'fixed', label: 'Fixed Amount (₹)', icon: IndianRupee }].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setDiscountType(opt.value as DiscountType)} className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${discountType === opt.value ? 'border-[#D6B57A] bg-amber-50 text-[#D6B57A]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      <opt.icon size={15} /> {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={discountType === 'percentage' ? 'Discount Value (%)' : 'Discount Value (₹)'} required>
                  <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Minimum Order Value (₹)" required>
                  <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className={inputCls} />
                </Field>
              </div>
            </Section>

            <Section icon={Users} title="Usage Rules">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Total Usage Limit">
                  <div className="relative"><ShoppingCart size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" /><input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} className={`${inputCls} pl-9`} /></div>
                </Field>
                <Field label="Per User Limit">
                  <div className="relative"><Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" /><input type="number" value={perUser} onChange={e => setPerUser(e.target.value)} className={`${inputCls} pl-9`} /></div>
                </Field>
              </div>
        </Section>

        <Section icon={Calendar} title="Validity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
            </Field>

            <Field label="Expiry Date">
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputCls} />
            </Field>
          </div>
            </Section>

            <Section icon={ToggleLeft} title="Status">
              <div className="flex gap-4">
                {(['Active', 'Draft'] as StatusType[]).map(s => (
                  <label key={s} className={`flex items-center gap-3 flex-1 border rounded-lg px-4 py-3 cursor-pointer ${status === s ? 'border-[#D6B57A] bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-[#D6B57A]" />
                    <p className={`text-sm font-medium ${status === s ? 'text-[#D6B57A]' : 'text-gray-700'}`}>{s}</p>
                  </label>
                ))}
              </div>
            </Section>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => navigate('/admin/coupons')} className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="px-6 py-2.5 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d]">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}