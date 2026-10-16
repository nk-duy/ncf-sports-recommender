import HeroBanner from "@/modules/public/trang-chu/components/HeroBanner";
import ShopByCategory from "@/modules/public/trang-chu/components/ShopByCategory";
import TrendingProducts from "@/modules/public/trang-chu/components/TrendingProducts";
import Features from "@/modules/public/trang-chu/components/Features";
import RecommendedProducts from "@/modules/public/trang-chu/components/RecommendedProducts";
import FlashSaleSection from "@/modules/public/trang-chu/components/FlashSaleSection";
import BrandLogos from "@/modules/public/trang-chu/components/BrandLogos";
import Testimonials from "@/modules/public/trang-chu/components/Testimonials";
import EmailPopup from "@/modules/public/trang-chu/components/EmailPopup";

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
    </>
  );
}
