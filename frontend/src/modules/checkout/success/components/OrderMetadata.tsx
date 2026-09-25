import React from "react";
import { MapPin, ShieldCheck, Rocket, BellRing } from "lucide-react";

export default function OrderMetadata({ order }: { order?: any }) {
  const customerName = order?.customer_name || "Nguyễn Khánh Duy";
  const customerPhone = order?.customer_phone || "0988 123 456";
  const customerAddress = order?.customer_address || "Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh";
  
  let paymentLabel = "Thanh toán khi nhận hàng (COD)";
  if (order?.payment_method === 'banking') {
    paymentLabel = "Chuyển khoản Ngân hàng";
  } else if (order?.payment_method === 'momo') {
    paymentLabel = "Ví MoMo";
  }

  const orderDate = order?.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : "Hôm nay";

  return (
    <div className="w-full space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
      {/* Recipient Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900">
          <MapPin size={18} className="text-blue-600" />
          <h3 className="font-bold text-sm">Địa chỉ nhận hàng</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-1">
          <p className="font-semibold text-gray-900 text-sm">{customerName} - {customerPhone}</p>
          <p className="text-sm text-gray-600 leading-relaxed pt-1">
            {customerAddress}
          </p>
        </div>
        <div className="text-[11px] font-semibold text-green-700 flex items-center gap-1.5 px-1 pt-1">
          <BellRing size={14} />
          <span>Shipper sẽ gọi trước khi giao 15 phút.</span>
        </div>
      </div>

      {/* Payment & Method Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900">
          <ShieldCheck size={18} className="text-green-700" />
          <h3 className="font-bold text-sm">Phương thức thanh toán</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Hình thức:</span>
            <span className="font-bold text-blue-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> {paymentLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Trạng thái:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] uppercase tracking-wider border border-blue-100">
              Đã ghi nhận
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Thời gian:</span>
            <span className="font-mono font-medium text-gray-900">{orderDate}</span>
          </div>
        </div>
      </div>

      {/* Shipping Partner Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900">
          <Rocket size={18} className="text-blue-600" />
          <h3 className="font-bold text-sm">Dịch vụ vận chuyển</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-900">SportsAI Express (Tiêu chuẩn)</p>
          <p className="text-sm text-gray-500 mt-1">
            Mã vận đơn: <span className="font-mono text-gray-900 font-bold ml-1">Đang cập nhật...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
