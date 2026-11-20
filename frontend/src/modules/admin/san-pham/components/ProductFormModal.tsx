'use client';
import React, { useState, useEffect, useCallback } from "react";
import { X, Award, Tag } from "lucide-react";
import { notifications } from "@mantine/notifications";

import ProductCategoryCascade from "./form/ProductCategoryCascade";
import ProductColorSelector, { ColorOption } from "./form/ProductColorSelector";
import ProductSizeSelector from "./form/ProductSizeSelector";
import ProductImageUploader from "./form/ProductImageUploader";
import ProductVariantMatrix, { ProductVariantItem } from "./form/ProductVariantMatrix";
import { defaultMenu } from "@/modules/admin/danh-muc/data/defaultMenu";
import { getAuthHeaders } from "@/shared/lib/authHeader";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import type { AdminProductItem, MenuCategoryOption, MenuProductTypeOption, MenuSportOption } from "../types";
import { syncVariantsMatrix } from "../utils/variantMatrixHelpers";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedProduct?: AdminProductItem) => void;
  editingProduct?: AdminProductItem | null;
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

const DEFAULT_SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const DEFAULT_CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

function getSubCategoriesFor(
  menu: MenuSportOption[],
  sportType: string,
  productType: string
): string[] {
  const effectiveMenu = menu && menu.length > 0 ? menu : defaultMenu;
  const sportObj = effectiveMenu.find((s) => s.sport_type === sportType);
  const ptObj = sportObj?.product_types?.find(
    (pt: MenuProductTypeOption) => pt.product_type === productType
  );
  const raw = ptObj?.categories || [];
  return raw
    .map((item: string | MenuCategoryOption) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item.category && !item.is_hidden) {
        return item.category;
      }
      return null;
    })
    .filter(Boolean) as string[];
}

