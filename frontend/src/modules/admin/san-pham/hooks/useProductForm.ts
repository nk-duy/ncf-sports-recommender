'use client';

import { useCallback, useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import type {
  AdminProductItem,
  ColorOption,
  MenuSportOption,
  ProductFormData,
} from '../types';
import { syncVariantsMatrix } from '../utils/variantMatrixHelpers';

const DEFAULT_BRANDS = [
  'Nike',
  'Adidas',
  'Puma',
  'Yonex',
  'Lining',
  'Mizuno',
  'Kamito',
  'Victor',
  'Asics',
  'Under Armour',
  'Decathlon',
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

function parseInitialGenders(editingProduct?: AdminProductItem | null): string[] {
  if (!editingProduct) return ['Unisex'];
  const rawGender = editingProduct.gender || 'Unisex';
  const parsed =
    typeof rawGender === 'string'
      ? rawGender
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(rawGender)
        ? rawGender
        : ['Unisex'];
  return parsed.length > 0 ? parsed : ['Unisex'];
}

function buildInitialFormData(
  editingProduct?: AdminProductItem | null,
  defaultSku = 'KADY-100001'
): ProductFormData {
  if (!editingProduct) {
    return {
      product_id: defaultSku,
      name: '',
      price: 0,
      image_url: '',
      stock: 0,
      rating: 0,
      reviews_count: 0,
      brand: '',
      gender: 'Unisex',
      product_type: 'Quần áo',
      sport_type: 'Đá bóng',
      category: [],
      sizes: [],
      colors: [],
      variants: [],
      description: '',
      images: [],
    };
  }

  const parsedGenders = parseInitialGenders(editingProduct);
  const colors = Array.isArray(editingProduct.colors)
    ? editingProduct.colors
    : editingProduct.colors
      ? [editingProduct.colors]
      : [];
  const sizes = Array.isArray(editingProduct.sizes)
    ? editingProduct.sizes
    : editingProduct.sizes
      ? [editingProduct.sizes]
      : [];
  const rawVariants = Array.isArray(editingProduct.variants) ? editingProduct.variants : [];
  const initStock = editingProduct.stock !== undefined ? editingProduct.stock : 100;
  const syncedVariants =
    colors.length > 0 || sizes.length > 0
      ? syncVariantsMatrix(colors, sizes, rawVariants, editingProduct.product_id, initStock)
      : rawVariants;

  return {
    product_id: editingProduct.product_id || '',
    name: editingProduct.name || '',
    price: editingProduct.price || 0,
    image_url: editingProduct.image_url || '',
    stock: initStock,
    rating: editingProduct.rating !== undefined ? editingProduct.rating : 0,
    reviews_count: editingProduct.reviews_count !== undefined ? editingProduct.reviews_count : 0,
    brand: editingProduct.brand || '',
    gender: parsedGenders.join(', ') || 'Unisex',
    product_type: editingProduct.product_type || '',
    sport_type: editingProduct.sport_type || '',
    category: Array.isArray(editingProduct.category)
      ? editingProduct.category
      : editingProduct.category
        ? [editingProduct.category]
        : [],
    sizes,
    colors,
    variants: syncedVariants,
    description: editingProduct.description || '',
    images:
      Array.isArray(editingProduct.images) && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image_url
          ? [editingProduct.image_url]
          : [],
  };
}

export function useProductForm({
  editingProduct,
  defaultSku,
  onSuccess,
}: {
  editingProduct?: AdminProductItem | null;
  defaultSku?: string;
  onSuccess: (savedProduct?: AdminProductItem) => void;
}) {
  const [formData, setFormData] = useState<ProductFormData>(() =>
    buildInitialFormData(editingProduct, defaultSku)
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(() =>
    parseInitialGenders(editingProduct)
  );
  const [isPriceFocused, setIsPriceFocused] = useState<boolean>(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [availableShoeSizes, setAvailableShoeSizes] = useState<string[]>([]);
  const [availableClothingSizes, setAvailableClothingSizes] = useState<string[]>([]);
  const [availableSportSpecs, setAvailableSportSpecs] = useState<string[]>([]);
  const [menuSports, setMenuSports] = useState<MenuSportOption[]>([]);
  const [activeSizeCategory, setActiveSizeCategory] = useState<'shoe' | 'clothing' | 'spec'>(() => {
    if (editingProduct?.product_type === 'Giày dép') return 'shoe';
    if (editingProduct?.product_type === 'Thiết bị') return 'spec';
    return 'clothing';
  });
  const [loading, setLoading] = useState(false);

  const fetchMenuData = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/menu`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMenuSports(data);
        }
      }
    } catch {
      // Dùng danh mục mặc định khi không tải được menu API
    }
  }, []);

  const fetchAttributes = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes`);
      if (res.ok) {
        const data = await res.json();
        setAvailableBrands(data.brands || DEFAULT_BRANDS);
        setAvailableColors(data.colors || DEFAULT_COLORS);
        setAvailableShoeSizes(
          data.shoe_sizes || ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
        );
        setAvailableClothingSizes(
          data.clothing_sizes || ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
        );
        setAvailableSportSpecs(data.sport_specs || []);
        return;
      }
    } catch {
      // Fallback sang localStorage
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
    fetchAttributes();
    fetchMenuData();
  }, [fetchAttributes, fetchMenuData]);

  const toggleColor = (colorName: string) => {
    setFormData((prev) => {
      const nextColors = prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName];
      const nextVariants = syncVariantsMatrix(
        nextColors,
        prev.sizes,
        prev.variants,
        prev.product_id,
        prev.stock
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
    setFormData((prev) => {
      const nextSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      const nextVariants = syncVariantsMatrix(
        prev.colors,
        nextSizes,
        prev.variants,
        prev.product_id,
        prev.stock
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
    setSelectedGenders((prev) => {
      let next: string[];
      if (prev.includes(g)) {
        next = prev.filter((item) => item !== g);
        // Không để mảng rỗng, mặc định còn Unisex
        if (next.length === 0) next = ['Unisex'];
      } else {
        next = [...prev, g];
      }
      setFormData((f) => ({ ...f, gender: next.join(', ') }));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const url = editingProduct
        ? `${apiUrl}/products/${editingProduct.product_id}`
        : `${apiUrl}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const finalGender =
        selectedGenders.length > 0 ? selectedGenders.join(', ') : formData.gender || 'Unisex';
      const finalBrand =
        formData.brand && formData.brand.trim() !== '' ? formData.brand.trim() : null;

      const payload = {
        ...formData,
        brand: finalBrand,
        gender: finalGender,
        image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
      };

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProduct = await res.json().catch(() => undefined);
        notifications.show({
          title: 'Thành công',
          message: editingProduct ? 'Đã cập nhật sản phẩm!' : 'Đã thêm sản phẩm mới!',
          color: 'green',
        });
        onSuccess(savedProduct);
      } else {
        const errorData = await res.json().catch(() => ({}));
        notifications.show({
          title: 'Lỗi',
          message: errorData.detail || 'Không thể lưu sản phẩm',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi kết nối tới máy chủ',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedGenders,
    isPriceFocused,
    setIsPriceFocused,
    availableBrands,
    availableColors,
    availableShoeSizes,
    availableClothingSizes,
    availableSportSpecs,
    menuSports,
    activeSizeCategory,
    setActiveSizeCategory,
    loading,
    toggleColor,
    toggleSize,
    toggleGender,
    handleSubmit,
  };
}
