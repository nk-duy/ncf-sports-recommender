'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Filter, Check } from 'lucide-react';

export default function ProductsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSportType = searchParams.get('sport_type') || '';
  const currentProductType = searchParams.get('product_type') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentSizes = searchParams.get('sizes') ? searchParams.get('sizes')!.split(',') : [];
  const currentColors = searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [];
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  // Tab size thủ công khi chưa chọn product_type
  const [activeSizeTab, setActiveSizeTab] = useState<'shoes' | 'apparel' | 'equipment'>('shoes');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset về trang 1 khi thay đổi bất kỳ bộ lọc nào
      params.delete('page');
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
    
    params.delete('page');
    router.push(pathname + '?' + params.toString());
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const isPriceSelected = (min: string, max: string) => {
    return minPrice === min && maxPrice === max;
  };

  const productTypes = ['Quần áo', 'Giày dép', 'Thiết bị', 'Phụ kiện'];
  const sportTypes = ['Bóng chuyền', 'Cầu lông', 'Chạy bộ', 'Đá bóng', 'Pickleball', 'Đa dụng', 'Dã ngoại'];
  const brands = ['Nike', 'Adidas', 'Puma', 'Asics', 'New Balance', 'Salomon', 'Unknown'];
  
  // Xác định nhóm kích cỡ phù hợp theo ngữ cảnh sản phẩm
  const catLower = currentCategory.toLowerCase();
  const isShoesContext = currentProductType === 'Giày dép' || catLower.includes('giày');
  const isApparelContext = currentProductType === 'Quần áo' || catLower.includes('áo') || catLower.includes('quần') || catLower.includes('đồ chạy');
  const isEquipmentContext = currentProductType === 'Thiết bị' || currentProductType === 'Phụ kiện' || catLower.includes('vợt') || catLower.includes('bóng') || catLower.includes('balo') || catLower.includes('mũ') || catLower.includes('phụ kiện');

  const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45'];
  const apparelSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const equipmentSizes = ['Tiêu chuẩn', 'Freesize', '3U', '4U', 'Size 4', 'Size 5', 'S/M', 'L/XL'];

  let displayedSizes: string[] = shoeSizes;
  let sizeLabel = 'Kích thước Giày (Size EU)';

  if (isApparelContext && !isShoesContext) {
    displayedSizes = apparelSizes;
    sizeLabel = 'Kích thước Quần áo (Size Á/Âu)';
  } else if (isEquipmentContext && !isShoesContext && !isApparelContext) {
    displayedSizes = equipmentSizes;
    sizeLabel = 'Kích thước Phụ kiện & Thiết bị';
  } else if (!isShoesContext && !isApparelContext && !isEquipmentContext) {
    // Nếu ở trang Tất cả sản phẩm, dùng tab được chọn
    if (activeSizeTab === 'apparel') {
      displayedSizes = apparelSizes;
      sizeLabel = 'Kích thước Quần áo';
    } else if (activeSizeTab === 'equipment') {
      displayedSizes = equipmentSizes;
      sizeLabel = 'Kích thước Phụ kiện & Thiết bị';
    } else {
      displayedSizes = shoeSizes;
      sizeLabel = 'Kích thước Giày dép';
    }
  }

  // Bảng màu chuẩn khớp với cơ sở dữ liệu tiếng Việt
  const colors = [
    { name: 'Đen', bg: 'bg-gray-900', border: 'border-gray-900', label: 'Đen' },
    { name: 'Trắng', bg: 'bg-white', border: 'border-gray-300', label: 'Trắng' },
    { name: 'Xanh Navy', bg: 'bg-blue-950', border: 'border-blue-950', label: 'Navy' },
    { name: 'Xanh Dương', bg: 'bg-blue-600', border: 'border-blue-600', label: 'Xanh' },
    { name: 'Đỏ', bg: 'bg-red-600', border: 'border-red-600', label: 'Đỏ' },
    { name: 'Xám', bg: 'bg-gray-400', border: 'border-gray-400', label: 'Xám' },
    { name: 'Vàng', bg: 'bg-yellow-400', border: 'border-yellow-400', label: 'Vàng' },
    { name: 'Cam', bg: 'bg-orange-500', border: 'border-orange-500', label: 'Cam' },
    { name: 'Xanh Lá', bg: 'bg-emerald-600', border: 'border-emerald-600', label: 'Lá' },
    { name: 'Hồng', bg: 'bg-pink-400', border: 'border-pink-400', label: 'Hồng' },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Bộ Lọc Sản Phẩm
          </h2>
          <button onClick={clearAll} className="text-xs text-blue-600 font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        {/* Môn thể thao (sport_type) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Môn thể thao</h3>
          <div className="space-y-3">
            {sportTypes.map((cat, idx) => {
              const checked = currentSportType === cat;
              return (
                <label key={idx} onClick={() => router.push(pathname + '?' + createQueryString('sport_type', checked ? '' : cat))} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{cat}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Loại sản phẩm (product_type) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Loại sản phẩm</h3>
          <div className="space-y-3">
            {productTypes.map((cat, idx) => {
              const checked = currentProductType === cat;
              return (
                <label key={idx} onClick={() => router.push(pathname + '?' + createQueryString('product_type', checked ? '' : cat))} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
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
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
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
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{gender}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Kích thước tương ứng với sản phẩm */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{sizeLabel}</h3>
          </div>

          {/* Nếu chưa chọn ngữ cảnh loại sản phẩm cụ thể, cho phép chuyển tab nhanh */}
          {!isShoesContext && !isApparelContext && !isEquipmentContext && (
            <div className="flex rounded-lg bg-gray-100 p-1 mb-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSizeTab('shoes')}
                className={`flex-1 py-1 rounded-md transition-all ${activeSizeTab === 'shoes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Giày
              </button>
              <button
                type="button"
                onClick={() => setActiveSizeTab('apparel')}
                className={`flex-1 py-1 rounded-md transition-all ${activeSizeTab === 'apparel' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Quần áo
              </button>
              <button
                type="button"
                onClick={() => setActiveSizeTab('equipment')}
                className={`flex-1 py-1 rounded-md transition-all ${activeSizeTab === 'equipment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Phụ kiện
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {displayedSizes.map((size) => {
              const isSelected = currentSizes.includes(size);
              return (
                <button 
                  key={size}
                  onClick={() => toggleArrayParam('sizes', size, currentSizes)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all truncate ${isSelected ? 'border-blue-600 text-blue-700 bg-blue-50 shadow-sm' : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'}`}
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

        {/* Bảng màu khớp với CSDL */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Bảng màu sắc</h3>
            {currentColors.length > 0 && (
              <span className="text-[11px] font-semibold text-blue-600">
                Đã chọn {currentColors.length}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {colors.map((color, idx) => {
              const isSelected = currentColors.includes(color.name);
              return (
                <button 
                  key={idx}
                  title={color.name}
                  onClick={() => toggleArrayParam('colors', color.name, currentColors)}
                  className="flex flex-col items-center gap-1 group/color p-1 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div 
                    className={`w-7 h-7 rounded-full border-2 ${color.bg} ${color.border} flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-offset-2 ring-blue-600 scale-105' : 'group-hover/color:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <Check 
                        size={12} 
                        className={color.name === 'Trắng' || color.name === 'Vàng' ? 'text-gray-900' : 'text-white'} 
                        strokeWidth={3} 
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium leading-tight truncate ${isSelected ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                    {color.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
