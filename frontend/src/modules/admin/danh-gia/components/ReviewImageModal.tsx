'use client';

import { ShieldAlert, X } from 'lucide-react';
import { FALLBACK_SPORTS_IMAGE } from '../types';

interface ReviewImageModalProps {
  previewImages: string[] | null;
  onClosePreview: () => void;
  deletingId: string | null;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

export default function ReviewImageModal({
  previewImages,
  onClosePreview,
  deletingId,
  onCancelDelete,
  onConfirmDelete,
}: ReviewImageModalProps) {
  return (
    <>
      {/* Confirmation Modal for Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Xác nhận xóa đánh giá?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn đánh giá khỏi cơ sở dữ liệu và tự động tính toán lại điểm trung bình sao cho sản phẩm.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onCancelDelete}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelete(deletingId)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs shadow-rose-200"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImages && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-xs">Hình ảnh từ khách hàng</span>
              <button
                type="button"
                onClick={onClosePreview}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto p-1">
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
                >
                  <img
                    src={img}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_SPORTS_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
