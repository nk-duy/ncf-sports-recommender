'use client';
import React, { useState } from 'react';
import { Plus, X, Star } from 'lucide-react';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import { FALLBACK_PRODUCT_IMG } from '../../types';

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
  const [uploading, setUploading] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || '');
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    e.target.value = '';

    setUploading(true);
    const uploadedUrls: string[] = [];
    const apiBaseUrl = resolveApiBaseUrl();

    for (const file of files) {
      let fileUrl = '';
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${apiBaseUrl}/uploads/`, {
          method: 'POST',
          body: form,
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.url) fileUrl = data.url;
        }
      } catch {
        // Fallback sang DataURL nếu máy chủ tĩnh không phản hồi
      }
      if (!fileUrl) {
        fileUrl = await readFileAsDataUrl(file);
      }
      if (fileUrl) {
        uploadedUrls.push(fileUrl);
      }
    }

    const updatedImages = Array.from(new Set([...images, ...uploadedUrls]));
    const nextPrimary = imageUrl && updatedImages.includes(imageUrl)
      ? imageUrl
      : (updatedImages[0] || '');
    onChangeImages(updatedImages, nextPrimary);
    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const newImages = images.filter((_, i) => i !== indexToRemove);
    const nextPrimary =
      imageUrl && imageUrl !== removedUrl && newImages.includes(imageUrl)
        ? imageUrl
        : (newImages[0] || '');
    onChangeImages(newImages, nextPrimary);
  };

  const handleSetPrimary = (targetUrl: string) => {
    const reordered = [targetUrl, ...images.filter((u) => u !== targetUrl)];
    onChangeImages(reordered, targetUrl);
  };

  const handleAddUrl = () => {
    const val = urlInput.trim();
    if (!val) return;
    const newImages = images.includes(val) ? images : [...images, val];
    const nextPrimary = imageUrl && newImages.includes(imageUrl) ? imageUrl : newImages[0];
    onChangeImages(newImages, nextPrimary);
    setUrlInput('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700">Hình ảnh sản phẩm *</label>
        {images.length > 1 && (
          <span className="text-xs text-gray-500">Nhấp vào ảnh để đặt làm ảnh đại diện chính</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3 items-start">
        {images.map((imgUrl, index) => {
          const isPrimary = (imageUrl ? imgUrl === imageUrl : index === 0);
          return (
            <div
              key={`${imgUrl}-${index}`}
              onClick={() => handleSetPrimary(imgUrl)}
              className={`relative group w-24 h-24 border-2 rounded-xl overflow-hidden bg-white shadow-xs flex-shrink-0 cursor-pointer transition-all ${
                isPrimary ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'
              }`}
              title={isPrimary ? 'Ảnh đại diện chính' : 'Nhấp để đặt làm ảnh chính'}
            >
              <img
                src={imgUrl}
                alt={`Product ${index}`}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_PRODUCT_IMG;
                }}
              />
              {isPrimary && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs">
                  <Star size={9} className="fill-white" /> Chính
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                title="Xóa ảnh này"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        <label className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors text-gray-400 hover:text-blue-500">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Plus size={24} />
          <span className="text-[10px] mt-1 font-semibold">
            {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          </span>
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onBlur={() => {
            if (urlInput.trim()) {
              handleAddUrl();
            }
          }}
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
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Thêm URL
        </button>
      </div>
    </div>
  );
}
