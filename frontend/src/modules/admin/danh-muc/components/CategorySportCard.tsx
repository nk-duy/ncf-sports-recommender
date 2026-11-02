'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MegaMenuSport } from '../types';
import { getSportTheme } from '../utils/sportTheme';
import CategorySportCardHeader from './CategorySportCardHeader';
import CategoryProductTypeBlock from './CategoryProductTypeBlock';

export { getSportTheme };

interface CategorySportCardProps {
  sport: MegaMenuSport;
  sIdx: number;
  totalSports: number;
  isExpanded: boolean;
  onToggleExpand: (sIdx: number) => void;
  onMoveSport: (sIdx: number, direction: 'up' | 'down') => void;
  onToggleVisibility: (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => void;
  onRemoveSport: (sIdx: number) => void;
  onUpdateSportName: (sIdx: number, newName: string) => void;
  onMoveProductType: (sIdx: number, pIdx: number, direction: 'up' | 'down') => void;
  onRemoveProductType: (sIdx: number, pIdx: number) => void;
  onUpdateProductTypeName: (sIdx: number, pIdx: number, newName: string) => void;
  onAddProductType: (sIdx: number, pTypeName: string) => void;
  onMoveCategory: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    direction: 'up' | 'down'
  ) => void;
  onRemoveCategory: (sIdx: number, pIdx: number, cIdx: number) => void;
  onUpdateCategoryName: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    newName: string
  ) => void;
  onAddCategory: (sIdx: number, pIdx: number, catName: string) => void;
  productCountsBySport?: Record<string, number>;
  productCountsByCategory?: Record<string, number>;
}

export default function CategorySportCard({
  sport,
  sIdx,
  totalSports,
  isExpanded,
  onToggleExpand,
  onMoveSport,
  onToggleVisibility,
  onRemoveSport,
  onUpdateSportName,
  onMoveProductType,
  onRemoveProductType,
  onUpdateProductTypeName,
  onAddProductType,
  onMoveCategory,
  onRemoveCategory,
  onUpdateCategoryName,
  onAddCategory,
  productCountsBySport = {},
  productCountsByCategory = {},
}: CategorySportCardProps) {
  const [newProdName, setNewProdName] = useState('');
  const sportProductCount = productCountsBySport[sport.sport_type] || 0;
  const totalSubs = sport.product_types.reduce(
    (sum, p) => sum + (p.categories?.length || 0),
    0
  );

  const handleAddNewProd = () => {
    if (!newProdName.trim()) return;
    onAddProductType(sIdx, newProdName.trim());
    setNewProdName('');
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
        sport.is_hidden
          ? 'border-slate-200/80 opacity-60 bg-slate-50/40'
          : isExpanded
          ? 'border-blue-300 ring-2 ring-blue-500/10'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <CategorySportCardHeader
        sport={sport}
        sIdx={sIdx}
        totalSports={totalSports}
        isExpanded={isExpanded}
        sportProductCount={sportProductCount}
        totalSubs={totalSubs}
        onToggleExpand={onToggleExpand}
        onMoveSport={onMoveSport}
        onToggleVisibility={onToggleVisibility}
        onRemoveSport={onRemoveSport}
        onUpdateSportName={onUpdateSportName}
      />

      {isExpanded && (
        <div className="p-5 border-t border-gray-100 bg-slate-50/40 space-y-5">
          {sport.product_types.map((prod, pIdx) => (
            <CategoryProductTypeBlock
              key={pIdx}
              prod={prod}
              sIdx={sIdx}
              pIdx={pIdx}
              totalProductTypes={sport.product_types.length}
              productCountsByCategory={productCountsByCategory}
              onMoveProductType={onMoveProductType}
              onRemoveProductType={onRemoveProductType}
              onUpdateProductTypeName={onUpdateProductTypeName}
              onToggleVisibility={onToggleVisibility}
              onMoveCategory={onMoveCategory}
              onRemoveCategory={onRemoveCategory}
              onUpdateCategoryName={onUpdateCategoryName}
              onAddCategory={onAddCategory}
            />
          ))}

          {/* Bar Thêm Loại sản phẩm mới trong môn này */}
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-3 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder={`Thêm loại sản phẩm cho ${sport.sport_type} (VD: Quần áo, Giày dép, Vợt & Bóng...)`}
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNewProd();
              }}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:border-blue-500 outline-none transition w-full"
            />
            <button
              type="button"
              onClick={handleAddNewProd}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-2xs shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} />
              <span>Thêm loại sản phẩm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
