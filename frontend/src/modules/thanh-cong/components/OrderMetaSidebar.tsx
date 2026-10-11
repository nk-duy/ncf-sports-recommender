import { MapPin, Info, ShieldCheck, Package } from 'lucide-react';

export default function OrderMetaSidebar() {
  return (
    <div className="space-y-6">
      {/* 1. Địa chỉ nhận hàng */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          Địa chỉ nhận hàng
        </h3>
        <div className="text-sm">
          <p className="font-bold text-gray-900 mb-1">Nguyễn Khánh Duy</p>
          <p className="text-gray-600 mb-1">0908 123 456</p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
          </p>
          <div className="flex items-start gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-xs">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Shipper sẽ gọi trước khi giao 15 phút.</p>
          </div>
        </div>
      </div>

      {/* 2. Phương thức thanh toán */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Phương thức thanh toán
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Hình thức:</span>
            <span className="font-bold text-gray-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
              VNPAY-QR
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded tracking-wider uppercase">Đã quyết toán</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Thời gian:</span>
            <span className="text-gray-900 font-medium">14:28:19 - <span className="text-gray-500">Hôm nay</span></span>
          </div>
        </div>
      </div>

      {/* 3. Dịch vụ vận chuyển */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          Dịch vụ vận chuyển
        </h3>
        <div className="text-sm">
          <p className="text-gray-600 mb-3">KADY Express Logistics <span className="font-medium text-gray-900">(Tiêu chuẩn)</span></p>
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
            <span className="text-gray-500">Mã vận đơn:</span>
            <span className="font-bold text-gray-900 font-mono tracking-widest">SPAI-VN-772918</span>
          </div>
        </div>
      </div>
    </div>
  );
}
