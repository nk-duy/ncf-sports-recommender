'use client';

import AttributesHeader from './AttributesHeader';
import BrandAttributeSection from './BrandAttributeSection';
import ColorAttributeSection from './ColorAttributeSection';
import SizeAttributeSection from './SizeAttributeSection';
import SportSpecAttributeSection from './SportSpecAttributeSection';
import { useAdminAttributes } from '../hooks/useAdminAttributes';

export default function AdminAttributesPage() {
  const {
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
  } = useAdminAttributes();

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      <AttributesHeader
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onResetDefaults={handleResetDefaults}
        onSave={handleSave}
      />

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
