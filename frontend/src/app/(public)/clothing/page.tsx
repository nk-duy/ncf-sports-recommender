import Breadcrumb from "@/shared/components/Breadcrumb";
import ClothingBanner from "@/modules/clothing/components/ClothingBanner";
import ClothingSidebar from "@/modules/clothing/components/ClothingSidebar";
import ClothingList from "@/modules/clothing/components/ClothingList";
import Features from "@/modules/home/components/Features";

export default function ClothingPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Quần Áo Thể Thao Nam Nữ" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <ClothingBanner />

        {/* Layout Grid 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ClothingSidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            <ClothingList />
          </main>
        </div>
      </div>
      
      {/* Features ở cuối trang */}
      <div className="bg-white mt-16 py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Features />
        </div>
      </div>
    </div>
  );
}
