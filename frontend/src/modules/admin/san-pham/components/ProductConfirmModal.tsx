'use client';
import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface ProductConfirmModalProps {
  modal: {
    isOpen: boolean;
    title?: string;
    message: string;
    isBlocked?: boolean;
    aiWarning?: string;
    interactionCount?: number;
    orderCount?: number;
    reviewCount?: number;
    onConfirm?: () => void;
  } | null;
  onClose: () => void;
}

export default function ProductConfirmModal({
  modal,
  onClose,
}: ProductConfirmModalProps) {
  if (!modal || !modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {modal.isBlocked ? (
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={22} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{modal.title || 'Xác nhận'}</h2>
              <p className="text-xs text-gray-500">Bảo toàn dữ liệu bán hàng & AI</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${
            modal.isBlocked 
              ? 'bg-amber-50 text-amber-900 border border-amber-200' 
              : 'bg-gray-50 text-gray-700'
          }`}>
            {modal.message}
          </div>

          {/* Cảnh báo thông minh về Mô hình gợi ý AI */}
          {modal.aiWarning && (
            <div className="mt-3.5 p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span>Cảnh báo mô hình gợi ý AI (NCF Model):</span>
              </div>
              <p className="leading-relaxed text-indigo-900">
                {modal.aiWarning}
              </p>
            </div>
          )}

          {modal.isBlocked && !modal.aiWarning && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1">
              <p className="font-semibold">💡 Gợi ý xử lý:</p>
              <p>Sản phẩm khi ở trong Thùng rác đã được tự động ẩn khỏi khách hàng nên bạn hoàn toàn yên tâm. Nếu không muốn bán nữa, chỉ cần để sản phẩm tại đây.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          {modal.isBlocked ? (
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-lg transition"
            >
              Đã hiểu & Đóng
            </button>
          ) : (
            <>
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg text-sm transition"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={modal.onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm text-sm transition"
              >
                Đồng ý Xóa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
