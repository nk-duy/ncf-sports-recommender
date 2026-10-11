"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash, Image as ImageIcon } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";

export default function BannerManagement() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/banners");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newImage || !newTitle) {
      notifications.show({ title: "Lỗi", message: "Vui lòng nhập tiêu đề và chọn ảnh", color: "red" });
      return;
    }

    setUploading(true);
    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append("file", newImage);
      
      const uploadRes = await fetch("http://localhost:8000/api/v1/uploads/", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Create banner
      const bannerRes = await fetch("http://localhost:8000/api/v1/banners/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          image_url: imageUrl,
          link: newLink || "#",
          is_active: true,
          position: banners.length + 1
        })
      });

      if (bannerRes.ok) {
        notifications.show({ title: "Thành công", message: "Đã thêm banner mới", color: "green" });
        setNewTitle("");
        setNewLink("");
        setNewImage(null);
        fetchBanners();
      }
    } catch (error) {
      console.error(error);
      notifications.show({ title: "Lỗi", message: "Có lỗi xảy ra", color: "red" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa banner này?")) return;
    try {
      await fetch(`http://localhost:8000/api/v1/banners/${id}`, { method: "DELETE" });
      notifications.show({ title: "Thành công", message: "Đã xóa banner", color: "green" });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Banner</h1>

      {/* Form thêm banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Thêm Banner Mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề (Hiển thị to)</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="VD: SIÊU SALE 9.9 \n GIẢM 50%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Đường dẫn (Link khi click)</label>
            <input 
              type="text" 
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="VD: /san-pham hoặc #khuyen-mai"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Hình ảnh Banner (Nên dùng ảnh ngang 1920x800)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative overflow-hidden">
              {newImage ? (
                <div className="relative w-full flex flex-col items-center">
                  <img 
                    src={URL.createObjectURL(newImage)} 
                    alt="Preview" 
                    className="max-h-64 object-contain rounded-lg shadow-sm border border-gray-200"
                  />
                  <button
                    onClick={() => setNewImage(null)}
                    className="mt-3 text-sm text-red-600 font-medium hover:text-red-800"
                  >
                    Xóa ảnh này
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Tải ảnh lên</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
                    </label>
                    <p className="pl-1">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF lên tới 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={handleCreate}
          disabled={uploading}
          className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {uploading ? <Loader size="xs" color="white" /> : <Plus size={18} />}
          {uploading ? "Đang tải lên và xử lý..." : "Tải lên & Tạo Banner"}
        </button>
      </div>

      {/* Danh sách Banner */}
      <h2 className="text-lg font-bold mt-8 mb-4">Danh sách Banner hiện tại</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-10"><Loader color="blue" /></div>
        ) : banners.map((banner: any) => (
          <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group hover:shadow-md transition">
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
              <img src={banner.image_url} alt={banner.title} className="w-full h-full object-contain p-4" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(banner._id)}
                  className="bg-red-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 shadow-lg hover:bg-red-600"
                  title="Xóa Banner"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 line-clamp-1 whitespace-pre-line">{banner.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1 flex items-center gap-1">
                <span className="font-medium text-gray-700">Link:</span> 
                <a href={banner.link} target="_blank" className="text-blue-500 hover:underline">{banner.link}</a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
