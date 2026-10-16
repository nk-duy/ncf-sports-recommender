"use client";

import React from "react";
import { 
  Trash2, Link as LinkIcon, Eye, EyeOff, 
  ArrowUp, ArrowDown, ExternalLink
} from "lucide-react";

interface BannerCardProps {
  banner: any;
  index: number;
  totalBanners: number;
  onToggleStatus: (banner: any) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export default function BannerCard({
  banner,
  index,
  totalBanners,
  onToggleStatus,
  onDelete,
  onMove,
}: BannerCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl border transition overflow-hidden flex flex-col shadow-sm hover:shadow-md ${
        banner.is_active ? 'border-gray-200' : 'border-gray-200 opacity-75 bg-gray-50/50'
      }`}
    >
      {/* Banner Thumbnail (aspect-video 16:9 với fallback an toàn) */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden group">
        <img 
          src={banner.image_url} 
          alt={banner.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Position Badge & Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
            #{index + 1}
          </span>
          {banner.badge && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {banner.badge}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
            banner.is_active 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-gray-700/90 text-gray-200'
          }`}>
            {banner.is_active ? "Đang chạy" : "Tạm tắt"}
          </span>
        </div>

        {/* Text on banner thumbnail */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-sm line-clamp-1 drop-shadow-sm">{banner.title}</h3>
          {banner.subtitle && (
            <p className="text-xs text-gray-200 line-clamp-1 drop-shadow-xs">{banner.subtitle}</p>
          )}
        </div>
      </div>

      {/* Card Controls & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <LinkIcon size={13} className="text-gray-400" />
            <span className="font-semibold text-gray-600">Link:</span>
            <a 
              href={banner.link || "#"} 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-600 hover:underline truncate max-w-[200px] flex items-center gap-1"
            >
              {banner.link || "/san-pham"}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          {/* Reorder Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(index, 'up')}
              className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Đẩy lên trước"
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              disabled={index === totalBanners - 1}
              onClick={() => onMove(index, 'down')}
              className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Đẩy xuống sau"
            >
              <ArrowDown size={15} />
            </button>
          </div>

          {/* Toggle and Delete */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStatus(banner)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                banner.is_active 
                  ? 'text-teal-700 bg-teal-50 hover:bg-teal-100' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              title={banner.is_active ? "Tạm ẩn khỏi trang chủ" : "Bật hiển thị lại"}
            >
              {banner.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{banner.is_active ? "Ẩn" : "Hiện"}</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(banner._id)}
              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
              title="Xóa banner vĩnh viễn"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
