'use client';

import type { ProductDetail } from '../types';

interface ProductSpecsSectionProps {
  product: ProductDetail;
}

export default function ProductSpecsSection({ product }: ProductSpecsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm mt-5 p-5 md:p-6 border border-slate-100">
      <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Chi tiết & Thông số kỹ thuật sản phẩm</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Bảng Thông số kỹ thuật 2 cột xen kẽ màu */}
        <div className="lg:col-span-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Thông số kỹ thuật
          </h3>
          <div className="border border-slate-200/80 rounded-xl overflow-hidden text-xs md:text-sm">
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-slate-50">
                <span className="col-span-5 text-slate-500 font-medium">Thương hiệu</span>
                <span className="col-span-7 text-slate-900 font-semibold">{product.brand || 'KADY Sports'}</span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-white">
                <span className="col-span-5 text-slate-500 font-medium">Bộ môn thể thao</span>
                <span className="col-span-7 text-slate-900 font-semibold">{product.sport_type || 'Thể thao tổng hợp'}</span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-slate-50">
                <span className="col-span-5 text-slate-500 font-medium">Danh mục sản phẩm</span>
                <span className="col-span-7 text-slate-900 font-semibold">
                  {product.sub_category || (product.category && product.category.join(' • ')) || 'Trang bị thể thao'}
                </span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-white">
                <span className="col-span-5 text-slate-500 font-medium">Phân loại hàng</span>
                <span className="col-span-7 text-slate-900 font-semibold">{product.product_type || 'Phụ kiện / Thiết bị'}</span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-slate-50">
                <span className="col-span-5 text-slate-500 font-medium">Kích cỡ hỗ trợ</span>
                <span className="col-span-7 text-slate-900 font-semibold">
                  {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'Tiêu chuẩn, Freesize'}
                </span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-white">
                <span className="col-span-5 text-slate-500 font-medium">Màu sắc</span>
                <span className="col-span-7 text-slate-900 font-semibold">
                  {product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'Màu tiêu chuẩn'}
                </span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-slate-50">
                <span className="col-span-5 text-slate-500 font-medium">Tình trạng</span>
                <span className="col-span-7 text-emerald-600 font-semibold">Mới 100% - Chính hãng KADY</span>
              </div>
              <div className="grid grid-cols-12 px-3.5 py-2.5 bg-white">
                <span className="col-span-5 text-slate-500 font-medium">Bảo hành & Đổi trả</span>
                <span className="col-span-7 text-slate-900 font-semibold">12 tháng / Đổi size trong 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả chi tiết & Điểm nổi bật */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Mô tả chi tiết & Điểm nổi bật
          </h3>
          <div className="prose prose-blue max-w-none text-slate-600 text-xs md:text-sm leading-relaxed space-y-2.5">
            {product.description ? (
              <p className="whitespace-pre-line text-slate-700 font-normal">{product.description}</p>
            ) : (
              <p className="text-slate-700">
                <strong>{product.name}</strong> là dòng sản phẩm thể thao cao cấp trong hệ sinh thái trang bị chính hãng của{' '}
                <strong>{product.brand || 'KADY Sports'}</strong>. Thiết kế tinh gọn, hiện đại với công năng chuyên biệt nhằm mang đến trải nghiệm vận động êm ái, an toàn và tối đa hóa hiệu suất thi đấu.
              </p>
            )}

            {/* Các gạch đầu dòng cam kết chất lượng chuẩn Decathlon / Shopee Mall */}
            <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
                Đặc quyền & Điểm nổi bật:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>Chất liệu thể thao chọn lọc: Thoáng khí, chống co rút, khử mùi và nhanh khô.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>Đường may gia cố chắc chắn: Chịu lực kéo cao, phù hợp cường độ vận động liên tục.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>Được kiểm định chất lượng theo quy chuẩn kỹ thuật thể thao nghiêm ngặt trước khi xuất xưởng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>Hỗ trợ đổi kích cỡ tận nơi miễn phí trong 30 ngày nếu mang không vừa vặn.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
