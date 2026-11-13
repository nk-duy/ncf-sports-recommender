'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Check } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import {
  AttributesApiData,
  CLOTHING_SIZE_ORDER,
  ColorItem,
  DEFAULT_BRANDS,
  DEFAULT_CLOTHING_SIZES,
  DEFAULT_COLORS,
  DEFAULT_SHOE_SIZES,
  DEFAULT_SPORT_SPECS,
} from '../types';

const emptySubscribe = () => () => {};

function normalizeColors(raw: Array<ColorItem | string> | undefined): ColorItem[] {
  if (!raw || raw.length === 0) return DEFAULT_COLORS;
  return raw.map((item) =>
    typeof item === 'string' ? { name: item, hex: '#2563EB' } : item
  );
}

export function useAdminAttributes() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [shoeSizes, setShoeSizes] = useState<string[]>([]);
  const [clothingSizes, setClothingSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sportSpecs, setSportSpecs] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');
  const [newBrandInput, setNewBrandInput] = useState('');
  const [newSpecInput, setNewSpecInput] = useState('');
  const [newShoeInput, setNewShoeInput] = useState('');
  const [newClothInput, setNewClothInput] = useState('');

  const fallbackToLocalStorage = useCallback(() => {
    const savedShoeSizes = localStorage.getItem('admin_shoe_sizes');
    setShoeSizes(savedShoeSizes ? JSON.parse(savedShoeSizes) : DEFAULT_SHOE_SIZES);

    const savedClothingSizes = localStorage.getItem('admin_clothing_sizes');
    setClothingSizes(savedClothingSizes ? JSON.parse(savedClothingSizes) : DEFAULT_CLOTHING_SIZES);

    const savedBrands = localStorage.getItem('admin_brands');
    setBrands(savedBrands ? JSON.parse(savedBrands) : DEFAULT_BRANDS);

    const savedSpecs = localStorage.getItem('admin_sport_specs');
    setSportSpecs(savedSpecs ? JSON.parse(savedSpecs) : DEFAULT_SPORT_SPECS);

    const savedDetailedColors = localStorage.getItem('admin_colors_detailed');
    setColors(savedDetailedColors ? JSON.parse(savedDetailedColors) : DEFAULT_COLORS);
  }, []);

  const fetchAttributes = useCallback(async () => {
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes`);
      if (res.ok) {
        const data: AttributesApiData = await res.json();
        const b = data.brands || DEFAULT_BRANDS;
        const c = normalizeColors(data.colors);
        const ss = data.shoe_sizes || DEFAULT_SHOE_SIZES;
        const cs = data.clothing_sizes || DEFAULT_CLOTHING_SIZES;
        const sp = data.sport_specs || DEFAULT_SPORT_SPECS;

        setBrands(b);
        setColors(c);
        setShoeSizes(ss);
        setClothingSizes(cs);
        setSportSpecs(sp);

        // Sync local storage for components reading locally
        localStorage.setItem('admin_brands', JSON.stringify(b));
        localStorage.setItem('admin_colors_detailed', JSON.stringify(c));
        localStorage.setItem('admin_colors', JSON.stringify(c.map((item) => item.name)));
        localStorage.setItem('admin_shoe_sizes', JSON.stringify(ss));
        localStorage.setItem('admin_clothing_sizes', JSON.stringify(cs));
        localStorage.setItem('admin_sport_specs', JSON.stringify(sp));
      } else {
        fallbackToLocalStorage();
      }
    } catch {
      fallbackToLocalStorage();
    }
  }, [fallbackToLocalStorage]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const syncLocalStorage = (
    ss: string[],
    cs: string[],
    b: string[],
    sp: string[],
    c: ColorItem[]
  ) => {
    localStorage.setItem('admin_shoe_sizes', JSON.stringify(ss));
    localStorage.setItem('admin_clothing_sizes', JSON.stringify(cs));
    localStorage.setItem('admin_brands', JSON.stringify(b));
    localStorage.setItem('admin_sport_specs', JSON.stringify(sp));
    localStorage.setItem('admin_colors_detailed', JSON.stringify(c));
    localStorage.setItem('admin_colors', JSON.stringify(c.map((item) => item.name)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          brands,
          colors,
          shoe_sizes: shoeSizes,
          clothing_sizes: clothingSizes,
          sport_specs: sportSpecs,
        }),
      });

      syncLocalStorage(shoeSizes, clothingSizes, brands, sportSpecs, colors);
      setHasUnsavedChanges(false);

      if (res.ok) {
        notifications.show({
          title: 'Đã lưu thành công (API & DB)',
          message: 'Toàn bộ thuộc tính sản phẩm đã được đồng bộ vào cơ sở dữ liệu MongoDB!',
          color: 'green',
          icon: <Check size={18} />,
        });
      } else {
        notifications.show({
          title: 'Đã lưu cục bộ',
          message: 'Dữ liệu đã được lưu trên máy của bạn (Server báo lỗi khi cập nhật).',
          color: 'amber',
        });
      }
    } catch {
      syncLocalStorage(shoeSizes, clothingSizes, brands, sportSpecs, colors);
      setHasUnsavedChanges(false);
      notifications.show({
        title: 'Lưu ngoại tuyến',
        message: 'Đã lưu vào bộ nhớ trình duyệt (Không kết nối được API).',
        color: 'blue',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !confirm(
        'Bạn có chắc chắn muốn khôi phục toàn bộ thuộc tính về cài đặt chuẩn thể thao mặc định trên máy chủ?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${resolveApiBaseUrl()}/attributes/reset`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data: { data?: AttributesApiData } = await res.json();
        const doc = data.data || {};
        setBrands(doc.brands || DEFAULT_BRANDS);
        setColors(normalizeColors(doc.colors));
        setShoeSizes(doc.shoe_sizes || DEFAULT_SHOE_SIZES);
        setClothingSizes(doc.clothing_sizes || DEFAULT_CLOTHING_SIZES);
        setSportSpecs(doc.sport_specs || DEFAULT_SPORT_SPECS);
      } else {
        setShoeSizes(DEFAULT_SHOE_SIZES);
        setClothingSizes(DEFAULT_CLOTHING_SIZES);
        setBrands(DEFAULT_BRANDS);
        setSportSpecs(DEFAULT_SPORT_SPECS);
        setColors(DEFAULT_COLORS);
      }
    } catch {
      setShoeSizes(DEFAULT_SHOE_SIZES);
      setClothingSizes(DEFAULT_CLOTHING_SIZES);
      setBrands(DEFAULT_BRANDS);
      setSportSpecs(DEFAULT_SPORT_SPECS);
      setColors(DEFAULT_COLORS);
    }

    setHasUnsavedChanges(false);
    notifications.show({
      title: 'Đã đặt lại mặc định',
      message: 'Toàn bộ thuộc tính đã được khôi phục về giá trị chuẩn thể thao.',
      color: 'blue',
    });
  };

  const addBrand = () => {
    const trimmed = newBrandInput.trim();
    if (trimmed && !brands.includes(trimmed)) {
      setBrands([...brands, trimmed]);
      setNewBrandInput('');
      setHasUnsavedChanges(true);
    }
  };

  const removeBrand = (idx: number) => {
    setBrands(brands.filter((_, i) => i !== idx));
    setHasUnsavedChanges(true);
  };

  const addSpec = () => {
    const trimmed = newSpecInput.trim();
    if (trimmed && !sportSpecs.includes(trimmed)) {
      setSportSpecs([...sportSpecs, trimmed]);
      setNewSpecInput('');
      setHasUnsavedChanges(true);
    }
  };

  const removeSpec = (idx: number) => {
    setSportSpecs(sportSpecs.filter((_, i) => i !== idx));
    setHasUnsavedChanges(true);
  };

  const addColor = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) {
      notifications.show({
        title: 'Thiếu tên màu',
        message: 'Vui lòng nhập tên màu sắc',
        color: 'red',
      });
      return;
    }
    if (colors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      notifications.show({
        title: 'Đã tồn tại',
        message: 'Màu này đã có trong danh sách',
        color: 'amber',
      });
      return;
    }
    setColors([...colors, { name: trimmed, hex: newColorHex }]);
    setNewColorName('');
    setHasUnsavedChanges(true);
  };

  const removeColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
    setHasUnsavedChanges(true);
  };

  const updateColorHex = (idx: number, newHex: string) => {
    setColors((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, hex: newHex } : item))
    );
    setHasUnsavedChanges(true);
  };

  const addShoeSize = () => {
    const trimmed = newShoeInput.trim();
    if (trimmed && !shoeSizes.includes(trimmed)) {
      setShoeSizes([...shoeSizes, trimmed]);
      setNewShoeInput('');
      setHasUnsavedChanges(true);
    }
  };

  const removeShoeSize = (idx: number) => {
    setShoeSizes(shoeSizes.filter((_, i) => i !== idx));
    setHasUnsavedChanges(true);
  };

  const sortShoeSizes = () => {
    const sorted = [...shoeSizes].sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
    setShoeSizes(sorted);
    setHasUnsavedChanges(true);
    notifications.show({
      title: 'Đã sắp xếp',
      message: 'Size giày đã được xếp theo thứ tự số tăng dần.',
      color: 'blue',
    });
  };

  const addClothingSize = () => {
    const trimmed = newClothInput.trim().toUpperCase();
    if (trimmed && !clothingSizes.includes(trimmed)) {
      setClothingSizes([...clothingSizes, trimmed]);
      setNewClothInput('');
      setHasUnsavedChanges(true);
    }
  };

  const removeClothingSize = (idx: number) => {
    setClothingSizes(clothingSizes.filter((_, i) => i !== idx));
    setHasUnsavedChanges(true);
  };

  const sortClothingSizes = () => {
    const sorted = [...clothingSizes].sort((a, b) => {
      const indexA = CLOTHING_SIZE_ORDER.indexOf(a);
      const indexB = CLOTHING_SIZE_ORDER.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
    setClothingSizes(sorted);
    setHasUnsavedChanges(true);
    notifications.show({
      title: 'Đã sắp xếp',
      message: 'Size quần áo đã được sắp xếp chuẩn từ nhỏ đến lớn (XS -> 3XL).',
      color: 'blue',
    });
  };

  return {
    mounted,
    shoeSizes,
    clothingSizes,
    colors,
    brands,
    sportSpecs,
    isSaving,
    hasUnsavedChanges,
    newColorName,
    setNewColorName,
    newColorHex,
    setNewColorHex,
    newBrandInput,
    setNewBrandInput,
    newSpecInput,
    setNewSpecInput,
    newShoeInput,
    setNewShoeInput,
    newClothInput,
    setNewClothInput,
    handleSave,
    handleResetDefaults,
    addBrand,
    removeBrand,
    addSpec,
    removeSpec,
    addColor,
    removeColor,
    updateColorHex,
    addShoeSize,
    removeShoeSize,
    sortShoeSizes,
    addClothingSize,
    removeClothingSize,
    sortClothingSizes,
  };
}
