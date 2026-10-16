"use client";

import React from "react";
import { Loader } from "@mantine/core";
import BannerCard from "./BannerCard";

interface BannerListProps {
  banners: any[];
  loading: boolean;
  onToggleStatus: (banner: any) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export default function BannerList({
  banners,
  loading,
  onToggleStatus,
  onDelete,
  onMove,
}: BannerListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Danh Sách Banner ({banners.length})</h2>
        <span className="text-xs text-gray-500">Sử dụng nút mũi tên để đổi thứ tự trên slider</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader color="blue" /></div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500">
          Chưa có banner nào. Hãy tạo banner đầu tiên ở trên!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: any, index: number) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              index={index}
              totalBanners={banners.length}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
