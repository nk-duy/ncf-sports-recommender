'use client';

import React, { useState, useEffect } from 'react';
import { Truck, X, Sparkles, Check, ExternalLink } from 'lucide-react';

interface ShippingModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, carrier: string, trackingCode: string) => Promise<void>;
}

const CARRIERS = [
  { id: 'GHN', name: 'Giao Hàng Nhanh (GHN)', prefix: 'GHN', trackUrl: 'https://donhang.ghn.vn/?order_code=' },
  { id: 'GHTK', name: 'Giao Hàng Tiết Kiệm (GHTK)', prefix: 'S', trackUrl: 'https://i.ghtk.vn/' },
  { id: 'VIETTEL', name: 'Viettel Post', prefix: 'VT', trackUrl: 'https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?order_number=' },
  { id: 'J&T', name: 'J&T Express', prefix: 'JT', trackUrl: 'https://jtexpress.vn/vi/tracking?billcode=' },
  { id: 'VNPOST', name: 'VNPost (Bưu Điện)', prefix: 'VN', trackUrl: 'http://www.vnpost.vn/' },
];

export default function ShippingModal({
  order,
  isOpen,
  onClose,
  onConfirm,
}: ShippingModalProps) {
  const [carrier, setCarrier] = useState<string>('GHN');
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setCarrier(order.carrier || 'GHN');
      if (order.tracking_code) {
        setTrackingCode(order.tracking_code);
      } else {
        // Auto-generate realistic tracking code based on order ID
        const cleanId = (order._id || '').substring(Math.max(0, (order._id || '').length - 6)).toUpperCase();
        const rand = Math.floor(1000 + Math.random() * 9000);
        setTrackingCode(`GHN${cleanId}${rand}`);
      }
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSelectCarrier = (selectedId: string) => {
    setCarrier(selectedId);
    const selectedObj = CARRIERS.find(c => c.id === selectedId);
    const prefix = selectedObj ? selectedObj.prefix : 'VN';
    const cleanId = (order._id || '').substring(Math.max(0, (order._id || '').length - 6)).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setTrackingCode(`${prefix}${cleanId}${rand}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      alert('Vui lòng nhập hoặc tạo mã vận đơn');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(order._id, carrier, trackingCode.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCarrierObj = CARRIERS.find(c => c.id === carrier);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Giao Hàng & Mã Vận Đơn (Tracking)</h2>
              <p className="text-xs text-blue-700 font-medium">Đơn hàng #{order._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Thông tin người nhận tóm tắt */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs text-gray-600 space-y-1">
            <p className="flex justify-between">
              <span className="text-gray-400">Người nhận:</span>
              <strong className="text-gray-900">{order.customer_name} ({order.customer_phone})</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-400">Địa chỉ:</span>
              <span className="text-gray-800 text-right truncate max-w-[260px] font-medium" title={order.customer_address}>
                {order.customer_address}
              </span>
            </p>
          </div>

          {/* Chọn Đơn vị vận chuyển */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              1. Chọn Đơn vị vận chuyển liên kết
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARRIERS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleSelectCarrier(c.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition border text-left flex items-center justify-between ${
                    carrier === c.id
                      ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="truncate">{c.name.split(' (')[0]}</span>
                  {carrier === c.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Nhập hoặc sinh mã vận đơn */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700">
                2. Mã vận đơn (Tracking Number) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => handleSelectCarrier(carrier)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" /> Tự sinh mã mới
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                required
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder="VD: GHN839218392, S10293819..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 uppercase tracking-wider"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Mã này sẽ hiển thị trong trang <strong>Lịch sử đơn hàng</strong> để khách hàng tự tra cứu lộ trình vận chuyển.
            </p>
          </div>

          {/* Link tra cứu thử */}
          {selectedCarrierObj && trackingCode && (
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
              <span className="truncate text-[11px]">
                Link tra cứu mẫu: <strong>{selectedCarrierObj.trackUrl}{trackingCode}</strong>
              </span>
              <a
                href={`${selectedCarrierObj.trackUrl}${trackingCode}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 ml-2 inline-flex items-center gap-0.5 shrink-0 font-bold"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Nút hành động */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang cập nhật...' : 'Xác nhận Đang Giao Hàng'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
