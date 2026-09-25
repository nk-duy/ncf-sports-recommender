import HeroBanner from "@/modules/home/components/HeroBanner";
import Features from "@/modules/home/components/Features";
import ProductGrid from "@/modules/home/components/ProductGrid";
import RecommendedProducts from "@/modules/home/components/RecommendedProducts";

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
