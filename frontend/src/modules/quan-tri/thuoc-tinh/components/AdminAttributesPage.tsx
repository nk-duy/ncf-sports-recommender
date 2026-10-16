'use client';
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import AttributesHeader from './AttributesHeader';
import BrandAttributeSection from './BrandAttributeSection';
import ColorAttributeSection, { ColorItem } from './ColorAttributeSection';
import SizeAttributeSection from './SizeAttributeSection';
import SportSpecAttributeSection from './SportSpecAttributeSection';

const DEFAULT_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Yonex', 'Lining', 'Mizuno', 'Kamito', 'Victor', 'Asics', 'Under Armour', 'Decathlon'
];

const DEFAULT_SPORT_SPECS = [
  'Vợt 3U-G5 (85-89g)', 'Vợt 4U-G5 (80-84g)', 'Vợt 5U-G5 (75-79g)', 
  'Mặt vợt 13mm (Power)', 'Mặt vợt 16mm (Control)', 
  'Đinh dăm TF (Cỏ nhân tạo)', 'Đinh AG/FG (Cỏ tự nhiên)', 'Đế bằng IC (Futsal/Trong nhà)',
  'Căng dây 10.5 - 12 kg', 'Bóng Size 4', 'Bóng Size 5'
];

const DEFAULT_SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const DEFAULT_CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const DEFAULT_COLORS: ColorItem[] = [
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

const CLOTHING_SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', 'Freesize'];

export default function AdminAttributesPage() {
  const [shoeSizes, setShoeSizes] = useState<string[]>([]);
  const [clothingSizes, setClothingSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sportSpecs, setSportSpecs] = useState<string[]>([]);
  
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // New color form inputs
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');

  // Input states for other cards
  const [newBrandInput, setNewBrandInput] = useState('');
  const [newSpecInput, setNewSpecInput] = useState('');
  const [newShoeInput, setNewShoeInput] = useState('');
  const [newClothInput, setNewClothInput] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/attributes');
      if (res.ok) {
        const data = await res.json();
        
        const b = data.brands || DEFAULT_BRANDS;
        const c = data.colors || DEFAULT_COLORS;
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
        localStorage.setItem('admin_colors', JSON.stringify(c.map((item: any) => typeof item === 'string' ? item : item.name)));
        localStorage.setItem('admin_shoe_sizes', JSON.stringify(ss));
        localStorage.setItem('admin_clothing_sizes', JSON.stringify(cs));
        localStorage.setItem('admin_sport_specs', JSON.stringify(sp));
      } else {
        fallbackToLocalStorage();
      }
    } catch (err) {
      console.warn("Could not connect to Attributes API, falling back to LocalStorage:", err);
      fallbackToLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToLocalStorage = () => {
    const savedShoeSizes = localStorage.getItem('admin_shoe_sizes');
    setShoeSizes(savedShoeSizes ? JSON.parse(savedShoeSizes) : DEFAULT_SHOE_SIZES);

    const savedClothingSizes = localStorage.getItem('admin_clothing_sizes');
    setClothingSizes(savedClothingSizes ? JSON.parse(savedClothingSizes) : DEFAULT_CLOTHING_SIZES);

    const savedBrands = localStorage.getItem('admin_brands');
    setBrands(savedBrands ? JSON.parse(savedBrands) : DEFAULT_BRANDS);

    const savedSpecs = localStorage.getItem('admin_sport_specs');
    setSportSpecs(savedSpecs ? JSON.parse(savedSpecs) : DEFAULT_SPORT_SPECS);

    const savedDetailedColors = localStorage.getItem('admin_colors_detailed');
    if (savedDetailedColors) {
      setColors(JSON.parse(savedDetailedColors));
    } else {
      setColors(DEFAULT_COLORS);
    }
  };

  const markChanged = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Call Backend API
      const res = await fetch('http://localhost:8000/api/v1/attributes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brands,
          colors,
          shoe_sizes: shoeSizes,
          clothing_sizes: clothingSizes,
          sport_specs: sportSpecs
        })
      });

      // 2. Sync to LocalStorage
      localStorage.setItem('admin_shoe_sizes', JSON.stringify(shoeSizes));
      localStorage.setItem('admin_clothing_sizes', JSON.stringify(clothingSizes));
      localStorage.setItem('admin_brands', JSON.stringify(brands));
      localStorage.setItem('admin_sport_specs', JSON.stringify(sportSpecs));
      localStorage.setItem('admin_colors_detailed', JSON.stringify(colors));
      localStorage.setItem('admin_colors', JSON.stringify(colors.map(c => c.name)));

      setHasUnsavedChanges(false);

      if (res.ok) {
        notifications.show({
          title: 'Đã lưu thành công (API & DB)',
          message: 'Toàn bộ thuộc tính sản phẩm đã được đồng bộ vào cơ sở dữ liệu MongoDB!',
          color: 'green',
          icon: <Check size={18} />
        });
      } else {
        notifications.show({
          title: 'Đã lưu cục bộ',
          message: 'Dữ liệu đã được lưu trên máy của bạn (Server báo lỗi khi cập nhật).',
          color: 'amber'
        });
      }
    } catch {
      // Fallback local save
      localStorage.setItem('admin_shoe_sizes', JSON.stringify(shoeSizes));
      localStorage.setItem('admin_clothing_sizes', JSON.stringify(clothingSizes));
      localStorage.setItem('admin_brands', JSON.stringify(brands));
      localStorage.setItem('admin_sport_specs', JSON.stringify(sportSpecs));
      localStorage.setItem('admin_colors_detailed', JSON.stringify(colors));
      localStorage.setItem('admin_colors', JSON.stringify(colors.map(c => c.name)));

      setHasUnsavedChanges(false);
      notifications.show({
        title: 'Lưu ngoại tuyến',
        message: 'Đã lưu vào bộ nhớ trình duyệt (Không kết nối được API).',
        color: 'blue'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục toàn bộ thuộc tính về cài đặt chuẩn thể thao mặc định trên máy chủ?')) return;
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/attributes/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const doc = data.data || {};
        setBrands(doc.brands || DEFAULT_BRANDS);
        setColors(doc.colors || DEFAULT_COLORS);
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
      color: 'blue'
    });
  };

  // Add Item Helpers
  const addBrand = () => {
    const trimmed = newBrandInput.trim();
    if (trimmed && !brands.includes(trimmed)) {
      setBrands([...brands, trimmed]);
      setNewBrandInput('');
      markChanged();
    }
  };

  const removeBrand = (idx: number) => {
    setBrands(brands.filter((_, i) => i !== idx));
    markChanged();
  };

  const addSpec = () => {
    const trimmed = newSpecInput.trim();
    if (trimmed && !sportSpecs.includes(trimmed)) {
      setSportSpecs([...sportSpecs, trimmed]);
      setNewSpecInput('');
      markChanged();
    }
  };

  const removeSpec = (idx: number) => {
    setSportSpecs(sportSpecs.filter((_, i) => i !== idx));
    markChanged();
  };

  const addColor = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) {
      notifications.show({ title: 'Thiếu tên màu', message: 'Vui lòng nhập tên màu sắc', color: 'red' });
      return;
    }
    if (colors.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      notifications.show({ title: 'Đã tồn tại', message: 'Màu này đã có trong danh sách', color: 'amber' });
      return;
    }
    setColors([...colors, { name: trimmed, hex: newColorHex }]);
    setNewColorName('');
    markChanged();
  };

  const removeColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
    markChanged();
  };

  const updateColorHex = (idx: number, newHex: string) => {
    const updated = [...colors];
    updated[idx].hex = newHex;
    setColors(updated);
    markChanged();
  };

  const addShoeSize = () => {
    const trimmed = newShoeInput.trim();
    if (trimmed && !shoeSizes.includes(trimmed)) {
      setShoeSizes([...shoeSizes, trimmed]);
      setNewShoeInput('');
      markChanged();
    }
  };

  const removeShoeSize = (idx: number) => {
    setShoeSizes(shoeSizes.filter((_, i) => i !== idx));
    markChanged();
  };

  const sortShoeSizes = () => {
    const sorted = [...shoeSizes].sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
    setShoeSizes(sorted);
    markChanged();
    notifications.show({ title: 'Đã sắp xếp', message: 'Size giày đã được xếp theo thứ tự số tăng dần.', color: 'blue' });
  };

  const addClothingSize = () => {
    const trimmed = newClothInput.trim().toUpperCase();
    if (trimmed && !clothingSizes.includes(trimmed)) {
      setClothingSizes([...clothingSizes, trimmed]);
      setNewClothInput('');
      markChanged();
    }
  };

  const removeClothingSize = (idx: number) => {
    setClothingSizes(clothingSizes.filter((_, i) => i !== idx));
    markChanged();
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
    markChanged();
    notifications.show({ title: 'Đã sắp xếp', message: 'Size quần áo đã được sắp xếp chuẩn từ nhỏ đến lớn (XS -> 3XL).', color: 'blue' });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Page Header */}
      <AttributesHeader
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onResetDefaults={handleResetDefaults}
        onSave={handleSave}
      />

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. THƯƠNG HIỆU (BRANDS) */}
        <BrandAttributeSection
          brands={brands}
          newBrandInput={newBrandInput}
          onNewBrandInputChange={setNewBrandInput}
          onAddBrand={addBrand}
          onRemoveBrand={removeBrand}
        />

        {/* 2. MÀU SẮC (COLOR PICKER & HEX) */}
        <ColorAttributeSection
          colors={colors}
          newColorName={newColorName}
          newColorHex={newColorHex}
          onNewColorNameChange={setNewColorName}
          onNewColorHexChange={setNewColorHex}
          onAddColor={addColor}
          onRemoveColor={removeColor}
          onUpdateColorHex={updateColorHex}
        />

        {/* 3 & 4. SIZE GIÀY & SIZE QUẦN ÁO */}
        <SizeAttributeSection
          shoeSizes={shoeSizes}
          clothingSizes={clothingSizes}
          newShoeInput={newShoeInput}
          newClothInput={newClothInput}
          onNewShoeInputChange={setNewShoeInput}
          onNewClothInputChange={setNewClothInput}
          onAddShoeSize={addShoeSize}
          onRemoveShoeSize={removeShoeSize}
          onSortShoeSizes={sortShoeSizes}
          onAddClothingSize={addClothingSize}
          onRemoveClothingSize={removeClothingSize}
          onSortClothingSizes={sortClothingSizes}
        />
      </div>

      {/* 5. THÔNG SỐ THỂ THAO CHUYÊN SÂU (FULL WIDTH) */}
      <SportSpecAttributeSection
        sportSpecs={sportSpecs}
        newSpecInput={newSpecInput}
        onNewSpecInputChange={setNewSpecInput}
        onAddSpec={addSpec}
        onRemoveSpec={removeSpec}
      />
    </div>
  );
}
