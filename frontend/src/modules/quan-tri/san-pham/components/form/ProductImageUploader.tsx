'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  imageUrl: string;
  onChangeImages: (images: string[], primaryUrl: string) => void;
}

export default function ProductImageUploader({
  images,
  imageUrl,
  onChangeImages,
}: ProductImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let updatedImages = [...images];
    const processFile = (index: number) => {
      if (index >= files.length) {
        onChangeImages(updatedImages, updatedImages.length > 0 ? updatedImages[0] : imageUrl);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedImages.push(reader.result as string);
        processFile(index + 1);
      };
      reader.readAsDataURL(files[index]);
    };
    processFile(0);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, i) => i !== indexToRemove);
    onChangeImages(newImages, newImages.length > 0 ? newImages[0] : '');
  };

  const handleAddUrl = () => {
    const val = urlInput.trim();
    if (val) {
      const newImages = [...images, val];
      onChangeImages(newImages, newImages[0]);
      setUrlInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
      <div className="flex flex-wrap gap-3 items-start">
        {images.map((imgUrl, index) => (
          <div key={index} className="relative group w-24 h-24 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs flex-shrink-0">
            <img src={imgUrl} alt={`Product ${index}`} className="w-full h-full object-contain p-1" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
              title="Xóa ảnh này"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors text-gray-400 hover:text-blue-500">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <Plus size={24} />
          <span className="text-[10px] mt-1 font-semibold">Tải ảnh lên</span>
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          className="flex-1 px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Hoặc dán URL hình ảnh vào đây..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-sm font-semibold transition-colors"
        >
          Thêm URL
        </button>
      </div>
    </div>
  );
}
