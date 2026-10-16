'use client';
import React from 'react';

interface ProductCategoryCascadeProps {
  sportType: string;
  productType: string;
  selectedCategories: string[];
  menuSports: any[];
  onChangeSport: (sport: string, firstProductType: string) => void;
  onChangeProductType: (productType: string) => void;
  onToggleCategory: (category: string) => void;
}

export default function ProductCategoryCascade({
  sportType,
  productType,
  selectedCategories,
  menuSports,
  onChangeSport,
  onChangeProductType,
  onToggleCategory,
}: ProductCategoryCascadeProps) {
  const currentSportObj = menuSports.find(s => s.sport_type === sportType);
  const prodTypes = currentSportObj?.product_types?.map((pt: any) => pt.product_type) || ['Quần áo', 'Giày dép', 'Phụ kiện', 'Thiết bị'];
  const currentPTObj = currentSportObj?.product_types?.find((pt: any) => pt.product_type === productType);
  const rawSubCats = currentPTObj?.categories || [];

  // Chuẩn hóa: categories có thể là string[] hoặc MegaMenuCategory[] ({category: string, is_hidden?: boolean})
  const subCats: string[] = rawSubCats
    .map((item: any) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item.category) {
        if (item.is_hidden) return null; // Bỏ qua danh mục đang bị ẩn
        return item.category;
      }
      return null;
    })
    .filter(Boolean) as string[];

  return (
    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Môn thể thao *</label>
          <select 
            value={sportType} 
            onChange={e => {
              const selected = e.target.value;
              const sportObj = menuSports.find(s => s.sport_type === selected);
              const firstPT = sportObj?.product_types?.[0]?.product_type || "Quần áo";
              onChangeSport(selected, firstPT);
            }} 
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {menuSports.length > 0 ? (
              menuSports.map(s => (
                <option key={s.sport_type} value={s.sport_type}>{s.sport_type}</option>
              ))
            ) : (
              <>
                <option value="Đá bóng">Đá bóng (Football)</option>
                <option value="Cầu lông">Cầu lông (Badminton)</option>
                <option value="Pickleball">Pickleball</option>
                <option value="Chạy bộ">Chạy bộ (Running)</option>
                <option value="Bóng chuyền">Bóng chuyền</option>
                <option value="Bóng rổ">Bóng rổ</option>
                <option value="Dã ngoại">Dã ngoại / Leo núi</option>
                <option value="Đa dụng">Đa dụng (Gym / Yoga)</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Loại sản phẩm *</label>
          <select 
            value={productType} 
            onChange={e => onChangeProductType(e.target.value)} 
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {prodTypes.map((pt: string) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-categories from API menu */}
      {subCats.length > 0 && (
        <div className="pt-2 border-t border-emerald-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-900">
              Danh mục con chi tiết (Chọn 1 hoặc nhiều):
            </span>
            <span className="text-[11px] text-gray-500">{selectedCategories.length} đã chọn</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subCats.map(catName => {
              const isSelected = selectedCategories.includes(catName);
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => onToggleCategory(catName)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition border ${
                    isSelected 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
