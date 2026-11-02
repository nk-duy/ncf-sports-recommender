'use client';

import CategoryStats from './CategoryStats';
import CategoryToolbar from './CategoryToolbar';
import CategorySportCard from './CategorySportCard';
import CategoryPreviewModal from './CategoryPreviewModal';
import { useMegaMenuManager } from '../hooks/useMegaMenuManager';

export default function MegaMenuManager() {
  const {
    mounted,
    menu,
    expandedSports,
    saving,
    isPreviewOpen,
    setIsPreviewOpen,
    searchQuery,
    handleSearchChange,
    newSport,
    setNewSport,
    totalProductsCount,
    productCountsBySport,
    productCountsByCategory,
    filteredIndices,
    saveMenu,
    handleResetDefault,
    handleToggleExpand,
    handleExpandAll,
    handleCollapseAll,
    handleAddSport,
    handleRemoveSport,
    handleMoveSport,
    handleUpdateSportName,
    handleAddProductType,
    handleRemoveProductType,
    handleMoveProductType,
    handleUpdateProductTypeName,
    handleAddCategory,
    handleRemoveCategory,
    handleMoveCategory,
    handleUpdateCategoryName,
    handleToggleVisibility,
  } = useMegaMenuManager();

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* 1. Thanh công cụ & Điều khiển Toolbar */}
      <CategoryToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        newSport={newSport}
        onNewSportChange={setNewSport}
        onAddSport={handleAddSport}
        onSaveMenu={saveMenu}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onResetDefault={handleResetDefault}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        saving={saving}
        isAllExpanded={expandedSports.length === menu.length && menu.length > 0}
      />

      {/* 2. Thẻ KPI Thống kê danh mục */}
      <CategoryStats menu={menu} totalProductsCount={totalProductsCount} />

      {/* 3. Danh sách Thẻ Môn Thể Thao & Phân cấp danh mục */}
      <div className="space-y-4">
        {filteredIndices.map((sIdx) => {
          const sport = menu[sIdx];
          if (!sport) return null;

          return (
            <CategorySportCard
              key={`${sport.sport_type}-${sIdx}`}
              sport={sport}
              sIdx={sIdx}
              totalSports={menu.length}
              isExpanded={expandedSports.includes(sIdx)}
              onToggleExpand={handleToggleExpand}
              onMoveSport={handleMoveSport}
              onToggleVisibility={handleToggleVisibility}
              onRemoveSport={handleRemoveSport}
              onUpdateSportName={handleUpdateSportName}
              onMoveProductType={handleMoveProductType}
              onRemoveProductType={handleRemoveProductType}
              onUpdateProductTypeName={handleUpdateProductTypeName}
              onAddProductType={handleAddProductType}
              onMoveCategory={handleMoveCategory}
              onRemoveCategory={handleRemoveCategory}
              onUpdateCategoryName={handleUpdateCategoryName}
              onAddCategory={handleAddCategory}
              productCountsBySport={productCountsBySport}
              productCountsByCategory={productCountsByCategory}
            />
          );
        })}

        {filteredIndices.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <p className="text-gray-500 font-medium text-sm">
              Không tìm thấy môn thể thao hay danh mục nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => handleSearchChange('')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Xóa từ khóa tìm kiếm
            </button>
          </div>
        )}
      </div>

      {/* 4. Modal Xem trước MegaMenu Trực quan */}
      <CategoryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        menu={menu}
      />
    </div>
  );
}
