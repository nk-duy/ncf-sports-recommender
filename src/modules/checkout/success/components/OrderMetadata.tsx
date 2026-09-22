import React from "react";
import { MapPin, ShieldCheck, Rocket, BellRing } from "lucide-react";

export default function OrderMetadata() {
  return (
    <div className="lg:col-span-4 space-y-5">
      {/* Recipient Card */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 pb-3 border-b border-gray-100">
          <MapPin size={20} className="text-blue-600" />
          <h3 className="font-bold text-sm">Địa chỉ nhận hàng</h3>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-gray-900 text-sm">Nguyễn Khánh Duy</p>
          <p className="text-sm text-gray-600">0988 123 456</p>
          <p className="text-sm text-gray-600 leading-relaxed pt-1">
            Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
          </p>
        </div>
        <div className="pt-2 text-[11px] font-semibold text-green-700 flex items-center gap-1.5 bg-gray-50 border border-gray-100 p-2 rounded">
          <BellRing size={14} />
          <span>Shipper sẽ gọi trước khi giao 15 phút.</span>
        </div>
      </div>

      {/* Payment & Method Card */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 pb-3 border-b border-gray-100">
          <ShieldCheck size={20} className="text-green-700" />
          <h3 className="font-bold text-sm">Phương thức thanh toán</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Hình thức:</span>
            <span className="font-bold text-blue-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-600"></span> VNPAY-QR
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Trạng thái:</span>
            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold text-[11px] uppercase tracking-wider border border-green-100">
              Đã quyết toán
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Thời gian:</span>
            <span className="font-mono font-medium text-gray-900">14:28:19 - Hôm nay</span>
          </div>
        </div>
      </div>

      {/* Shipping Partner Card */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2 text-gray-900 pb-3 border-b border-gray-100">
          <Rocket size={20} className="text-blue-600" />
          <h3 className="font-bold text-sm">Dịch vụ vận chuyển</h3>
        </div>
        <p className="text-sm font-semibold text-gray-900">SportsAI Express Logistics (Tiêu chuẩn)</p>
        <p className="text-sm text-gray-500">
          Mã vận đơn: <span className="font-mono text-gray-900 font-bold ml-1">SPAI-VN-772910</span>
        </p>
      </div>
    </div>
  );
}
