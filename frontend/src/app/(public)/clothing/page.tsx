import Breadcrumb from "@/shared/components/Breadcrumb";
import ClothingBanner from "@/modules/clothing/components/ClothingBanner";
import ClothingSidebar from "@/modules/clothing/components/ClothingSidebar";
import DynamicProductList from "@/shared/components/DynamicProductList";
import Features from "@/modules/home/components/Features";

export default function ClothingPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Quần Áo Thể Thao" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <ClothingBanner />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ClothingSidebar />
          </aside>
          <main className="flex-1">
            <DynamicProductList initialCategory="Clothing" />
          </main>
        </div>
      </div>
      <div className="bg-white mt-16 py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Features />
        </div>
      </div>
    </div>
  );
}