function filterCompatibleSizes(
  sizes: string[],
  nextProductType: string,
  shoeSizes: string[],
  clothingSizes: string[]
): string[] {
  if (sizes.length === 0) return sizes;
  const shoeSet = new Set(shoeSizes);
  const clothingSet = new Set(clothingSizes);
  if (nextProductType === 'Giày dép') {
    return sizes.filter((s) => !clothingSet.has(s));
  }
  if (nextProductType === 'Quần áo') {
    return sizes.filter((s) => clothingSet.has(s));
  }
  if (nextProductType === 'Thiết bị') {
    return sizes.filter((s) => !shoeSet.has(s) && !clothingSet.has(s));
  }
  return sizes;
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, editingProduct }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    price: 0,
    image_url: "",
    stock: 0,
    rating: 5.0,
    reviews_count: 0,
    category: [] as string[],
    brand: "",
    gender: "Unisex",
    product_type: "Quần áo",
    sport_type: "Đá bóng",
    sizes: [] as string[],
    colors: [] as string[],
    variants: [] as ProductVariantItem[],
    description: "",
    images: [] as string[],
  });

  const [selectedGenders, setSelectedGenders] = useState<string[]>(['Unisex']);
  const [isPriceFocused, setIsPriceFocused] = useState<boolean>(false);
  const [isStockFocused, setIsStockFocused] = useState<boolean>(false);
  const [hasManualVariantEdit, setHasManualVariantEdit] = useState<boolean>(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [availableShoeSizes, setAvailableShoeSizes] = useState<string[]>(DEFAULT_SHOE_SIZES);
  const [availableClothingSizes, setAvailableClothingSizes] = useState<string[]>(DEFAULT_CLOTHING_SIZES);
  const [availableSportSpecs, setAvailableSportSpecs] = useState<string[]>([]);
  const [menuSports, setMenuSports] = useState<MenuSportOption[]>(defaultMenu);
  const menuSportsRef = React.useRef<MenuSportOption[]>(defaultMenu);
  const [activeSizeCategory, setActiveSizeCategory] = useState<'shoe' | 'clothing' | 'spec'>('clothing');
  const [loading, setLoading] = useState(false);

  const fetchMenuData = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/menu`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          menuSportsRef.current = data;
          setMenuSports(data);
          return;
        }
      }
    } catch {
      console.warn("Could not fetch menu from API");
    }
    const savedMenu = localStorage.getItem('admin_mega_menu');
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          menuSportsRef.current = parsed;
          setMenuSports(parsed);
          return;
        }
      } catch {
        // Fallback sang defaultMenu
      }
    }
    menuSportsRef.current = defaultMenu;
    setMenuSports(defaultMenu);
  }, []);

  const fetchAttributes = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes`);
      if (res.ok) {
        const data = await res.json();
        setAvailableBrands(data.brands || DEFAULT_BRANDS);
        setAvailableColors(data.colors || DEFAULT_COLORS);
        setAvailableShoeSizes(data.shoe_sizes || DEFAULT_SHOE_SIZES);
        setAvailableClothingSizes(data.clothing_sizes || DEFAULT_CLOTHING_SIZES);
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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttributes();
    fetchMenuData();
  }, [fetchAttributes, fetchMenuData]);

  useEffect(() => {
    if (!isOpen) return;
    if (editingProduct) {
      const rawGender = editingProduct.gender || "Unisex";
      const parsedGenders = typeof rawGender === 'string'
        ? rawGender.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(rawGender) ? rawGender : ['Unisex']);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGenders(parsedGenders.length > 0 ? parsedGenders : ['Unisex']);
      setIsPriceFocused(false);
      setIsStockFocused(false);

      const initPrice = editingProduct.price || 0;
      const initStock = editingProduct.stock !== undefined ? editingProduct.stock : 100;
      const initColors = Array.isArray(editingProduct.colors)
        ? editingProduct.colors
        : (editingProduct.colors ? [editingProduct.colors] : []);
      const initSizes = Array.isArray(editingProduct.sizes)
        ? editingProduct.sizes
        : (editingProduct.sizes ? [editingProduct.sizes] : []);
      const rawVariants = Array.isArray(editingProduct.variants) ? editingProduct.variants : [];
      const syncedVariants =
        initColors.length > 0 || initSizes.length > 0
          ? syncVariantsMatrix(initColors, initSizes, rawVariants, editingProduct.product_id, initStock)
          : rawVariants;

      setHasManualVariantEdit(rawVariants.length > 0);

      const rawCategories = Array.isArray(editingProduct.category)
        ? editingProduct.category
        : (editingProduct.category ? [editingProduct.category] : []);
      const initCategories =
        editingProduct.sub_category && !rawCategories.includes(editingProduct.sub_category)
          ? [editingProduct.sub_category, ...rawCategories]
          : rawCategories;

      setFormData({
        product_id: editingProduct.product_id || "",
        name: editingProduct.name || "",
        price: initPrice,
        image_url: editingProduct.image_url || "",
        stock: syncedVariants.length > 0
          ? syncedVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
          : initStock,
        rating: editingProduct.rating !== undefined && editingProduct.rating > 0 ? editingProduct.rating : 5.0,
        reviews_count: editingProduct.reviews_count !== undefined ? editingProduct.reviews_count : 0,
        brand: editingProduct.brand || "",
        gender: parsedGenders.join(', ') || "Unisex",
        product_type: editingProduct.product_type || "Quần áo",
        sport_type: editingProduct.sport_type || "Đá bóng",
        category: initCategories,
        sizes: initSizes,
        colors: initColors,
        variants: syncedVariants,
        description: editingProduct.description || "",
        images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0
          ? editingProduct.images
          : (editingProduct.image_url ? [editingProduct.image_url] : []),
      });

      if (editingProduct.product_type === 'Giày dép') setActiveSizeCategory('shoe');
      else if (editingProduct.product_type === 'Thiết bị') setActiveSizeCategory('spec');
      else setActiveSizeCategory('clothing');
    } else {
      setSelectedGenders(['Unisex']);
      setIsPriceFocused(false);
      setIsStockFocused(false);
      setHasManualVariantEdit(false);
      setActiveSizeCategory('clothing');
      const randomSku = `KADY-${Math.floor(100000 + Math.random() * 900000)}`;
      const defaultSport = "Đá bóng";
      const defaultPT = "Quần áo";
      const defaultSubCats = getSubCategoriesFor(menuSportsRef.current, defaultSport, defaultPT);
      setFormData({
        product_id: randomSku,
        name: "",
        price: 0,
        image_url: "",
        stock: 0,
        rating: 5.0,
        reviews_count: 0,
        brand: "",
        gender: "Unisex",
        product_type: defaultPT,
        sport_type: defaultSport,
        category: defaultSubCats.length > 0 ? [defaultSubCats[0]] : [],
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
    setFormData(prev => {
      const nextColors = prev.colors.includes(colorName)
        ? prev.colors.filter(c => c !== colorName)
        : [...prev.colors, colorName];
      const nextVariants = syncVariantsMatrix(
        nextColors,
        prev.sizes,
        prev.variants,
        prev.product_id,
        prev.stock,
        !hasManualVariantEdit
      );
      const totalStock = nextVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      return {
        ...prev,
        colors: nextColors,
        variants: nextVariants,
        stock: nextVariants.length > 0 ? totalStock : prev.stock,
      };
    });
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const nextSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      const nextVariants = syncVariantsMatrix(
        prev.colors,
        nextSizes,
        prev.variants,
        prev.product_id,
        prev.stock,
        !hasManualVariantEdit
      );
      const totalStock = nextVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      return {
        ...prev,
        sizes: nextSizes,
        variants: nextVariants,
        stock: nextVariants.length > 0 ? totalStock : prev.stock,
      };
    });
  };

  const toggleGender = (g: string) => {
    setSelectedGenders(prev => {
      let next: string[];
      if (prev.includes(g)) {
        next = prev.filter(item => item !== g);
        // Không để mảng rỗng, mặc định còn Unisex
        if (next.length === 0) next = ['Unisex'];
      } else {
        next = [...prev, g];
      }
      setFormData(f => ({ ...f, gender: next.join(', ') }));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      notifications.show({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tên sản phẩm!",
        color: "orange",
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      notifications.show({
        title: "Giá bán chưa hợp lệ",
        message: "Vui lòng nhập giá bán sản phẩm lớn hơn 0 VNĐ!",
        color: "orange",
      });
      return;
    }

    const primaryImage = (
      formData.image_url && formData.images.includes(formData.image_url)
        ? formData.image_url
        : (formData.images[0] || formData.image_url || '')
    ).trim();

    if (!primaryImage) {
      notifications.show({
        title: "Thiếu hình ảnh",
        message: "Vui lòng tải lên hoặc dán link URL ít nhất 1 hình ảnh sản phẩm!",
        color: "orange",
      });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = resolveApiBaseUrl();
      const url = editingProduct
        ? `${apiUrl}/products/${editingProduct.product_id}`
        : `${apiUrl}/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const finalGender = selectedGenders.length > 0 ? selectedGenders.join(', ') : (formData.gender || 'Unisex');
      const finalBrand = formData.brand && formData.brand.trim() !== '' ? formData.brand.trim() : null;
      const defaultSubCats = getSubCategoriesFor(menuSports, formData.sport_type, formData.product_type);
      const finalCategories =
        formData.category.length > 0
          ? formData.category
          : (defaultSubCats.length > 0 ? [defaultSubCats[0]] : []);
      const finalImages =
        formData.images.length > 0
          ? [primaryImage, ...formData.images.filter((u) => u !== primaryImage)]
          : [primaryImage];

      const payload = {
        ...formData,
        product_id: formData.product_id.trim(),
        name: trimmedName,
        brand: finalBrand,
        gender: finalGender,
        category: finalCategories,
        sub_category: finalCategories[0] || null,
        image_url: primaryImage,
        images: finalImages,
      };

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedProduct = await res.json().catch(() => undefined);
        notifications.show({
          title: "Thành công",
          message: editingProduct ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!",
          color: "green",
        });
        onSuccess(savedProduct);
      } else {
        const errorData = await res.json().catch(() => ({}));
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã định danh (SKU)</label>
                <input
                  type="text"
                  disabled={!!editingProduct}
                  value={formData.product_id}
                  onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm disabled:bg-gray-100 font-mono"
                  placeholder="VD: KADY-SP-001"
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

            {/* Row 2: Thương hiệu & Đối tượng */}
            <div className="flex flex-col gap-4">
              {/* Block Thương hiệu */}
              <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Award size={16} className="text-blue-600" />
                    Thương hiệu
                  </label>
                  {!formData.brand && (
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Không có thương hiệu
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="flex-1 min-w-[200px] px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="">-- Không có thương hiệu --</option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Hoặc nhập khác..."
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {formData.brand && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, brand: "" })}
                      className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition border border-gray-200 cursor-pointer shrink-0"
                      title="Xóa thương hiệu"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
              </div>

              {/* Block Đối tượng */}
              <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Tag size={16} className="text-blue-600" />
                    Đối tượng
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    Đã chọn: {selectedGenders.join(', ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Nam', 'Nữ', 'Unisex', 'Trẻ em'].map(g => {
                    const isSelected = selectedGenders.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGender(g)}
                        className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                      >
                        {isSelected && <span>✓</span>}
                        <span>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 3: Price & Stock (Chia đôi cân bằng 50/50, ngang hàng, không chú thích) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán *</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    value={
                      isPriceFocused
                        ? (formData.price === 0 ? '' : String(formData.price))
                        : (formData.price > 0 ? formData.price.toLocaleString('vi-VN') : '')
                    }
                    onFocus={(e) => {
                      setIsPriceFocused(true);
                      e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      const num = raw === '' ? 0 : parseInt(raw, 10);
                      setFormData(prev => ({ ...prev, price: num }));
                    }}
                    onBlur={() => {
                      setIsPriceFocused(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                    VNĐ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số lượng tồn kho *
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="0"
                  value={
                    isStockFocused
                      ? (formData.stock === 0 ? '' : String(formData.stock))
                      : String(formData.stock)
                  }
                  onFocus={e => {
                    setIsStockFocused(true);
                    e.target.select();
                  }}
                  onBlur={() => setIsStockFocused(false)}
                  onChange={e => {
                    const rawVal = e.target.value === '' ? 0 : Number(e.target.value);
                    const newTotal = Math.max(0, rawVal);
                    setHasManualVariantEdit(false);

                    if (formData.variants.length > 0) {
                      const count = formData.variants.length;
                      const base = Math.floor(newTotal / count);
                      let rem = newTotal % count;
                      const updatedVariants = formData.variants.map(v => {
                        const extra = rem > 0 ? 1 : 0;
                        if (rem > 0) rem--;
                        return { ...v, stock: base + extra };
                      });
                      setFormData(prev => ({
                        ...prev,
                        stock: newTotal,
                        variants: updatedVariants,
                      }));
                    } else {
                      setFormData(prev => ({ ...prev, stock: newTotal }));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
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
                const subCats = getSubCategoriesFor(menuSports, sport, firstPT);
                setFormData(prev => {
                  const nextSizes = filterCompatibleSizes(
                    prev.sizes,
                    firstPT,
                    availableShoeSizes,
                    availableClothingSizes
                  );
                  const nextVariants = syncVariantsMatrix(
                    prev.colors,
                    nextSizes,
                    prev.variants,
                    prev.product_id,
                    prev.stock,
                    !hasManualVariantEdit
                  );
                  const totalStock = nextVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
                  return {
                    ...prev,
                    sport_type: sport,
                    product_type: firstPT,
                    category: subCats.length > 0 ? [subCats[0]] : [],
                    sizes: nextSizes,
                    variants: nextVariants,
                    stock: nextVariants.length > 0 ? totalStock : prev.stock,
                  };
                });
                if (firstPT === 'Giày dép') setActiveSizeCategory('shoe');
                else if (firstPT === 'Thiết bị') setActiveSizeCategory('spec');
                else setActiveSizeCategory('clothing');
              }}
              onChangeProductType={(pt) => {
                setFormData(prev => {
                  const subCats = getSubCategoriesFor(menuSports, prev.sport_type, pt);
                  const nextSizes = filterCompatibleSizes(
                    prev.sizes,
                    pt,
                    availableShoeSizes,
                    availableClothingSizes
                  );
                  const nextVariants = syncVariantsMatrix(
                    prev.colors,
                    nextSizes,
                    prev.variants,
                    prev.product_id,
                    prev.stock,
                    !hasManualVariantEdit
                  );
                  const totalStock = nextVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
                  return {
                    ...prev,
                    product_type: pt,
                    category: subCats.length > 0 ? [subCats[0]] : [],
                    sizes: nextSizes,
                    variants: nextVariants,
                    stock: nextVariants.length > 0 ? totalStock : prev.stock,
                  };
                });
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

            {/* Row 6.5: Ma trận Tồn kho theo Biến thể */}
            <ProductVariantMatrix
              colors={formData.colors}
              sizes={formData.sizes}
              variants={formData.variants}
              productId={formData.product_id}
              targetTotalStock={formData.stock}
              onChangeVariants={(newVariants) => {
                setHasManualVariantEdit(true);
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
