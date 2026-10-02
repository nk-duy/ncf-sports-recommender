import HeroBanner from "@/modules/trang-chu/components/HeroBanner";
import Features from "@/modules/trang-chu/components/Features";
import ProductGrid from "@/modules/trang-chu/components/ProductGrid";
import RecommendedProducts from "@/modules/trang-chu/components/RecommendedProducts";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Features />
      <RecommendedProducts />
      <ProductGrid />
    </>
  );
}
