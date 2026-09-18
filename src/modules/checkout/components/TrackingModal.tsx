"use client";

import React from "react";
import { Copy, CalendarClock, PhoneCall, MessageCircle, Truck, PackageCheck, Receipt, RotateCw, X, CheckCircle } from "lucide-react";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackingModal({ isOpen, onClose }: TrackingModalProps) {
  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Đang vận chuyển
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium pt-1">
              <span className="font-mono font-bold text-gray-900">SPAI-VN-772918</span>
              <button 
                onClick={() => handleCopy('SPAI-VN-772918')}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs font-bold transition-colors" 
                type="button"
              >
                <Copy size={14} />
                <span>Copy</span>
              </button>
              <span className="text-gray-300">•</span>
              <span>Đơn hàng: <strong className="font-mono text-gray-900">#DH-8942</strong></span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Dự kiến giao hàng:</div>
                <div className="text-sm text-green-700 font-bold flex items-center gap-1.5">
                  <CalendarClock size={16} />
                  <span>Trước 17:00 • Thứ Sáu, 17/10/2026</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Địa chỉ nhận hàng:</div>
                <div className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                  <strong className="font-bold">Nguyễn Khánh Duy</strong> (0988 123 456) - Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM
                </div>
              </div>
            </div>
            
            {/* Shipper Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200">
                  <span className="material-symbols-outlined text-[20px]">sports_motorsports</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    Shipper: Trần Tuấn Kiệt <span className="text-gray-400 font-normal mx-1">•</span> <span className="font-mono text-xs text-gray-500 font-semibold bg-gray-100 px-1 rounded">59P1-889.24</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 font-medium">Honda AirBlade • Đánh giá 4.9★</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a className="h-8 px-3 rounded-md bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors" href="tel:0912345678">
                  <PhoneCall size={14} className="text-blue-600" />
                  <span>Gọi shipper</span>
                </a>
                <button className="h-8 px-3 rounded-md bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors" type="button">
                  <MessageCircle size={14} className="text-green-700" />
                  <span>Chat hỗ trợ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-7 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-200 mt-6">
            
            {/* Status 1 (Current) */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                <Truck size={14} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-blue-600 font-bold">14:30 - Hôm nay</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">Mốc hiện tại</span>
              </div>
              <div className="text-base text-gray-900 font-bold">Đơn hàng đang được trung chuyển</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Kiện hàng đã rời Kho tổng Logistics SportsAI (Bình Tân, TP.HCM) và đang trên đường đến Bưu cục phát Bình Thạnh.</p>
            </div>

            {/* Status 2 */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center ring-4 ring-white border border-green-200">
                <PackageCheck size={14} />
              </div>
              <div className="text-sm text-gray-500 font-semibold">11:15 - Hôm nay</div>
              <div className="text-base text-gray-900 font-bold">Đã đóng gói &amp; xuất kho</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Trung tâm xử lý hoàn tất đóng gói 4 sản phẩm thể thao và bàn giao cho bộ phận Logistics.</p>
            </div>

            {/* Status 3 */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center ring-4 ring-white border border-green-200">
                <Receipt size={14} />
              </div>
              <div className="text-sm text-gray-500 font-semibold">09:45 - Hôm nay</div>
              <div className="text-base text-gray-900 font-bold">Đã xác nhận đơn hàng</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Hệ thống SportsAI tự động đồng bộ tồn kho và khởi tạo vận đơn SPAI-VN-772918.</p>
            </div>

            {/* Status 4 */}
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center ring-4 ring-white border border-green-200">
                <CheckCircle size={14} />
              </div>
              <div className="text-sm text-gray-500 font-semibold">09:30 - Hôm nay</div>
              <div className="text-base text-gray-900 font-bold">Đặt hàng thành công</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">Khách hàng hoàn tất thanh toán qua VNPAY-QR (3.560.000 đ).</p>
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
