'use client';

import {
  Star,
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import Pagination from '@/shared/components/Pagination';
import { FALLBACK_SPORTS_IMAGE, ReviewItem } from '../types';

interface ReviewsTableProps {
  reviews: ReviewItem[];
  loading: boolean;
  page: number;
  pages: number;
  total: number;
  actionLoadingId: string | null;
  onPageChange: (page: number) => void;
  onToggleVisibility: (review: ReviewItem) => void;
  onRequestDelete: (id: string) => void;
  onPreviewImages: (images: string[]) => void;
}

export default function ReviewsTable({
  reviews,
  loading,
  page,
  pages,
  total,
  actionLoadingId,
  onPageChange,
  onToggleVisibility,
  onRequestDelete,
  onPreviewImages,
}: ReviewsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <RefreshCcw size={28} className="animate-spin text-blue-600" />
          <p className="text-xs font-medium">Đang tải danh sách đánh giá...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <MessageSquare size={36} className="mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Không tìm thấy đánh giá nào</p>
          <p className="text-xs text-slate-400">Thử đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc sao</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-72">Sản phẩm</th>
                <th className="py-3 px-4 w-44">Người đánh giá</th>
                <th className="py-3 px-4 w-32">Số sao &amp; Ngày</th>
                <th className="py-3 px-4">Nội dung nhận xét</th>
                <th className="py-3 px-4 w-28 text-center">Trạng thái</th>
                <th className="py-3 px-4 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((r) => {
                const dateStr = r.timestamp
                  ? new Date(r.timestamp).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      r.is_hidden ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* Product Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={r.product_image || FALLBACK_SPORTS_IMAGE}
                          alt={r.product_name || r.product_id}
                          className="size-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_SPORTS_IMAGE;
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 line-clamp-2 leading-snug">
                            {r.product_name || `Sản phẩm #${r.product_id}`}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            Mã: {r.product_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reviewer Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 block truncate">
                          {r.user_name || 'Khách hàng'}
                        </span>
                        {r.verified_purchase ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            Đã mua hàng
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            Khách vãng lai
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stars & Date Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={
                                star <= r.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 block tabular-nums">
                          {dateStr}
                        </span>
                      </div>
                    </td>

                    {/* Comment Content Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1.5">
                        {r.comment ? (
                          <p className="text-slate-700 leading-relaxed break-words line-clamp-3">
                            {r.comment}
                          </p>
                        ) : (
                          <span className="italic text-slate-400 text-[11px]">
                            (Không có nhận xét chữ)
                          </span>
                        )}

                        {(r.color_bought || r.size_bought) && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            {r.color_bought && (
                              <span>
                                Màu: <b className="text-slate-700">{r.color_bought}</b>
                              </span>
                            )}
                            {r.size_bought && (
                              <span>
                                Size: <b className="text-slate-700">{r.size_bought}</b>
                              </span>
                            )}
                          </div>
                        )}

                        {r.images && r.images.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1">
                            {r.images.slice(0, 4).map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => r.images && onPreviewImages(r.images)}
                                className="relative size-8 rounded-md overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={img}
                                  alt="Đính kèm"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_SPORTS_IMAGE;
                                  }}
                                />
                              </button>
                            ))}
                            {r.images.length > 4 && (
                              <span className="text-[10px] font-bold text-slate-500">
                                +{r.images.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4 align-top text-center">
                      {r.is_hidden ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <EyeOff size={11} />
                          Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Eye size={11} />
                          Hiển thị
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onToggleVisibility(r)}
                          disabled={actionLoadingId === r.id}
                          title={
                            r.is_hidden
                              ? 'Khôi phục hiển thị đánh giá'
                              : 'Tạm ẩn đánh giá vi phạm'
                          }
                          className={`p-1.5 rounded-lg border transition-all ${
                            r.is_hidden
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >
                          {r.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onRequestDelete(r.id)}
                          disabled={actionLoadingId === r.id}
                          title="Xóa vĩnh viễn đánh giá"
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {pages > 1 && (
        <div className="py-4 px-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Trang <b>{page}</b> / <b>{pages}</b> (Tổng <b>{total}</b> đánh giá)
          </span>
          <Pagination
            currentPage={page}
            totalPages={pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
