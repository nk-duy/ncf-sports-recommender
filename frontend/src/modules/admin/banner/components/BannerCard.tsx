"use client";

import {
  Trash2,
  Link as LinkIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { BannerItem, FALLBACK_BANNER_IMAGE } from "../types";

interface BannerCardProps {
  banner: BannerItem;
  index: number;
  totalBanners: number;
  onToggleStatus: (banner: BannerItem) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
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
      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col shadow-xs hover:shadow-md ${
        banner.is_active
          ? "border-slate-200/80"
          : "border-slate-200/80 opacity-75 bg-slate-50/50"
      }`}
    >
      {/* Banner Thumbnail (aspect-video 16:9 với fallback an toàn) */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_BANNER_IMAGE;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white font-sans tabular-nums text-xs font-bold px-2.5 py-1 rounded-lg">
            #{index + 1}
          </span>
          {banner.badge && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {banner.badge}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium backdrop-blur-md shadow-xs ${
              banner.is_active
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-700/90 text-slate-200"
            }`}
          >
            {banner.is_active ? "Đang chạy" : "Tạm tắt"}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-sm line-clamp-1 drop-shadow-sm">
            {banner.title}
          </h3>
          {banner.subtitle && (
            <p className="text-xs text-slate-200 line-clamp-1 drop-shadow-xs">
              {banner.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Controls & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <LinkIcon size={13} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-600">Link:</span>
            <a
              href={banner.link || "#"}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline truncate max-w-[200px] flex items-center gap-1"
            >
              <span className="truncate">{banner.link || "/san-pham"}</span>
              <ExternalLink size={11} className="shrink-0" />
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMove(index, "up")}
              className="size-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
              title="Đẩy lên trước"
              aria-label="Đẩy lên trước"
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              disabled={index === totalBanners - 1}
              onClick={() => onMove(index, "down")}
              className="size-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
              title="Đẩy xuống sau"
              aria-label="Đẩy xuống sau"
            >
              <ArrowDown size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStatus(banner)}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors duration-150 ${
                banner.is_active
                  ? "text-teal-700 bg-teal-50 hover:bg-teal-100"
                  : "text-slate-600 bg-slate-100 hover:bg-slate-200"
              }`}
              title={banner.is_active ? "Tạm ẩn khỏi trang chủ" : "Bật hiển thị lại"}
              aria-label={banner.is_active ? "Tạm ẩn khỏi trang chủ" : "Bật hiển thị lại"}
            >
              {banner.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{banner.is_active ? "Ẩn" : "Hiện"}</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(banner._id)}
              className="size-8 inline-flex items-center justify-center text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors duration-150"
              title="Xóa banner vĩnh viễn"
              aria-label="Xóa banner vĩnh viễn"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
