import React, { Suspense } from "react";
import Breadcrumb from "@/shared/components/Breadcrumb";
import PromotionsBanner from "@/modules/khuyen-mai/components/PromotionsBanner";
import PromotionsTimeline from "@/modules/khuyen-mai/components/PromotionsTimeline";
import PromotionsVoucher from "@/modules/khuyen-mai/components/PromotionsVoucher";
import PromotionsProductSection from "@/modules/khuyen-mai/components/PromotionsProductSection";
import PromotionsCombo from "@/modules/khuyen-mai/components/PromotionsCombo";
import Features from "@/modules/trang-chu/components/Features";

export const metadata = {
  title: "Đại Tiệc Siêu Sale & Khuyến Mãi Thể Thao | KADY Sports",
  description: "Khám phá hàng trăm deal dụng cụ, trang phục thể thao chính hãng giảm giá đến 50%, kho voucher 500k toàn sàn và miễn phí vận chuyển 0đ tại KADY.",
};

export default function PromotionsPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Siêu Sale & Khuyến Mãi Thể Thao" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Container chung */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 1. Hero Banner Siêu Sale */}
        <PromotionsBanner />

        {/* 2. Khung giờ vàng Flash Sale */}
        <PromotionsTimeline />

        {/* 3. Kho Voucher Toàn Sàn */}
        <PromotionsVoucher />

        {/* 4. Bộ Lọc & Danh Sách Sản Phẩm Khuyến Mãi (8 sản phẩm / trang, chuẩn CSDL) */}
        <Suspense
          fallback={
            <div className="h-96 bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-center animate-pulse mb-16">
              <span className="text-slate-400 font-bold text-sm">
                Đang tải các deal thể thao khuyến mãi...
              </span>
            </div>
          }
        >
          <PromotionsProductSection />
        </Suspense>

        {/* 5. Gói Combo Siêu Tiết Kiệm */}
        <PromotionsCombo />
      </div>

      {/* Cam kết thương hiệu & Dịch vụ ở cuối trang */}
      <div className="bg-white py-12 border-t border-slate-200/80 mt-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Features />
        </div>
      </div>
    </div>
  );
}
