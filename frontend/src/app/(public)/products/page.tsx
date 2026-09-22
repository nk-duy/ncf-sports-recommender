import Breadcrumb from "@/shared/components/Breadcrumb";
import ProductsBanner from "@/modules/products/components/ProductsBanner";
import ProductsSidebar from "@/modules/products/components/ProductsSidebar";
import ProductsList from "@/modules/products/components/ProductsList";
import Features from "@/modules/home/components/Features";

export default function ProductsPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Giày Thể Thao Nam Nữ" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <ProductsBanner />

        {/* Layout Grid 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ProductsSidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            <ProductsList />
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
