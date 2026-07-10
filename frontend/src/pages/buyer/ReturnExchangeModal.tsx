import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, Package } from 'lucide-react';

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const;
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const getAuthToken = () => {
  let token = localStorage.getItem('token');
  if (token) return token;
  const storage = localStorage.getItem('veloria-auth-storage');
  if (storage) {
    try { return JSON.parse(storage).state?.token || ''; } catch(e) {}
  }
  return '';
};

const RETURN_REASONS = [
  'Wrong Size',
  'Damaged Product',
  'Incorrect Item',
  'Changed Mind',
  'Other'
];

interface ReturnExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  requestType: 'RETURN' | 'EXCHANGE';
}

export default function ReturnExchangeModal({ isOpen, onClose, order, requestType }: ReturnExchangeModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [exchangeVariant, setExchangeVariant] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setError('');
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      const orderId = order._id || order.id;
      const items = (order.items || order.order_items || []).map((item: any) => ({
        productId: item.productId || item._id || item.id,
        productName: item.name || item.product_name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0
      }));

      // Upload images first if any (direct to Cloudinary)
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        if (cloudName) {
          for (const img of images) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', img);
            uploadFormData.append('upload_preset', 'veloria_returns');
            
            try {
              const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: uploadFormData
              });
              const uploadData = await uploadRes.json();
              if (uploadData.secure_url) {
                imageUrls.push(uploadData.secure_url);
              }
            } catch {
              // If upload fails, still continue without images
            }
          }
        }
      }

      const res = await fetch(`${API_URL}/returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          items,
          reason,
          requestType,
          description,
          images: imageUrls,
          exchangeVariant: requestType === 'EXCHANGE' ? exchangeVariant : undefined
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit request. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const title = requestType === 'RETURN' ? 'Return Request' : 'Exchange Request';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] border border-[#D6B57A]/20 bg-[#0A0A0A] shadow-[0_0_60px_rgba(214,181,122,0.1)] p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {success ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl text-white mb-2" style={cormorant}>Request Submitted</h3>
              <p className="text-sm text-white/60" style={inter}>
                Your {requestType === 'RETURN' ? 'return' : 'exchange'} request has been submitted successfully.
                We will review it shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#D6B57A]" style={inter}>
                  Maison Service
                </p>
                <h2 className="text-3xl text-white" style={cormorant}>{title}</h2>
                <p className="mt-2 text-xs text-white/50" style={inter}>
                  Order #{order?.orderId || (order?._id || order?.id || '').substring(0, 8)}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400" style={inter}>{error}</p>
                </div>
              )}

              {/* Reason */}
              <div className="mb-6">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  Reason <span className="text-red-400">*</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {RETURN_REASONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`border px-4 py-3 text-left text-xs transition-all duration-300 ${
                        reason === r
                          ? 'border-[#D6B57A] bg-[#D6B57A]/10 text-[#D6B57A]'
                          : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                      style={inter}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  Description <span className="text-white/40">(Optional)</span>
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Please describe the issue..."
                  className="w-full border border-white/10 bg-transparent p-4 text-sm text-white placeholder-white/30 focus:border-[#D6B57A] focus:outline-none resize-none"
                  style={inter}
                />
              </div>

              {/* Exchange variant */}
              {requestType === 'EXCHANGE' && (
                <div className="mb-6">
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                    New Size / Variant
                  </p>
                  <input
                    type="text"
                    value={exchangeVariant}
                    onChange={(e) => setExchangeVariant(e.target.value)}
                    placeholder="e.g., Size 7, Rose Gold"
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-white placeholder-white/30 focus:border-[#D6B57A] focus:outline-none"
                    style={inter}
                  />
                </div>
              )}

              {/* Images */}
              <div className="mb-8">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>
                  Upload Images <span className="text-white/40">(Optional, max 5)</span>
                </p>
                
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative h-20 w-20 overflow-hidden border border-white/10">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-white/20 p-4 text-xs text-white/50 hover:border-[#D6B57A]/40 hover:text-white/70 transition-colors" style={inter}>
                  <Upload className="h-4 w-4" />
                  Choose images (up to 5)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Order summary */}
              <div className="mb-8 rounded-xl border border-[#D6B57A]/10 bg-[#050505] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-[#D6B57A]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Order Items</span>
                </div>
                {(order.items || order.order_items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-white" style={cormorant}>{item.name || item.product_name}</p>
                      <p className="text-[10px] text-white/40" style={inter}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs text-white/60" style={inter}>₹{(item.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#D6B57A] py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-black transition-all hover:bg-white disabled:opacity-50"
                style={inter}
              >
                {loading ? 'Submitting...' : `Submit ${requestType === 'RETURN' ? 'Return' : 'Exchange'} Request`}
              </button>

              <p className="mt-4 text-center text-[9px] text-white/30 uppercase tracking-widest" style={inter}>
                Our concierge team will review your request within 24-48 hours.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}