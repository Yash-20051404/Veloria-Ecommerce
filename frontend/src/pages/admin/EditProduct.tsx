import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { toast } from '../../layouts/toast';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, fetchProducts, updateProduct, loading } = useProductStore();
  
  const product = products.find(p => p.id === id);

  // --- Form State ---
  const [images, setImages] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [weight, setWeight] = useState('');
  const [metal, setMetal] = useState('');
  const [purity, setPurity] = useState('');
  const [gemstone, setGemstone] = useState('');
  const [occasion, setOccasion] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (product) {
      setImages(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []));
      setProductName(product.name || '');
      setDescription(product.description || '');
      setCategory(product.category || '');
      setPrice(product.price?.toString() || '');
      setSku(product.sku || '');
      setStock(product.stock?.toString() || '');
      setWeight(product.weight?.toString() || '');
      setMetal(product.metal || '');
      setPurity(product.purity || '');
      setGemstone(product.gemstone || '');
      setOccasion(product.occasion || '');
      setStatus(product.status === 'Active' ? 'Active' : 'Draft');
    } else if (products.length > 0) {
      toast('Product not found');
      navigate('/admin/products');
    }
  }, [product, products.length, navigate]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > 800) {
            height = Math.round(height * (800 / width));
            width = 800;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
          setImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.7)]);
        };
      };
    });
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!productName || !description || !price || !stock) {
      toast('Please fill in Product Name, Description, Price and Stock before saving.');
      return;
    }
    if (!id) return;
    try {
      await updateProduct(id, {
        name: productName,
        description,
        category: category || 'Uncategorized',
        price: Number(price),
        stock: Number(stock),
        metal,
        purity,
        gemstone,
        occasion,
        status,
        weight: weight ? Number(weight) : undefined,
        sku,
        images: images.length > 0 ? images : ['https://via.placeholder.com/150']
      });
      toast('Product updated successfully!');
      navigate('/admin/products');
    } catch (err: any) {
      toast(err.message || 'Failed to update product');
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <Link to="/admin/products" className="hover:text-[#D6B57A]">Products</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Edit Product</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d] transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-400">*</span></label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-400">*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]">
                <option value="">Select a category</option>
                <option>Rings</option>
                <option>Necklaces</option>
                <option>Earrings</option>
                <option>Bracelets</option>
                <option>Bangles</option>
                <option>Pendants</option>
                <option>Anklets</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Product Images</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#D6B57A]">
              <Upload size={28} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="preview" className="w-full aspect-square object-cover rounded-lg border border-gray-100" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Selling Price (₹) <span className="text-red-400">*</span></label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare Price (₹)</label>
                <input type="number" value={comparePrice} onChange={e => setComparePrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Price (₹)</label>
                <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Jewellery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Metal Type</label>
                <select value={metal} onChange={e => setMetal(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]">
                  <option value="">Select metal</option><option>Yellow Gold</option><option>Rose Gold</option><option>White Gold</option><option>Silver</option><option>Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purity</label>
                <select value={purity} onChange={e => setPurity(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]">
                  <option value="">Select purity</option><option>18K</option><option>22K</option><option>24K</option><option>925</option><option>950</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gemstone</label>
                <select value={gemstone} onChange={e => setGemstone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]">
                  <option value="">Select gemstone</option><option>Diamond</option><option>Emerald</option><option>Ruby</option><option>Sapphire</option><option>Pearl</option><option>Onyx</option><option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occasion</label>
                <select value={occasion} onChange={e => setOccasion(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]">
                  <option value="">Select occasion</option><option>Wedding</option><option>Engagement</option><option>Anniversary</option><option>Festival</option><option>Daily Wear</option><option>Luxury Event</option><option>Gift</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (grams)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU Code</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity <span className="text-red-400">*</span></label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6B57A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-gray-800">Product Status</h2>
            {['Active', 'Draft', 'Archived'].map(s => (
              <label key={s} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={status === s} onChange={() => setStatus(s)} className="accent-[#D6B57A]" />
                <span className="text-sm text-gray-700">{s}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleSave} disabled={loading} className="w-full py-2.5 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d] transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}