import Breadcrumb from "@/shared/components/Breadcrumb";
import ProductsSidebar from "@/modules/public/san-pham/components/ProductsSidebar";
import DynamicProductList from "@/shared/components/DynamicProductList";
import Features from "@/modules/public/trang-chu/components/Features";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport_type?: string; product_type?: string; search?: string; category?: string }>
}) {
  const { sport_type, product_type, search, category } = await searchParams;
  
  let currentLabel = "Tất cả sản phẩm";
  if (search) currentLabel = `Tìm kiếm: ${search}`;
  else if (sport_type && product_type) currentLabel = `${product_type.split(',').join(', ')} - ${sport_type.split(',').join(', ')}`;
  else if (sport_type) currentLabel = `Đồ Thể Thao: ${sport_type.split(',').join(', ')}`;
  else if (product_type && category) currentLabel = `${category}`;
  else if (product_type) currentLabel = product_type.split(',').join(', ');
  else if (category) currentLabel = category;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/san-pham" },
    { label: currentLabel }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto px-3 sm:px-6 lg:px-12 xl:px-16 overflow-x-hidden">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-2">
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ProductsSidebar />
          </aside>
          <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">
            <DynamicProductList />
          </main>
        </div>
      </div>
      <div className="bg-white mt-16 py-10 border-t border-gray-100 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-full mx-auto px-3 sm:px-6 lg:px-12 xl:px-16">
          <Features />
        </div>
      </div>
    </div>
  );
}
