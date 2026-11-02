"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { getAuthHeaders } from "@/shared/lib/authHeader";
import { BannerItem } from "../types";
import BannerForm from "./BannerForm";
import BannerList from "./BannerList";

export default function BannerManagement() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newLink, setNewLink] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/banners`);
      if (res.ok) {
        const data: unknown = await res.json();
        setBanners(Array.isArray(data) ? (data as BannerItem[]) : []);
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Không thể tải danh sách banner",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notifications.show({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tiêu đề banner",
        color: "amber",
      });
      return;
    }

    if (imageMode === "upload" && !newImageFile) {
      notifications.show({
        title: "Thiếu ảnh",
        message: "Vui lòng chọn ảnh để tải lên",
        color: "amber",
      });
      return;
    }

    if (imageMode === "url" && !newImageUrl.trim()) {
      notifications.show({
        title: "Thiếu link ảnh",
        message: "Vui lòng nhập đường dẫn URL hình ảnh",
        color: "amber",
      });
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = newImageUrl.trim();

      if (imageMode === "upload" && newImageFile) {
        const formData = new FormData();
        formData.append("file", newImageFile);

        const uploadRes = await fetch(`${API_URL}/uploads/`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
        const uploadData: { url: string } = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      const bannerPayload = {
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || null,
        badge: newBadge.trim() || null,
        image_url: finalImageUrl,
        link: newLink.trim() || "/san-pham",
        is_active: true,
        position: banners.length + 1,
      };

      const res = await fetch(`${API_URL}/banners/`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(bannerPayload),
      });

      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã thêm banner mới thành công!",
          color: "green",
        });
        setNewTitle("");
        setNewSubtitle("");
        setNewBadge("");
        setNewLink("");
        setNewImageFile(null);
        setNewImageUrl("");
        fetchBanners();
      } else {
        const errData: { detail?: string } | null = await res.json().catch(() => null);
        notifications.show({
          title: "Lỗi",
          message: errData?.detail || "Không thể tạo banner",
          color: "red",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo banner";
      notifications.show({ title: "Lỗi", message, color: "red" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner: BannerItem) => {
    try {
      const newStatus = !banner.is_active;
      const res = await fetch(`${API_URL}/banners/${banner._id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (res.ok) {
        setBanners((prev) =>
          prev.map((b) =>
            b._id === banner._id ? { ...b, is_active: newStatus } : b
          )
        );
        notifications.show({
          title: "Đã cập nhật",
          message: newStatus
            ? "Đã bật hiển thị banner trên trang chủ"
            : "Đã tạm ẩn banner khỏi trang chủ",
          color: "green",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Không thể đổi trạng thái",
        color: "red",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này vĩnh viễn?")) return;
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã xóa banner khỏi hệ thống",
          color: "green",
        });
        setBanners((prev) => prev.filter((b) => b._id !== id));
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi khi xóa banner",
        color: "red",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const updated = [...banners];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reordered = updated.map((b, i) => ({ ...b, position: i + 1 }));
    setBanners(reordered);

    try {
      await fetch(`${API_URL}/banners/reorder`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(
          reordered.map((b) => ({ id: b._id, position: b.position }))
        ),
      });
      notifications.show({
        title: "Thành công",
        message: "Đã cập nhật thứ tự hiển thị",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Không thể lưu thứ tự mới",
        color: "red",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Banner Trang chủ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tùy biến hình ảnh quảng bá, thứ tự chạy slider và liên kết chiến dịch sự kiện
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 px-3.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 flex items-center text-sm font-semibold tabular-nums">
            {banners.filter((b) => b.is_active).length} Đang hoạt động / {banners.length} Tổng số
          </div>
          <button
            onClick={fetchBanners}
            className="h-10 px-3.5 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-150"
            title="Làm mới danh sách"
            aria-label="Làm mới danh sách"
          >
            <RefreshCcw size={15} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 1. Form Thêm Banner Mới */}
      <BannerForm
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newSubtitle={newSubtitle}
        setNewSubtitle={setNewSubtitle}
        newBadge={newBadge}
        setNewBadge={setNewBadge}
        newLink={newLink}
        setNewLink={setNewLink}
        imageMode={imageMode}
        setImageMode={setImageMode}
        newImageFile={newImageFile}
        setNewImageFile={setNewImageFile}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        submitting={submitting}
        onSubmit={handleCreate}
      />

      {/* 2. Danh Sách Banner & Điều Khiển */}
      <BannerList
        banners={banners}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onMove={handleMove}
      />
    </div>
  );
}
