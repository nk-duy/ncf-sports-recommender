import HeroBanner from "@/modules/public/trang-chu/components/HeroBanner";
import QuickSportsNav from "@/modules/public/trang-chu/components/QuickSportsNav";
import Features from "@/modules/public/trang-chu/components/Features";
import FlashSaleSection from "@/modules/public/trang-chu/components/FlashSaleSection";
import RecommendedProducts from "@/modules/public/trang-chu/components/RecommendedProducts";
import ShopByCategory from "@/modules/public/trang-chu/components/ShopByCategory";
import TrendingProducts from "@/modules/public/trang-chu/components/TrendingProducts";
import BrandLogos from "@/modules/public/trang-chu/components/BrandLogos";
import Testimonials from "@/modules/public/trang-chu/components/Testimonials";
import EmailPopup from "@/modules/public/trang-chu/components/EmailPopup";

export default function Home() {
  return (
    <>
      {/* 1. Banner chính */}
      <HeroBanner />

      {/* 2. Chọn nhanh môn thể thao */}
      <QuickSportsNav />

      {/* 3. Tiêu chí dịch vụ */}
      <Features />

      {/* 4. Sản phẩm giảm giá sốc (Flash Sale) */}
      <FlashSaleSection />

      {/* 5. Gợi ý dành riêng cho bạn */}
      <RecommendedProducts />

      {/* 6. Danh mục theo môn thể thao */}
      <ShopByCategory />

      {/* 7. Sản phẩm bán chạy & Mới về */}
      <TrendingProducts />

      {/* 8. Thương hiệu đối tác */}
      <BrandLogos />

      {/* 9. Đánh giá của khách hàng */}
      <Testimonials />

      {/* 10. Popup đăng ký */}
      <EmailPopup />
    </>
  );
}
