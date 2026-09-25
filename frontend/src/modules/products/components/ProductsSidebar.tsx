'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function ProductsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentSizes = searchParams.get('sizes') ? searchParams.get('sizes')!.split(',') : [];
  const currentColors = searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [];
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleArrayParam = (name: string, value: string, currentArray: string[]) => {
    let newArray = [...currentArray];
    if (newArray.includes(value)) {
      newArray = newArray.filter(v => v !== value);
    } else {
      newArray.push(value);
    }
    router.push(pathname + '?' + createQueryString(name, newArray.join(',')));
  };

  const handlePriceChange = (min: string, max: string) => {
    let params = new URLSearchParams(searchParams.toString());
    if (min) params.set('min_price', min);
    else params.delete('min_price');
    
    if (max) params.set('max_price', max);
    else params.delete('max_price');
    
    router.push(pathname + '?' + params.toString());
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const isPriceSelected = (min: string, max: string) => {
    return minPrice === min && maxPrice === max;
  };

  const categories = [
    'Giày Chạy Bộ (Running)', 'Tập Gym & Fitness', 'Chạy Trail & Dã Ngoại', 'Sneaker Thể Thao / Lifestyle'
  ];
  
  const brands = ['Nike', 'Adidas', 'Puma', 'Asics', 'New Balance', 'Salomon', 'Unknown'];
  
  const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  
  const colors = [
    { name: 'White', bg: 'bg-white', border: 'border-gray-200' },
    { name: 'Black', bg: 'bg-gray-900', border: 'border-gray-900' },
    { name: 'Blue', bg: 'bg-blue-600', border: 'border-blue-600' },
    { name: 'Red', bg: 'bg-red-500', border: 'border-red-500' },
    { name: 'Grey', bg: 'bg-gray-400', border: 'border-gray-400' },
    { name: 'Navy', bg: 'bg-blue-900', border: 'border-blue-900' },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Sản Phẩm
          </h2>
          <button onClick={clearAll} className="text-xs text-blue-600 font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        {/* Môn thể thao (Category) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Môn thể thao</h3>
          <div className="space-y-3">
            {categories.map((cat, idx) => {
              const checked = currentCategory === cat;
              return (
                <label key={idx} onClick={() => router.push(pathname + '?' + createQueryString('category', checked ? '' : cat))} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{cat}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Thương hiệu (Brand) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Thương hiệu</h3>
          <div className="space-y-3">
            {brands.map((brand, idx) => {
              const checked = currentBrand === brand;
              return (
                <label key={idx} onClick={() => router.push(pathname + '?' + createQueryString('brand', checked ? '' : brand))} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{brand}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Giới tính (Gender) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Giới tính</h3>
          <div className="space-y-3">
            {['Nam', 'Nữ', 'Unisex'].map((gender, idx) => {
              const checked = currentGender === gender;
              return (
                <label key={idx} onClick={() => router.push(pathname + '?' + createQueryString('gender', checked ? '' : gender))} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{gender}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Kích thước */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Kích thước (Size EU)</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const isSelected = currentSizes.includes(size);
              return (
                <button 
                  key={size}
                  onClick={() => toggleArrayParam('sizes', size, currentSizes)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${isSelected ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mức giá */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mức giá</h3>
          <div className="space-y-3">
            {[
              { label: 'Tất cả mức giá', min: '', max: '' },
              { label: 'Dưới 1.000.000đ', min: '', max: '1000000' },
              { label: '1.000.000đ - 2.500.000đ', min: '1000000', max: '2500000' },
              { label: 'Trên 2.500.000đ', min: '2500000', max: '' },
            ].map((item, idx) => {
              const checked = isPriceSelected(item.min, item.max);
              return (
                <label key={idx} onClick={() => handlePriceChange(item.min, item.max)} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${checked ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                    {checked && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Bảng màu */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Bảng màu</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, idx) => {
              const isSelected = currentColors.includes(color.name);
              return (
                <button 
                  key={idx}
                  title={color.name}
                  onClick={() => toggleArrayParam('colors', color.name, currentColors)}
                  className={`w-7 h-7 rounded-full border-2 ${color.bg} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 ' + color.border : color.border}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
