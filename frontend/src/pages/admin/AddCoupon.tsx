import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tag, Type, AlignLeft, Percent, IndianRupee,
  ShoppingCart, Users, Calendar, ToggleLeft, Copy, CheckCircle,
} from 'lucide-react';
import { useAdminCouponStore } from '@/store/adminCouponStore';

// ── Types ────────────────────────────────────────────────────────────────────
type DiscountType = 'percentage' | 'fixed';
type StatusType   = 'Active' | 'Draft';

// ── Small reusable field wrapper ──────────────────────────────────────────────
function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 ' +
  'outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors';

// ── Section heading ───────────────────────────────────────────────────────────
function Section({
  icon: Icon, title, children,
}: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
          <Icon size={15} className="text-[#D6B57A]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddCoupon() {
  const navigate = useNavigate();

  // form state
  const [code, setCode]                 = useState('VELORIA10');
  const [description, setDescription]   = useState('Flat 10% off on all orders');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrder, setMinOrder]         = useState('2000');
  const [maxDiscount, setMaxDiscount]   = useState('');
  const [usageLimit, setUsageLimit]     = useState('500');
  const [perUser, setPerUser]           = useState('1');
  const [startDate, setStartDate]       = useState('2025-06-01');
  const [expiryDate, setExpiryDate]     = useState('2026-06-30');
  const [status, setStatus]             = useState<StatusType>('Active');
  const [copied, setCopied]             = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const { addCoupon } = useAdminCouponStore();

  // ── Derived preview values ──────────────────────────────────────────────────
  const previewCode    = code.trim().toUpperCase() || 'COUPONCODE';
  const previewDiscount =
    discountType === 'percentage'
      ? `${discountValue || '0'}% OFF`
      : `₹${Number(discountValue || 0).toLocaleString('en-IN')} OFF`;
  const previewMin    = minOrder ? `₹${Number(minOrder).toLocaleString('en-IN')}` : '—';
  const previewExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  // ── Copy code to clipboard ──────────────────────────────────────────────────
  function copyCode() {
    navigator.clipboard.writeText(previewCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e: Record<string, string> = {};
    if (!code.trim())          e.code          = 'Coupon code is required.';
    if (!description.trim())   e.description   = 'Description is required.';
    if (!discountValue || Number(discountValue) <= 0)
                               e.discountValue = 'Enter a valid discount value.';
    if (discountType === 'percentage' && Number(discountValue) > 100)
                               e.discountValue = 'Percentage cannot exceed 100.';
    if (!minOrder || Number(minOrder) < 0)
                               e.minOrder      = 'Enter a valid minimum order value.';
    if (expiryDate && startDate && expiryDate < startDate)
                               e.expiryDate    = 'Expiry date must be after start date.';
    return e;
  }

  async function handleCreate() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    try {
      await addCoupon({
        code: previewCode,
        description,
        discountType,
        discountValue: Number(discountValue),
        minOrder: Number(minOrder),
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        perUser: perUser ? Number(perUser) : 1,
        status
      });
      alert(`Coupon "${previewCode}" created successfully!`);
      navigate('/admin/coupons');
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon');
    }
  }

  function handleCancel() {
    navigate('/admin/coupons');
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Coupon</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
          <span className="mx-1">›</span>
          <Link to="/admin/coupons" className="hover:text-[#D6B57A]">Coupons</Link>
          <span className="mx-1">›</span>
          <span className="text-gray-600">Add Coupon</span>
        </p>
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Left: form ────────────────────────────────────────────────────── */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-8">

            {/* 1. Basic Information */}
            <Section icon={Tag} title="Basic Information">
              <Field label="Coupon Code" required hint="Customers will enter this at checkout. Use uppercase letters.">
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. VELORIA10"
                    className={`${inputCls} pr-10 font-mono tracking-widest`}
                  />
                  <Type size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
              </Field>

              <Field label="Description" required hint="Shown to admin in the coupons list.">
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Flat 10% off on all orders"
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </Field>
            </Section>

            {/* 2. Discount Settings */}
            <Section icon={Percent} title="Discount Settings">
              {/* Discount type toggle */}
              <Field label="Discount Type" required>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'percentage', label: 'Percentage (%)', icon: Percent },
                    { value: 'fixed',      label: 'Fixed Amount (₹)', icon: IndianRupee },
                  ] as { value: DiscountType; label: string; icon: React.ElementType }[]).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDiscountType(opt.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        discountType === opt.value
                          ? 'border-[#D6B57A] bg-amber-50 text-[#D6B57A]'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <opt.icon size={15} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field
                  label={discountType === 'percentage' ? 'Discount Value (%)' : 'Discount Value (₹)'}
                  required
                >
                  <input
                    type="number"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? '10' : '500'}
                    min={0}
                    max={discountType === 'percentage' ? 100 : undefined}
                    className={inputCls}
                  />
                  {errors.discountValue && <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>}
                </Field>

                <Field label="Minimum Order Value (₹)" required>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={e => setMinOrder(e.target.value)}
                    placeholder="2000"
                    min={0}
                    className={inputCls}
                  />
                  {errors.minOrder && <p className="text-xs text-red-500 mt-1">{errors.minOrder}</p>}
                </Field>

                <Field label="Maximum Discount (₹)" hint="Optional cap on discount amount.">
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(e.target.value)}
                    placeholder="Leave blank for no cap"
                    min={0}
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            {/* 3. Usage Rules */}
            <Section icon={Users} title="Usage Rules">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Total Usage Limit" hint="Leave blank for unlimited uses.">
                  <div className="relative">
                    <ShoppingCart size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={e => setUsageLimit(e.target.value)}
                      placeholder="e.g. 500"
                      min={1}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Per User Limit" hint="How many times one customer can use this.">
                  <div className="relative">
                    <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="number"
                      value={perUser}
                      onChange={e => setPerUser(e.target.value)}
                      placeholder="e.g. 1"
                      min={1}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            {/* 4. Validity */}
            <Section icon={Calendar} title="Validity">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Start Date">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Expiry Date">
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className={inputCls}
                  />
                  {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                </Field>
              </div>
            </Section>

            {/* 5. Status */}
            <Section icon={ToggleLeft} title="Status">
              <div className="flex gap-4">
                {(['Active', 'Draft'] as StatusType[]).map(s => (
                  <label
                    key={s}
                    className={`flex items-center gap-3 flex-1 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                      status === s
                        ? 'border-[#D6B57A] bg-amber-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="accent-[#D6B57A]"
                    />
                    <div>
                      <p className={`text-sm font-medium ${status === s ? 'text-[#D6B57A]' : 'text-gray-700'}`}>{s}</p>
                      <p className="text-xs text-gray-400">
                        {s === 'Active' ? 'Coupon is live immediately' : 'Save without activating'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-6 py-2.5 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d] transition-colors"
              >
                Create Coupon
              </button>
            </div>

          </div>
        </div>

        {/* ── Right: live preview ───────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Preview card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Live Preview</h3>

            {/* Coupon ticket */}
            <div className="relative border-2 border-dashed border-[#D6B57A] rounded-xl overflow-hidden">
              {/* Gold header strip */}
              <div className="bg-[#D6B57A] px-5 py-4 flex items-center justify-between">
                <span className="font-mono font-bold text-xl tracking-widest text-white">
                  {previewCode}
                </span>
                <button
                  onClick={copyCode}
                  title="Copy code"
                  className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-xs"
                >
                  {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 bg-amber-50 space-y-3">
                {/* Discount badge */}
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#D6B57A] rounded-full px-3 py-1">
                  {discountType === 'percentage'
                    ? <Percent size={13} className="text-[#D6B57A]" />
                    : <IndianRupee size={13} className="text-[#D6B57A]" />
                  }
                  <span className="text-sm font-bold text-[#D6B57A]">{previewDiscount}</span>
                </div>

                <p className="text-xs text-gray-500 italic leading-relaxed">
                  {description || 'No description added yet.'}
                </p>

                {/* Details rows */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Minimum Order</span>
                    <span className="font-semibold text-gray-700">{previewMin}</span>
                  </div>

                  {maxDiscount && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Max Discount</span>
                      <span className="font-semibold text-gray-700">
                        ₹{Number(maxDiscount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Usage Limit</span>
                    <span className="font-semibold text-gray-700">{usageLimit || '∞'}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Per User</span>
                    <span className="font-semibold text-gray-700">{perUser || '1'} use</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Expires</span>
                    <span className="font-semibold text-gray-700">{previewExpiry}</span>
                  </div>
                </div>

                {/* Status pill */}
                <div className="pt-1">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {status}
                  </span>
                </div>
              </div>

              {/* Notch effect — left & right */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full border-r-2 border-[#D6B57A]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full border-l-2 border-[#D6B57A]" />
            </div>

            <p className="text-xs text-gray-400 text-center">Preview updates as you type</p>
          </div>

          {/* Quick tips */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Tips</h3>
            <ul className="space-y-2 text-xs text-gray-500 list-none">
              {[
                'Use short memorable codes like VELORIA10 or DIWALI25.',
                'Set a minimum order to protect margins on low-value orders.',
                'Cap percentage discounts with a max discount amount.',
                'Per-user limit of 1 prevents coupon abuse.',
                'Set status to Draft to schedule a coupon for later.',
              ].map(tip => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6B57A]" />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
