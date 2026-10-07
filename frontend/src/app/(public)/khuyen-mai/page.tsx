import Breadcrumb from "@/shared/components/Breadcrumb";
import PromotionsBanner from "@/modules/khuyen-mai/components/PromotionsBanner";
import PromotionsVoucher from "@/modules/khuyen-mai/components/PromotionsVoucher";
import PromotionsTimeline from "@/modules/khuyen-mai/components/PromotionsTimeline";
import PromotionsFilter from "@/modules/khuyen-mai/components/PromotionsFilter";
import PromotionsList from "@/modules/khuyen-mai/components/PromotionsList";
import PromotionsCombo from "@/modules/khuyen-mai/components/PromotionsCombo";
import Features from "@/modules/trang-chu/components/Features";

export default function PromotionsPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Đại Tiệc Siêu Sale & Khuyến Mãi Thể Thao Tháng 9" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-4">
        <Breadcrumb items={breadcrumbItems} />
        
        <PromotionsBanner />
        <PromotionsVoucher />
        <PromotionsTimeline />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
            <PromotionsFilter />
          </div>
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <PromotionsList />
          </div>
        </div>
        
        <PromotionsCombo />
      </div>
      
      {/* Features ở cuối trang */}
      <div className="bg-white py-10 border-t border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Features />
        </div>
      </div>
    </div>
  );
}
