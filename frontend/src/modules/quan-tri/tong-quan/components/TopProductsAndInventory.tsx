'use client';
import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, CreditCard, AlertTriangle, Package } from 'lucide-react';

interface TopProductsAndInventoryProps {
  topSellingProducts: any[];
  paymentData: any[];
  lowStockProducts: any[];
  formatPrice: (price: number) => string;
}

export default function TopProductsAndInventory({
  topSellingProducts,
  paymentData,
  lowStockProducts,
  formatPrice,
}: TopProductsAndInventoryProps) {
  const medalColors = [
    'bg-amber-500 text-white', // #1
    'bg-slate-400 text-white', // #2
    'bg-amber-700 text-white', // #3
    'bg-gray-100 text-gray-700',
    'bg-gray-100 text-gray-700',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Top 5 Best-Selling Products (Span 7) */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            <div>
              <h3 className="font-bold text-gray-900 text-base">Top Sản phẩm Bán chạy nhất</h3>
              <p className="text-xs text-gray-500">Dẫn đầu về lượt mua và doanh thu hệ thống</p>
            </div>
          </div>
          <Link
            href="/admin/san-pham"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Xem kho <ArrowRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {topSellingProducts.length > 0 ? (
            topSellingProducts.map((item, idx) => {
              const prod = item.product;

              return (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        medalColors[idx] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80';
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-gray-900 truncate" title={prod.name}>
                        {prod.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                          {Array.isArray(prod.category) ? prod.category[0] : prod.category || 'Thể thao'}
                        </span>
                        <span>•</span>
                        <span>
                          Tồn kho: <strong className="text-gray-700">{prod.stock || 20}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-black text-sm text-gray-900 font-mono">
                      {formatPrice(item.revenue)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">
                      Đã bán: <strong>{item.quantity}</strong> cái
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              Chưa có dữ liệu bán hàng cho danh sách sản phẩm.
            </div>
          )}
        </div>
      </div>

      {/* Low Stock & Payment Breakdown (Span 5) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Payment Methods Card */}
        <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900 text-sm">Phương thức Thanh toán</h3>
          </div>

          <div className="space-y-3 pt-1">
            {paymentData.map((pm, i) => {
              const totalPm = paymentData.reduce((acc, curr) => acc + curr.value, 0) || 1;
              const pct = Math.round((pm.value / totalPm) * 100);
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">{pm.name}</span>
                    <span className="font-bold text-gray-900">
                      {pm.value} đơn ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-2xs border border-red-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="text-sm font-bold text-red-800">Cảnh báo Tồn kho sắp hết (&le; 10)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
              {lowStockProducts.length} sản phẩm
            </span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-[11px] font-semibold text-red-600 mt-0.5">
                      Chỉ còn {product.stock} sản phẩm
                    </p>
                  </div>
                  <Link
                    href="/admin/san-pham"
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Quản lý tồn kho"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-6 flex flex-col items-center text-center opacity-70">
                <Package size={32} className="text-green-500 mb-1" />
                <p className="font-bold text-xs text-gray-800">Tồn kho ổn định</p>
                <p className="text-[11px] text-gray-500">Tất cả sản phẩm đều có số lượng tồn tốt.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
