import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Gem, Truck, Receipt, Mail, Sliders, Save } from 'lucide-react';
import { toast } from '../../layouts/toast';
import { useAdminSettingsStore } from '@/store/adminSettingsStore';

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
          <Icon size={18} className="text-[#D6B57A]" />
        </div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, fullWidth }: {
  label: string; type?: string; value?: string | number; onChange?: (e: any) => void; placeholder?: string; fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors resize-none" />
      ) : type === 'select' ? (
        <select value={value} onChange={onChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors">
          <option value={value}>{value}</option>
          {label.includes('Items Per Page') && <><option>10</option><option>20</option><option>50</option></>}
          {label.includes('Currency') && <><option>INR (₹)</option><option>USD ($)</option></>}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors" />
      )}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked?: boolean; onChange?: () => void }) {
  return (
    <div className="flex items-center justify-between md:col-span-2 py-1">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <button onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#D6B57A]' : 'bg-gray-200'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { fetchSettings, updateSettings, loading } = useAdminSettingsStore();
  const [settings, setSettings] = useState(() => {
    return {
      storeName: 'Veloria Jewels', storeEmail: 'contact@veloria.in', phone: '+91 98765 43210', website: 'https://veloria.in',
      address: '123, Jewellery Quarter, Mumbai, Maharashtra - 400001', currency: 'INR (₹)', timezone: 'Asia/Kolkata (IST)',
      tagline: 'Timeless Elegance, Crafted for You', supportEmail: 'support@veloria.in', instagram: '@veloriajewels',
      facebook: 'facebook.com/veloriajewels', about: 'Veloria is a luxury jewellery brand crafting exquisite pieces for every occasion. We blend traditional artistry with modern design to create timeless collections.',
      freeShippingThreshold: '5000', standardShipping: '199', expressShipping: '499', deliveryDays: '5–7',
      enableFreeShipping: true, enableCod: true, gstNumber: '27AABCV1234A1Z5', gstRate: '3', taxDisplay: 'Inclusive of Tax',
      hsnCode: '7113', applyGst: true, showTaxInvoice: true, orderConfEmail: true, shippingEmail: true, deliveryEmail: true,
      lowStockEmail: true, promoEmail: false, itemsPerPage: '10', adminCurrency: 'INR (₹)', darkMode: false,
      lowStockDash: true, twoFactor: false, weeklyReport: true
    };
  });

  useEffect(() => {
    fetchSettings().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    });
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      toast('Settings saved successfully!');
    } catch (err: any) {
      toast(err.message || 'Failed to save settings');
    }
  };

  const update = (key: string, val: any) => setSettings((p: any) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
          <span className="mx-1">›</span>
          <span className="text-gray-600">Settings</span>
        </p>
      </div>

      <Section icon={Store} title="Store Information">
        <Field label="Store Name" value={settings.storeName} onChange={e => update('storeName', e.target.value)} />
        <Field label="Store Email" type="email" value={settings.storeEmail} onChange={e => update('storeEmail', e.target.value)} />
        <Field label="Phone Number" value={settings.phone} onChange={e => update('phone', e.target.value)} />
        <Field label="Website URL" value={settings.website} onChange={e => update('website', e.target.value)} />
        <Field label="Address" fullWidth value={settings.address} onChange={e => update('address', e.target.value)} />
        <Field label="Currency" type="select" value={settings.currency} onChange={e => update('currency', e.target.value)} />
        <Field label="Timezone" type="select" value={settings.timezone} onChange={e => update('timezone', e.target.value)} />
      </Section>

      <Section icon={Gem} title="Brand Information">
        <Field label="Brand Tagline" value={settings.tagline} onChange={e => update('tagline', e.target.value)} />
        <Field label="Support Email" type="email" value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} />
        <Field label="Social — Instagram" value={settings.instagram} onChange={e => update('instagram', e.target.value)} />
        <Field label="Social — Facebook" value={settings.facebook} onChange={e => update('facebook', e.target.value)} />
        <Field label="About Store" type="textarea" fullWidth value={settings.about} onChange={e => update('about', e.target.value)} />
      </Section>

      <Section icon={Truck} title="Shipping Settings">
        <Field label="Free Shipping Threshold (₹)" value={settings.freeShippingThreshold} onChange={e => update('freeShippingThreshold', e.target.value)} />
        <Field label="Standard Shipping Rate (₹)" value={settings.standardShipping} onChange={e => update('standardShipping', e.target.value)} />
        <Field label="Express Shipping Rate (₹)" value={settings.expressShipping} onChange={e => update('expressShipping', e.target.value)} />
        <Field label="Estimated Delivery Days" value={settings.deliveryDays} onChange={e => update('deliveryDays', e.target.value)} />
        <Toggle label="Enable Free Shipping" sub="Apply free shipping when threshold is met" checked={settings.enableFreeShipping} onChange={() => update('enableFreeShipping', !settings.enableFreeShipping)} />
        <Toggle label="Enable Cash on Delivery" sub="Allow COD payment option" checked={settings.enableCod} onChange={() => update('enableCod', !settings.enableCod)} />
      </Section>

      <Section icon={Receipt} title="Tax Settings">
        <Field label="GST Number" value={settings.gstNumber} onChange={e => update('gstNumber', e.target.value)} />
        <Field label="GST Rate (%)" value={settings.gstRate} onChange={e => update('gstRate', e.target.value)} />
        <Field label="Tax Display" type="select" value={settings.taxDisplay} onChange={e => update('taxDisplay', e.target.value)} />
        <Field label="HSN Code" value={settings.hsnCode} onChange={e => update('hsnCode', e.target.value)} />
        <Toggle label="Apply GST on All Products" checked={settings.applyGst} onChange={() => update('applyGst', !settings.applyGst)} />
        <Toggle label="Show Tax Breakdown on Invoice" checked={settings.showTaxInvoice} onChange={() => update('showTaxInvoice', !settings.showTaxInvoice)} />
      </Section>

      <Section icon={Mail} title="Email Notifications">
        <Toggle label="Order Confirmation Email" sub="Send email when order is placed" checked={settings.orderConfEmail} onChange={() => update('orderConfEmail', !settings.orderConfEmail)} />
        <Toggle label="Shipping Notification" sub="Send email when order is shipped" checked={settings.shippingEmail} onChange={() => update('shippingEmail', !settings.shippingEmail)} />
        <Toggle label="Delivery Confirmation" sub="Send email when order is delivered" checked={settings.deliveryEmail} onChange={() => update('deliveryEmail', !settings.deliveryEmail)} />
        <Toggle label="Low Stock Alert Email" sub="Notify admin when stock is low" checked={settings.lowStockEmail} onChange={() => update('lowStockEmail', !settings.lowStockEmail)} />
        <Toggle label="Promotional Emails" sub="Send discount and offer emails" checked={settings.promoEmail} onChange={() => update('promoEmail', !settings.promoEmail)} />
      </Section>

      <Section icon={Sliders} title="Admin Preferences">
        <Field label="Items Per Page" type="select" value={settings.itemsPerPage} onChange={e => update('itemsPerPage', e.target.value)} />
        <Field label="Default Currency" type="select" value={settings.adminCurrency} onChange={e => update('adminCurrency', e.target.value)} />
        <Toggle label="Enable Dark Mode" sub="Switch to dark theme (coming soon)" checked={settings.darkMode} onChange={() => update('darkMode', !settings.darkMode)} />
        <Toggle label="Show Low Stock Alerts on Dashboard" checked={settings.lowStockDash} onChange={() => update('lowStockDash', !settings.lowStockDash)} />
        <Toggle label="Enable Two-Factor Authentication" sub="Extra security for your account" checked={settings.twoFactor} onChange={() => update('twoFactor', !settings.twoFactor)} />
        <Toggle label="Weekly Sales Report Email" sub="Receive summary every Monday" checked={settings.weeklyReport} onChange={() => update('weeklyReport', !settings.weeklyReport)} />
      </Section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-[#D6B57A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#c9a76d] transition-colors shadow-sm disabled:opacity-70">
          <Save size={17} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
