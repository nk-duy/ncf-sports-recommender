'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, CreditCard, Flame, Package } from 'lucide-react';
import type { DashboardProduct, PaymentMethodPoint, TopSellingProductItem } from '../types';

interface TopProductsAndInventoryProps {
  topSellingProducts: TopSellingProductItem[];
  paymentData: PaymentMethodPoint[];
  lowStockProducts: DashboardProduct[];
  formatPrice: (price: number) => string;
}

const MEDAL_COLORS = [
  'bg-amber-500 text-white',
  'bg-slate-400 text-white',
  'bg-amber-700 text-white',
  'bg-gray-100 text-gray-700',
  'bg-gray-100 text-gray-700',
];

export default function TopProductsAndInventory({
  topSellingProducts,
  paymentData,
  lowStockProducts,
  formatPrice,
}: TopProductsAndInventoryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Top 5 Best-Selling Products (Span 7) */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top Sản phẩm Bán chạy nhất</h3>
              <p className="text-xs text-slate-500">Dẫn đầu về lượt mua và doanh thu hệ thống</p>
            </div>
          </div>
          <Link
            href="/admin/san-pham"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Xem kho <ArrowRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {topSellingProducts.length > 0 ? (
            topSellingProducts.map((item, idx) => {
              const prod = item.product;

              return (
                <div
                  key={prod.product_id || idx}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`size-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tabular-nums font-sans ${
                        MEDAL_COLORS[idx] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="size-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="size-12 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80';
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="truncate font-medium text-slate-900 text-sm"
                        title={prod.name}
                      >
                        {prod.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {Array.isArray(prod.category)
                            ? prod.category[0]
                            : prod.category || 'Thể thao'}
                        </span>
                        <span>•</span>
                        <span className="tabular-nums">
                          Tồn kho:{' '}
                          <strong className="text-slate-700 font-semibold">
                            {prod.stock ?? 20}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span className="font-bold text-sm text-slate-900 tabular-nums whitespace-nowrap text-right font-sans">
                      {formatPrice(item.revenue)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 tabular-nums whitespace-nowrap text-right">
                      Đã bán: <strong className="font-bold">{item.quantity}</strong> cái
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              Chưa có dữ liệu bán hàng cho danh sách sản phẩm.
            </div>
          )}
        </div>
      </div>

      {/* Low Stock & Payment Breakdown (Span 5) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Payment Methods Card */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-3.5">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Phương thức Thanh toán</h3>
          </div>

          <div className="space-y-3 pt-1">
            {paymentData.map((pm, i) => {
              const totalPm = paymentData.reduce((acc, curr) => acc + curr.value, 0) || 1;
              const pct = Math.round((pm.value / totalPm) * 100);
              return (
                <div key={pm.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{pm.name}</span>
                    <span className="font-bold text-slate-900 tabular-nums font-sans">
                      {pm.value} đơn ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        i === 0 ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-xs border border-rose-200/80 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" />
              <h3 className="text-sm font-bold text-rose-800">
                Cảnh báo Tồn kho sắp hết (&le; 10)
              </h3>
            </div>
            <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px] tabular-nums">
              {lowStockProducts.length} sản phẩm
            </span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product, idx) => (
                <div
                  key={product.product_id || idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="size-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="size-10 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                    <p className="text-[11px] font-semibold text-rose-600 mt-0.5 tabular-nums">
                      Chỉ còn {product.stock} sản phẩm
                    </p>
                  </div>
                  <Link
                    href="/admin/san-pham"
                    className="size-8 inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Quản lý tồn kho"
                    aria-label="Quản lý tồn kho"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-6 flex flex-col items-center text-center opacity-70">
                <Package size={32} className="text-emerald-500 mb-1" />
                <p className="font-bold text-xs text-slate-800">Tồn kho ổn định</p>
                <p className="text-[11px] text-slate-500">
                  Tất cả sản phẩm đều có số lượng tồn tốt.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
