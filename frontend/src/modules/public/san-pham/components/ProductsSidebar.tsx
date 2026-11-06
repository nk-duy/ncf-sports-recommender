'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, SlidersHorizontal, Check } from 'lucide-react';
import {
  BRANDS,
  GENDERS,
  PRODUCT_TYPES,
  SPORT_TYPES,
  resolveSizeFilterContext,
  type SizeTabType,
} from '../constants/sidebarFilters';
import SidebarCheckboxGroup from './SidebarCheckboxGroup';
import SidebarSizePriceColor from './SidebarSizePriceColor';

export default function ProductsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentSportTypes = searchParams.get('sport_type')
    ? searchParams.get('sport_type')!.split(',').filter(Boolean)
    : [];
  const currentProductTypes = searchParams.get('product_type')
    ? searchParams.get('product_type')!.split(',').filter(Boolean)
    : [];
  const currentBrands = searchParams.get('brand')
    ? searchParams.get('brand')!.split(',').filter(Boolean)
    : [];
  const currentGenders = searchParams.get('gender')
    ? searchParams.get('gender')!.split(',').filter(Boolean)
    : [];
  const currentSizes = searchParams.get('sizes')
    ? searchParams.get('sizes')!.split(',').filter(Boolean)
    : [];
  const currentColors = searchParams.get('colors')
    ? searchParams.get('colors')!.split(',').filter(Boolean)
    : [];
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const [activeSizeTab, setActiveSizeTab] = useState<SizeTabType>('shoes');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Xóa category / sub_category khi thay đổi sport_type hoặc product_type để tránh xung đột
      if (name === 'sport_type' || name === 'product_type') {
        params.delete('category');
        params.delete('sub_category');
      }

      // Reset về trang 1 khi thay đổi bất kỳ bộ lọc nào
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  const toggleArrayParam = (name: string, value: string, currentArray: string[]) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    const val = newArray.length > 0 ? newArray.join(',') : '';
    router.push(pathname + '?' + createQueryString(name, val));
  };

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('min_price', min);
    else params.delete('min_price');

    if (max) params.set('max_price', max);
    else params.delete('max_price');

    params.delete('page');
    router.push(pathname + '?' + params.toString());
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const { displayedSizes, sizeLabel, showQuickSizeTabs } = resolveSizeFilterContext(
    currentProductTypes,
    currentCategory,
    activeSizeTab
  );

  const totalSelectedFilters =
    currentSportTypes.length +
    currentProductTypes.length +
    currentBrands.length +
    currentGenders.length +
    currentSizes.length +
    currentColors.length +
    (currentCategory ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const renderFilterContent = () => (
    <>
      <SidebarCheckboxGroup
        title="Môn thể thao"
        options={SPORT_TYPES}
        selectedValues={currentSportTypes}
        onToggle={(val) => toggleArrayParam('sport_type', val, currentSportTypes)}
      />

      <SidebarCheckboxGroup
        title="Loại sản phẩm"
        options={PRODUCT_TYPES}
        selectedValues={currentProductTypes}
        onToggle={(val) => toggleArrayParam('product_type', val, currentProductTypes)}
      />

      <SidebarCheckboxGroup
        title="Thương hiệu"
        options={BRANDS}
        selectedValues={currentBrands}
        onToggle={(val) => toggleArrayParam('brand', val, currentBrands)}
      />

      <SidebarCheckboxGroup
        title="Giới tính"
        options={GENDERS}
        selectedValues={currentGenders}
        onToggle={(val) => toggleArrayParam('gender', val, currentGenders)}
      />

      <SidebarSizePriceColor
        sizeLabel={sizeLabel}
        showQuickSizeTabs={showQuickSizeTabs}
        activeSizeTab={activeSizeTab}
        onChangeSizeTab={setActiveSizeTab}
        displayedSizes={displayedSizes}
        currentSizes={currentSizes}
        onToggleSize={(size) => toggleArrayParam('sizes', size, currentSizes)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangePrice={handlePriceChange}
        currentColors={currentColors}
        onToggleColor={(colorName) => toggleArrayParam('colors', colorName, currentColors)}
      />
    </>
  );

  return (
    <div className="w-full">
      {/* 1. MOBILE TRIGGER (< lg): Nút "Bộ lọc & Sắp xếp" gọn gàng ở đầu trang */}
      <div className="block lg:hidden mb-4">
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs shadow-blue-500/20 transition cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span>Bộ lọc &amp; Sắp xếp</span>
            {totalSelectedFilters > 0 && (
              <span className="ml-1 bg-white text-blue-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {totalSelectedFilters}
              </span>
            )}
          </button>

          {totalSelectedFilters > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* 2. MOBILE DRAWER (< lg): Ngăn kéo trượt hiển thị toàn bộ bộ lọc */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-[88vw] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header Drawer */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100 bg-gray-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Bộ Lọc Sản Phẩm</h3>
                {totalSelectedFilters > 0 && (
                  <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                    {totalSelectedFilters}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {renderFilterContent()}
            </div>

            {/* Footer Drawer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/90 flex items-center gap-3 shrink-0">
              {totalSelectedFilters > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-xs shadow-blue-500/20 cursor-pointer"
              >
                <Check size={14} />
                <span>Xem kết quả</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR (lg:block): Giữ nguyên 100% bố cục Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Bộ Lọc Sản Phẩm</span>
            {totalSelectedFilters > 0 && (
              <span className="text-[11px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                {totalSelectedFilters}
              </span>
            )}
          </h2>
          {totalSelectedFilters > 0 && (
            <button onClick={clearAll} className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">
              Xóa tất cả
            </button>
          )}
        </div>

        {renderFilterContent()}
      </div>
    </div>
  );
}
