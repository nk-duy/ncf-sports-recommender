import Breadcrumb from "@/shared/components/Breadcrumb";
import EquipmentBanner from "@/modules/equipment/components/EquipmentBanner";
import EquipmentSidebar from "@/modules/equipment/components/EquipmentSidebar";
import EquipmentList from "@/modules/equipment/components/EquipmentList";
import Features from "@/modules/home/components/Features";

export default function EquipmentPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Dụng Cụ & Thiết Bị Tập Gym Chính Hãng" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <EquipmentBanner />

        {/* Layout Grid 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <EquipmentSidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            <EquipmentList />
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
