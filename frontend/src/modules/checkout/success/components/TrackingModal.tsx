"use client";

import React from "react";
import { Copy, CalendarClock, PhoneCall, MessageCircle, Truck, PackageCheck, Receipt, RotateCw, X, CheckCircle } from "lucide-react";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
}

export default function TrackingModal({ isOpen, onClose, order }: TrackingModalProps) {
  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const orderId = order?._id || order?.id || "DH-8942";
  const trackingCode = `SPAI-VN-${orderId.substring(orderId.length - 6).toUpperCase()}`;
  const customerName = order?.customer_name || "Nguyễn Khánh Duy";
  const customerPhone = order?.customer_phone || "0988 123 456";
  const customerAddress = order?.customer_address || "Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM";
  const totalAmount = order?.total_amount || 3560000;
  let paymentMethod = "Thanh toán khi nhận hàng (COD)";
  if (order?.payment_method === 'banking') paymentMethod = "Chuyển khoản Ngân hàng";
  if (order?.payment_method === 'momo') paymentMethod = "Ví MoMo";
  
  const createdDate = order?.created_at ? new Date(order.created_at) : new Date();
  const timeFormatted = createdDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const deliveryDate = new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days later
  const deliveryDateFormatted = deliveryDate.toLocaleDateString('vi-VN');
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-white">
          <div className="space-y-1.5">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-gray-900">Hành trình vận chuyển đơn hàng</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Chờ xác nhận
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium pt-1">
              <span className="font-mono font-bold text-gray-900">{trackingCode}</span>
              <button 
                onClick={() => handleCopy(trackingCode)}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs font-bold transition-colors" 
                type="button"
              >
                <Copy size={14} />
                <span>Copy</span>
              </button>
              <span className="text-gray-300">•</span>
              <span>Đơn hàng: <strong className="font-mono text-gray-900">#{orderId}</strong></span>
              <span className="text-gray-300">•</span>
              <span className="text-green-700 font-bold">SportsAI Express Logistics</span>
            </div>
          </div>
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors" 
            onClick={onClose} 
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
          
          {/* Quick Info Box */}
          <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Dự kiến giao hàng:</div>
                <div className="text-sm text-green-700 font-bold flex items-center gap-1.5">
                  <CalendarClock size={16} />
                  <span>Trước 17:00 • {deliveryDateFormatted}</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Địa chỉ nhận hàng:</div>
                <div className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                  <strong className="font-bold">{customerName}</strong> ({customerPhone}) - {customerAddress}
                </div>
              </div>
            </div>
            {/* Note: Shipper info hidden because order is pending confirmation */}
          </div>

          {/* Timeline */}
          <div className="relative pl-7 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-200 mt-6">
            
            {/* Status 1 (Current) */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                <Receipt size={14} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-blue-600 font-bold">Mới nhất</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">Mốc hiện tại</span>
              </div>
              <div className="text-base text-gray-900 font-bold">Đang chờ xác nhận</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Đơn hàng của bạn đã được tiếp nhận và đang chờ nhân viên của SportsAI xác nhận trước khi đóng gói.</p>
            </div>

            {/* Status 2 */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center ring-4 ring-white border border-green-200">
                <CheckCircle size={14} />
              </div>
              <div className="text-sm text-gray-500 font-semibold">{timeFormatted} - Hôm nay</div>
              <div className="text-base text-gray-900 font-bold">Đặt hàng thành công</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Khách hàng hoàn tất tạo đơn qua {paymentMethod} ({(totalAmount).toLocaleString('vi-VN')} đ).</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
            <RotateCw size={14} className="text-blue-600 animate-spin-slow" />
            <span>Cập nhật theo thời gian thực (GPS Tracking)</span>
          </div>
          <button 
            className="h-10 px-6 rounded-md bg-gray-900 text-white hover:bg-black text-sm font-bold transition-colors shadow-sm" 
            onClick={onClose} 
            type="button"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
