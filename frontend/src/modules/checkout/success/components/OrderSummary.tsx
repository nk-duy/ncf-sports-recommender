import React from "react";
import { Verified } from "lucide-react";

export default function OrderSummary({ order }: { order?: any }) {
  const orderId = order?._id || order?.id || "DH-8942";
  const items = order?.items || [];
  const totalAmount = order?.total_amount || 3560000;
  const itemCount = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 4;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 hidden">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sản phẩm trong đơn hàng</h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">{itemCount} sản phẩm • Đã đồng bộ kiểm kho tự động</p>
        </div>
        <span className="font-mono text-sm bg-gray-50 px-2.5 py-1 rounded text-gray-600 font-semibold border border-gray-100">#{orderId}</span>
      </div>
      
      {/* Product List */}
      <div className="divide-y divide-gray-100">
        {items.length > 0 ? (
          items.map((item: any, idx: number) => (
            <div key={idx} className="py-4 flex gap-4 items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
                <img alt="Product image" className="w-full h-full object-cover aspect-square" src={item.image_url || "https://placehold.co/150x150?text=SportsAI"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 truncate">Sản phẩm ID: {item.product_id}</h3>
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                  {item.color && <span>Màu: {item.color}</span>}
                  {item.color && <span>•</span>}
                  {item.size && <span>Size: {item.size}</span>}
                  {item.size && <span>•</span>}
                  <span>SL: {item.quantity} ({(item.price).toLocaleString("vi-VN")} đ/sp)</span>
                </div>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                  <Verified size={12} className="text-blue-600" />
                  Chính hãng SportsAI
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">
            Không có thông tin sản phẩm
          </div>
        )}
      </div>
      
      {/* Summary Cost Breakdown */}
      <div className="pt-5 mt-2 border-t border-gray-100 space-y-3 text-sm">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Tạm tính sản phẩm</span>
          <span className="font-mono text-gray-900 font-bold">{(totalAmount).toLocaleString("vi-VN")} đ</span>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline mt-2">
          <div>
            <span className="font-bold text-gray-900 text-base">Tổng tiền đã thanh toán</span>
            <p className="text-xs text-gray-400 font-medium mt-1">(Đã bao gồm VAT và phí vận chuyển)</p>
          </div>
          <span className="text-2xl text-blue-600 font-bold">{(totalAmount).toLocaleString("vi-VN")} đ</span>
        </div>
      </div>
    </div>
  );
}
