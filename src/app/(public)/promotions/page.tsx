import Breadcrumb from "@/shared/components/Breadcrumb";
import PromotionsBanner from "@/modules/promotions/components/PromotionsBanner";
import PromotionsVoucher from "@/modules/promotions/components/PromotionsVoucher";
import PromotionsTimeline from "@/modules/promotions/components/PromotionsTimeline";
import PromotionsFilter from "@/modules/promotions/components/PromotionsFilter";
import PromotionsList from "@/modules/promotions/components/PromotionsList";
import PromotionsCombo from "@/modules/promotions/components/PromotionsCombo";
import Features from "@/modules/home/components/Features";

export default function PromotionsPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Đại Tiệc Siêu Sale & Khuyến Mãi Thể Thao Tháng 9" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={breadcrumbItems} />
        
        <PromotionsBanner />
        <PromotionsVoucher />
        <PromotionsTimeline />
        <PromotionsFilter />
        <PromotionsList />
        <PromotionsCombo />
      </div>
      
      {/* Features ở cuối trang */}
      <div className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Features />
        </div>
      </div>
    </div>
  );
}
