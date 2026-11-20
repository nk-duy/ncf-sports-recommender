'use client';

import { useCallback, useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import { defaultMenu } from '@/modules/admin/danh-muc/data/defaultMenu';
import type {
  AdminProductItem,
  ColorOption,
  MenuCategoryOption,
  MenuProductTypeOption,
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

const DEFAULT_SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const DEFAULT_CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const DEFAULT_SPORT_SPECS = [
  'Bóng Size 4',
  'Bóng Size 5',
  'Vợt 3U-G5 (85-89g)',
  'Vợt 4U-G5 (80-84g)',
  'Vợt 5U-G6 (<80g)',
  'Đinh dăm TF (Cỏ nhân tạo)',
  'Đinh cao FG (Cỏ tự nhiên)',
  'Đế bằng IC (Futsal)',
  'Lều Đơn (1-2 Người)',
  'Lều Đôi (2-4 Người)',
  'Lều Gia Đình (4-6 Người)',
  'Thảm tập 6mm',
  'Thảm tập 8mm',
  'Freesize',
];

function getSubCategoriesFor(
  sports: MenuSportOption[],
  sportName: string,
  productTypeName: string
): string[] {
  const source = sports.length > 0 ? sports : defaultMenu;
  const sport = source.find((s) => s.sport_type === sportName);
  const pt = sport?.product_types?.find(
    (p: MenuProductTypeOption) => p.product_type === productTypeName
  );
  const raw = pt?.categories || [];
  return raw
    .map((c: string | MenuCategoryOption) => {
      if (typeof c === 'string') return c;
      if (c && typeof c === 'object' && c.category && !c.is_hidden) return c.category;
      return null;
    })
    .filter((item): item is string => Boolean(item));
}

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
    const defaultSubCats = getSubCategoriesFor([], 'Đá bóng', 'Quần áo');
    return {
      product_id: defaultSku,
      name: '',
      price: 0,
      image_url: '',
      stock: 0,
      rating: 5,
      reviews_count: 0,
      brand: '',
      gender: 'Unisex',
      product_type: 'Quần áo',
      sport_type: 'Đá bóng',
      category: defaultSubCats.length > 0 ? [defaultSubCats[0]] : [],
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

  const initialCategories = Array.isArray(editingProduct.category)
    ? editingProduct.category
    : editingProduct.category
      ? [editingProduct.category]
      : editingProduct.sub_category
        ? [editingProduct.sub_category]
        : [];

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
    product_type: editingProduct.product_type || 'Quần áo',
    sport_type: editingProduct.sport_type || 'Đá bóng',
    category: initialCategories,
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
  const [isStockFocused, setIsStockFocused] = useState<boolean>(false);
  const [hasManualVariantEdit, setHasManualVariantEdit] = useState<boolean>(
    () => Boolean(editingProduct && Array.isArray(editingProduct.variants) && editingProduct.variants.length > 0)
  );
  const [availableBrands, setAvailableBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [availableShoeSizes, setAvailableShoeSizes] = useState<string[]>(DEFAULT_SHOE_SIZES);
  const [availableClothingSizes, setAvailableClothingSizes] =
    useState<string[]>(DEFAULT_CLOTHING_SIZES);
  const [availableSportSpecs, setAvailableSportSpecs] = useState<string[]>(DEFAULT_SPORT_SPECS);
  const [menuSports, setMenuSports] = useState<MenuSportOption[]>(defaultMenu);
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
          return;
        }
      }
    } catch {
      // Dùng danh mục mặc định khi không tải được menu API
    }
    const savedMenu = localStorage.getItem('admin_mega_menu');
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMenuSports(parsed);
          return;
        }
      } catch {
        // Ignore parse error
      }
    }
    setMenuSports(defaultMenu);
  }, []);

  const fetchAttributes = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes`);
      if (res.ok) {
        const data = await res.json();
        setAvailableBrands(data.brands?.length ? data.brands : DEFAULT_BRANDS);
        setAvailableColors(data.colors?.length ? data.colors : DEFAULT_COLORS);
        setAvailableShoeSizes(data.shoe_sizes?.length ? data.shoe_sizes : DEFAULT_SHOE_SIZES);
        setAvailableClothingSizes(
          data.clothing_sizes?.length ? data.clothing_sizes : DEFAULT_CLOTHING_SIZES
        );
        setAvailableSportSpecs(data.sport_specs?.length ? data.sport_specs : DEFAULT_SPORT_SPECS);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        prev.stock,
        !hasManualVariantEdit && prev.stock > 0
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
        prev.stock,
        !hasManualVariantEdit && prev.stock > 0
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

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      notifications.show({
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập tên sản phẩm',
        color: 'orange',
      });
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      notifications.show({
        title: 'Giá không hợp lệ',
        message: 'Vui lòng nhập giá bán lớn hơn 0 VNĐ',
        color: 'orange',
      });
      return;
    }

    const primaryImage =
      formData.images.length > 0 ? formData.images[0].trim() : formData.image_url.trim();
    if (!primaryImage) {
      notifications.show({
        title: 'Thiếu hình ảnh',
        message: 'Vui lòng tải ảnh lên hoặc dán đường dẫn URL hình ảnh sản phẩm',
        color: 'orange',
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

      const finalGender =
        selectedGenders.length > 0 ? selectedGenders.join(', ') : formData.gender || 'Unisex';
      const finalBrand =
        formData.brand && formData.brand.trim() !== '' ? formData.brand.trim() : null;

      let finalCategories = Array.isArray(formData.category)
        ? formData.category.filter(Boolean)
        : [];
      if (finalCategories.length === 0) {
        const subCats = getSubCategoriesFor(menuSports, formData.sport_type, formData.product_type);
        if (subCats.length > 0) {
          finalCategories = [subCats[0]];
        }
      }

      const finalImages =
        formData.images.length > 0 ? formData.images : primaryImage ? [primaryImage] : [];
      const finalTotalStock =
        formData.variants.length > 0
          ? formData.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
          : Math.max(0, Number(formData.stock) || 0);

      const payload = {
        ...formData,
        product_id: formData.product_id.trim(),
        name: trimmedName,
        price: Number(formData.price),
        stock: finalTotalStock,
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
    isStockFocused,
    setIsStockFocused,
    hasManualVariantEdit,
    setHasManualVariantEdit,
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
