'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
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

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
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
      </div>
    </div>
  );
}
