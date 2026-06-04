import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { toast } from '../../layouts/toast';

export default function AddProduct() {
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
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { addProduct, loading } = useProductStore();
  const navigate = useNavigate();

  // Handle image upload — convert file to preview URL
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Compress image to prevent MongoDB 16MB document limit error
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
          // Convert to JPEG with 70% quality to heavily reduce base64 size
          setImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.7)]);
        };
      };
    });
  }

  // Remove an image by index
  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  // Add a tag when user presses Enter or comma
  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function handleSaveDraft() {
    alert('Draft saved!');
  }

  async function handlePublish() {
    if (!productName || !description || !price || !stock) {
      toast('Please fill in Product Name, Description, Price and Stock before publishing.');
      return;
    }
    try {
      await addProduct({
        name: productName,
        description,
        category: category || 'Uncategorized',
        price: Number(price),
        stock: Number(stock),
        metal,
        purity,
        gemstone,
        occasion,
        weight: weight ? Number(weight) : undefined,
        sku,
        images: images.length > 0 ? images : ['https://via.placeholder.com/150']
      });
      toast('Product published successfully!');
      navigate('/admin/products');
    } catch (err: any) {
      toast(err.message || 'Failed to publish product');
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <Link to="/admin" className="hover:text-[#D6B57A]">Dashboard</Link>
            <span className="mx-1">›</span>
            <Link to="/admin/products" className="hover:text-[#D6B57A]">Products</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Add Product</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d] transition-colors"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* ── Main Grid: Left (big) + Right (small) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ════ LEFT COLUMN ════ */}
        <div className="xl:col-span-2 space-y-5">

          {/* 1. Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Royal Emerald Ring"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your jewellery product..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
              >
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

          {/* 2. Images */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Product Images</h2>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#D6B57A] hover:bg-amber-50 transition-colors">
              <Upload size={28} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Product ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-gray-100"
                    />
                    {/* First image = main image badge */}
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-[#D6B57A] text-white px-1.5 py-0.5 rounded font-medium">
                        Main
                      </span>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Pricing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Selling Price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="79999"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Compare Price (₹)
                </label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={e => setComparePrice(e.target.value)}
                  placeholder="99999"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={e => setCostPrice(e.target.value)}
                  placeholder="55000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                />
              </div>
            </div>

            {/* Profit preview */}
            {price && costPrice && Number(price) > Number(costPrice) && (
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
                Profit margin: ₹{(Number(price) - Number(costPrice)).toLocaleString('en-IN')}
                {' '}({Math.round(((Number(price) - Number(costPrice)) / Number(price)) * 100)}%)
              </div>
            )}
          </div>

          {/* 4. Jewellery Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Jewellery Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Metal Type</label>
                <select
                  value={metal}
                  onChange={e => setMetal(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                >
                  <option value="">Select metal</option>
                  <option>Gold</option>
                  <option>Rose Gold</option>
                  <option>White Gold</option>
                  <option>Silver</option>
                  <option>Platinum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purity</label>
                <select
                  value={purity}
                  onChange={e => setPurity(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                >
                  <option value="">Select purity</option>
                  <option>18 Karat</option>
                  <option>22 Karat</option>
                  <option>24 Karat</option>
                  <option>925 Sterling Silver</option>
                  <option>950 Platinum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gemstone</label>
                <select
                  value={gemstone}
                  onChange={e => setGemstone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                >
                  <option value="">Select gemstone</option>
                  <option>Diamond</option>
                  <option>Emerald</option>
                  <option>Ruby</option>
                  <option>Sapphire</option>
                  <option>Pearl</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occasion</label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                >
                  <option value="">Select occasion</option>
                  <option>Wedding</option>
                  <option>Engagement</option>
                  <option>Anniversary</option>
                  <option>Festival</option>
                  <option>Daily Wear</option>
                  <option>Gift</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (grams)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 5.2"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 5. SEO */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">SEO</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="e.g. Royal Emerald Ring — Veloria Jewels"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                placeholder="Short description for search engines..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{metaDesc.length}/160 characters</p>
            </div>
          </div>

        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="space-y-5">

          {/* 6. Inventory */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Inventory</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="e.g. VR-RNG-001"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="e.g. 10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
              />
            </div>

            {/* Stock status preview */}
            {stock !== '' && (
              <div className={`text-xs font-medium px-3 py-2 rounded-lg ${
                Number(stock) === 0
                  ? 'bg-red-50 text-red-600'
                  : Number(stock) <= 10
                  ? 'bg-orange-50 text-orange-600'
                  : 'bg-green-50 text-green-600'
              }`}>
                Status: {Number(stock) === 0 ? 'Out of Stock' : Number(stock) <= 10 ? 'Low Stock' : 'In Stock'}
              </div>
            )}
          </div>

          {/* 7. Product Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-gray-800">Product Status</h2>
            {['Active', 'Draft', 'Archived'].map(s => (
              <label key={s} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  defaultChecked={s === 'Draft'}
                  className="accent-[#D6B57A]"
                />
                <span className="text-sm text-gray-700">{s}</span>
              </label>
            ))}
          </div>

          {/* 8. Tags */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-gray-800">Tags</h2>

            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type and press Enter to add tag"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D6B57A] focus:ring-1 focus:ring-[#D6B57A] transition-colors"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-amber-50 text-[#D6B57A] border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400">Press Enter or comma after each tag</p>
          </div>

          {/* 9. Quick Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-gray-800">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="text-gray-700 font-medium truncate ml-4 max-w-[140px]">{productName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-gray-700">{category || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span className="text-gray-700">{price ? `₹${Number(price).toLocaleString('en-IN')}` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stock</span>
                <span className="text-gray-700">{stock || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Images</span>
                <span className="text-gray-700">{images.length} uploaded</span>
              </div>
            </div>
          </div>

          {/* Bottom action buttons repeated for convenience */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold bg-[#D6B57A] text-white rounded-lg hover:bg-[#c9a76d] transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
            <button
              onClick={handleSaveDraft}
              className="w-full py-2.5 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
