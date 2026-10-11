import HeroBanner from "@/modules/trang-chu/components/HeroBanner";
import ShopByCategory from "@/modules/trang-chu/components/ShopByCategory";
import TrendingProducts from "@/modules/trang-chu/components/TrendingProducts";
import Features from "@/modules/trang-chu/components/Features";
import RecommendedProducts from "@/modules/trang-chu/components/RecommendedProducts";
import FlashSaleSection from "@/modules/trang-chu/components/FlashSaleSection";
import BrandLogos from "@/modules/trang-chu/components/BrandLogos";
import Testimonials from "@/modules/trang-chu/components/Testimonials";
import EmailPopup from "@/modules/trang-chu/components/EmailPopup";
import BackToTop from "@/modules/cot-loi/components/BackToTop";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Features />
      <ShopByCategory />
      <FlashSaleSection />
      <RecommendedProducts />
      <TrendingProducts />
      <BrandLogos />
      <Testimonials />
      <EmailPopup />
      <BackToTop />
    </>
  );
}
