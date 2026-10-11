import React from 'react';
import { CartItem } from '@/shared/store/cartStore';

export type ConfirmState = { kind: 'single'; item: CartItem } | { kind: 'bulk' } | null;

interface CartConfirmModalProps {
  confirm: ConfirmState;
  selectedKeysLength: number;
  onCancel: () => void;
  onConfirm: (action: 'delete' | 'save') => void;
}

export default function CartConfirmModal({
  confirm,
  selectedKeysLength,
  onCancel,
  onConfirm
}: CartConfirmModalProps) {
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {confirm.kind === 'single' ? 'Xóa sản phẩm khỏi giỏ hàng?' : `Xóa ${selectedKeysLength} sản phẩm đã chọn?`}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {confirm.kind === 'single'
            ? <>Bạn có muốn xóa <span className="font-medium text-gray-700">{confirm.item.name}</span> khỏi giỏ hàng? Bạn cũng có thể lưu lại để mua sau.</>
            : 'Các sản phẩm đã chọn sẽ bị xóa khỏi giỏ hàng.'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          {confirm.kind === 'single' && (
            <button
              onClick={() => onConfirm('save')}
              className="flex-1 py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Lưu mua sau
            </button>
          )}
          <button
            onClick={() => onConfirm('delete')}
            className="flex-1 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
