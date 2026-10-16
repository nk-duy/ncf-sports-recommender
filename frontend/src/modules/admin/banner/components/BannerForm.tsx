"use client";

import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Loader } from "@mantine/core";

interface BannerFormProps {
  newTitle: string;
  setNewTitle: (val: string) => void;
  newSubtitle: string;
  setNewSubtitle: (val: string) => void;
  newBadge: string;
  setNewBadge: (val: string) => void;
  newLink: string;
  setNewLink: (val: string) => void;
  imageMode: 'upload' | 'url';
  setImageMode: (mode: 'upload' | 'url') => void;
  newImageFile: File | null;
  setNewImageFile: (file: File | null) => void;
  newImageUrl: string;
  setNewImageUrl: (val: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BannerForm({
  newTitle,
  setNewTitle,
  newSubtitle,
  setNewSubtitle,
  newBadge,
  setNewBadge,
  newLink,
  setNewLink,
  imageMode,
  setImageMode,
  newImageFile,
  setNewImageFile,
  newImageUrl,
  setNewImageUrl,
  submitting,
  onSubmit,
}: BannerFormProps) {
  const previewSource = imageMode === 'upload' 
    ? (newImageFile ? URL.createObjectURL(newImageFile) : "")
    : newImageUrl.trim();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Plus size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Thêm Banner Quảng Cáo Mới</h2>
          <p className="text-xs text-gray-500">Hiển thị tức thì trên Slider đầu trang chủ</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tiêu đề Banner (Hiển thị lớn) *
            </label>
            <input 
              required
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: SIÊU SALE BÙNG NỔ THÁNG 10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Huy hiệu nổi bật (Badge)
            </label>
            <input 
              type="text" 
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="VD: ⚡ SIÊU SALE 50%, NEW..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả phụ (Subtitle)
            </label>
            <input 
              type="text" 
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: Giảm thêm 100k cho đơn từ 500k hôm nay"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Đường dẫn liên kết (Link khi click)
            </label>
            <input 
              type="text" 
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: /san-pham?sport_type=Pickleball hoặc /khuyen-mai"
            />
          </div>
        </div>

        {/* Image Source Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Hình ảnh Banner * <span className="text-xs font-normal text-gray-500">(Khuyến nghị ngang 1920x800)</span>
            </label>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  imageMode === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tải tệp lên
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  imageMode === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Nhập link URL
              </button>
            </div>
          </div>

          {imageMode === 'upload' ? (
            <div className="border-2 border-gray-200 border-dashed rounded-2xl p-6 text-center hover:border-blue-400 transition bg-gray-50/50">
              {previewSource ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={previewSource} 
                    alt="Preview" 
                    className="max-h-52 w-auto object-cover rounded-xl shadow-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setNewImageFile(null)}
                    className="mt-3 text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Bỏ chọn ảnh này
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="mx-auto h-10 w-10 text-gray-400" strokeWidth={1.5} />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="file-upload" className="cursor-pointer font-bold text-blue-600 hover:text-blue-700">
                      Chọn tệp ảnh từ máy tính
                      <input 
                        id="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="image/*" 
                        onChange={(e) => setNewImageFile(e.target.files?.[0] || null)} 
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP lên đến 10MB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://images.unsplash.com/photo-... (Dán link ảnh tại đây)"
              />
              {previewSource && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 inline-block">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Xem trước link ảnh:</p>
                  <img 
                    src={previewSource} 
                    alt="Preview from URL" 
                    className="max-h-48 w-auto object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition hover:shadow-md disabled:opacity-50"
          >
            {submitting ? <Loader size="xs" color="white" /> : <Plus size={18} />}
            <span>{submitting ? "Đang xử lý tạo banner..." : "Tạo & Lưu Banner Mới"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
