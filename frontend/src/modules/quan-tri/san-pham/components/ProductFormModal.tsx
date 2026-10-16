'use client';
import React, { useState, useEffect } from "react";
import { X, Award, Tag } from "lucide-react";
import { notifications } from "@mantine/notifications";

import ProductCategoryCascade from "./form/ProductCategoryCascade";
import ProductColorSelector, { ColorOption } from "./form/ProductColorSelector";
import ProductSizeSelector from "./form/ProductSizeSelector";
import ProductImageUploader from "./form/ProductImageUploader";
import ProductVariantMatrix, { ProductVariantItem } from "./form/ProductVariantMatrix";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedProduct?: any) => void;
  editingProduct?: any | null;
}

const DEFAULT_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Yonex', 'Lining', 'Mizuno', 'Kamito', 'Victor', 'Asics', 'Under Armour', 'Decathlon'
];

const DEFAULT_COLORS: ColorOption[] = [
  { name: 'Đen', hex: '#111827' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Đỏ', hex: '#EF4444' },
  { name: 'Xanh Dương', hex: '#2563EB' },
  { name: 'Xanh Navy', hex: '#1E3A8A' },
  { name: 'Xanh Lá', hex: '#10B981' },
  { name: 'Xám', hex: '#6B7280' },
  { name: 'Vàng', hex: '#F59E0B' },
  { name: 'Cam', hex: '#F97316' },
  { name: 'Hồng', hex: '#EC4899' },
  { name: 'Tím', hex: '#8B5CF6' },
];

export default function ProductFormModal({ isOpen, onClose, onSuccess, editingProduct }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    price: 0,
    image_url: "",
    stock: 100,
    rating: 0,
    reviews_count: 0,
    category: [] as string[],
    brand: "",
    gender: "Unisex",
    product_type: "",
    sport_type: "",
    sizes: [] as string[],
    colors: [] as string[],
    variants: [] as ProductVariantItem[],
    description: "",
    images: [] as string[],
  });

  const [availableBrands, setAvailableBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [availableShoeSizes, setAvailableShoeSizes] = useState<string[]>([]);
  const [availableClothingSizes, setAvailableClothingSizes] = useState<string[]>([]);
  const [availableSportSpecs, setAvailableSportSpecs] = useState<string[]>([]);
  const [menuSports, setMenuSports] = useState<any[]>([]);
  const [activeSizeCategory, setActiveSizeCategory] = useState<'shoe' | 'clothing' | 'spec'>('clothing');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttributes();
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/menu');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMenuSports(data);
          return;
        }
      }
    } catch {
      console.warn("Could not fetch menu from API");
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/attributes');
      if (res.ok) {
        const data = await res.json();
        setAvailableBrands(data.brands || DEFAULT_BRANDS);
        setAvailableColors(data.colors || DEFAULT_COLORS);
        setAvailableShoeSizes(data.shoe_sizes || ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']);
        setAvailableClothingSizes(data.clothing_sizes || ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']);
        setAvailableSportSpecs(data.sport_specs || []);
        return;
      }
    } catch {
      console.warn("Could not fetch attributes from API, reading from LocalStorage");
    }

    const savedBrands = localStorage.getItem('admin_brands');
    if (savedBrands) setAvailableBrands(JSON.parse(savedBrands));
    const savedDetailedColors = localStorage.getItem('admin_colors_detailed');
    if (savedDetailedColors) setAvailableColors(JSON.parse(savedDetailedColors));
    const savedShoes = localStorage.getItem('admin_shoe_sizes');
    if (savedShoes) setAvailableShoeSizes(JSON.parse(savedShoes));
    const savedClothes = localStorage.getItem('admin_clothing_sizes');
    if (savedClothes) setAvailableClothingSizes(JSON.parse(savedClothes));
    const savedSpecs = localStorage.getItem('admin_sport_specs');
    if (savedSpecs) setAvailableSportSpecs(JSON.parse(savedSpecs));
  };

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        product_id: editingProduct.product_id || "",
        name: editingProduct.name || "",
        price: editingProduct.price || 0,
        image_url: editingProduct.image_url || "",
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 100,
        rating: editingProduct.rating !== undefined ? editingProduct.rating : 0,
        reviews_count: editingProduct.reviews_count !== undefined ? editingProduct.reviews_count : 0,
        brand: editingProduct.brand || "",
        gender: editingProduct.gender || "Unisex",
        product_type: editingProduct.product_type || "",
        sport_type: editingProduct.sport_type || "",
        category: Array.isArray(editingProduct.category) ? editingProduct.category : (editingProduct.category ? [editingProduct.category] : []),
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes : (editingProduct.sizes ? [editingProduct.sizes] : []),
        colors: Array.isArray(editingProduct.colors) ? editingProduct.colors : (editingProduct.colors ? [editingProduct.colors] : []),
        variants: Array.isArray(editingProduct.variants) ? editingProduct.variants : [],
        description: editingProduct.description || "",
        images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0
          ? editingProduct.images
          : (editingProduct.image_url ? [editingProduct.image_url] : []),
      });

      if (editingProduct.product_type === 'Giày dép') setActiveSizeCategory('shoe');
      else if (editingProduct.product_type === 'Thiết bị') setActiveSizeCategory('spec');
      else setActiveSizeCategory('clothing');
    } else {
      setFormData({
        product_id: "",
        name: "",
        price: 0,
        image_url: "",
        stock: 100,
        rating: 0,
        reviews_count: 0,
        brand: availableBrands[0] || "Nike",
        gender: "Unisex",
        product_type: "Quần áo",
        sport_type: "Đá bóng",
        category: [],
        sizes: [],
        colors: [],
        variants: [],
        description: "",
        images: [],
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const toggleColor = (colorName: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter(c => c !== colorName)
        : [...prev.colors, colorName]
    }));
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.product_id}`
        : `${API_URL}/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedProduct = await res.json().catch(() => null);
        notifications.show({
          title: "Thành công",
          message: editingProduct ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!",
          color: "green",
        });
        onSuccess(savedProduct);
      } else {
        const errorData = await res.json();
        notifications.show({
          title: "Lỗi",
          message: errorData.detail || "Không thể lưu sản phẩm",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Lỗi kết nối tới máy chủ",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Thể Thao Mới"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Nhập đầy đủ thông tin chuẩn thể thao và lưu kho</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="p-8 overflow-y-auto w-full">
          <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

            {/* Row 1: ID & Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã Sản phẩm (ASIN)</label>
                <input
                  type="text"
                  disabled={!!editingProduct}
                  value={formData.product_id}
                  onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm disabled:bg-gray-100 font-mono"
                  placeholder="Tự sinh nếu để trống"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Sản phẩm *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ví dụ: Giày Đá Bóng Nike Mercurial Vapor 15..."
                />
              </div>
            </div>

            {/* Row 2: Brand & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Award size={16} className="text-blue-600" />
                  Thương hiệu (Brand)
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Hoặc nhập khác..."
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Tag size={16} className="text-blue-600" />
                  Đối tượng (Giới tính)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Nam', 'Nữ', 'Unisex', 'Trẻ em'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${formData.gender === g
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Số lượng tồn kho *</span>
                  {formData.variants.length > 0 && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Tự tính từ Ma trận phân loại
                    </span>
                  )}
                </label>
                <input
                  required
                  type="number"
                  value={formData.stock}
                  readOnly={formData.variants.length > 0}
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold outline-none transition-all ${formData.variants.length > 0
                      ? 'bg-gray-100 text-blue-700 font-bold cursor-not-allowed border-blue-200'
                      : 'focus:ring-2 focus:ring-blue-500'
                    }`}
                />
              </div>
            </div>

            {/* Row 4: Sport Type, Product Type & Subcategories (Extracted Component) */}
            <ProductCategoryCascade
              sportType={formData.sport_type}
              productType={formData.product_type}
              selectedCategories={formData.category}
              menuSports={menuSports}
              onChangeSport={(sport, firstPT) => {
                setFormData(prev => ({ ...prev, sport_type: sport, product_type: firstPT, category: [] }));
                if (firstPT === 'Giày dép') setActiveSizeCategory('shoe');
                else if (firstPT === 'Thiết bị') setActiveSizeCategory('spec');
                else setActiveSizeCategory('clothing');
              }}
              onChangeProductType={(pt) => {
                setFormData(prev => ({ ...prev, product_type: pt, category: [] }));
                if (pt === 'Giày dép') setActiveSizeCategory('shoe');
                else if (pt === 'Thiết bị') setActiveSizeCategory('spec');
                else setActiveSizeCategory('clothing');
              }}
              onToggleCategory={(cat) => {
                setFormData(prev => ({
                  ...prev,
                  category: prev.category.includes(cat)
                    ? prev.category.filter(c => c !== cat)
                    : [...prev.category, cat]
                }));
              }}
            />

            {/* Row 5: COLORS Swatches (Extracted Component) */}
            <ProductColorSelector
              availableColors={availableColors}
              selectedColors={formData.colors}
              onToggleColor={toggleColor}
            />

            {/* Row 6: SIZES Smart Tabs (Extracted Component) */}
            <ProductSizeSelector
              selectedSizes={formData.sizes}
              availableClothingSizes={availableClothingSizes}
              availableShoeSizes={availableShoeSizes}
              availableSportSpecs={availableSportSpecs}
              activeCategory={activeSizeCategory}
              setActiveCategory={setActiveSizeCategory}
              onToggleSize={toggleSize}
            />

            {/* Row 6.5: Ma trận Tồn kho theo Biến thể (Màu x Size) */}
            <ProductVariantMatrix
              colors={formData.colors}
              sizes={formData.sizes}
              variants={formData.variants}
              productId={formData.product_id}
              onChangeVariants={(newVariants) => {
                const totalStock = newVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
                setFormData(prev => ({
                  ...prev,
                  variants: newVariants,
                  stock: newVariants.length > 0 ? totalStock : prev.stock,
                }));
              }}
            />

            {/* Row 7: Images (Extracted Component) */}
            <ProductImageUploader
              images={formData.images}
              imageUrl={formData.image_url}
              onChangeImages={(imgs, primaryUrl) => setFormData(prev => ({ ...prev, images: imgs, image_url: primaryUrl }))}
            />

            {/* Row 8: Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết sản phẩm</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm resize-y focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập chất liệu, công nghệ, chính sách bảo hành..."
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Trở về
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Đang lưu...' : 'Lưu Sản phẩm'}
          </button>
        </div>

      </div>
    </div>
  );
}
