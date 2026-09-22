import Breadcrumb from "@/shared/components/Breadcrumb";
import OutdoorBanner from "@/modules/outdoor/components/OutdoorBanner";
import OutdoorSidebar from "@/modules/outdoor/components/OutdoorSidebar";
import OutdoorList from "@/modules/outdoor/components/OutdoorList";
import Features from "@/modules/home/components/Features";

export default function OutdoorPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Thiết Bị Ngoài Trời & Dã Ngoại Chính Hãng" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <OutdoorBanner />

        {/* Layout Grid 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <OutdoorSidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            <OutdoorList />
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
