// Định nghĩa kiểu dữ liệu (TypeScript) cho 1 sản phẩm
export interface Product {
  id: string | number;
  name: string;
  category?: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl: string;
  discountLabel?: string;
  secondaryLabel?: string;
  sold?: number;
  total?: number;
}

export default function ProductCard({ product, isPromo = false }: { product: Product, isPromo?: boolean }) {
  // Determine badge color based on text
  let badgeColor = "bg-red-600";
  if (product.discountLabel === "HOT") badgeColor = "bg-blue-600";
  if (product.discountLabel === "GORE-TEX") badgeColor = "bg-gray-900";
  if (product.discountLabel === "MỚI" || product.discountLabel === "MỚI 2025" || product.discountLabel === "BÁN CHẠY") badgeColor = "bg-emerald-600";
  if (product.discountLabel === "CAO CẤP") badgeColor = "bg-blue-600";

  let secondaryBadgeColor = "bg-emerald-600";
  if (product.secondaryLabel === "KHUYÊN DÙNG" || product.secondaryLabel === "CAO CẤP") secondaryBadgeColor = "bg-blue-600";


  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col group p-4">
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-4">
        <img
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply p-4"
          src={product.imageUrl}
        />
        {product.discountLabel && (
          <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm ${badgeColor}`}>
            {product.discountLabel}
          </span>
        )}
        {product.secondaryLabel && (
          <span className={`absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm ${secondaryBadgeColor}`}>
            {product.secondaryLabel}
          </span>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        {product.category && (
          <div className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mb-1.5">
            {product.category}
          </div>
        )}
        
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition cursor-pointer mb-2 h-10">
          {product.name}
        </h3>
        
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating!) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">({product.reviewsCount})</span>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-black text-red-600">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through font-medium">
                {product.originalPrice}
              </span>
            )}
          </div>
          
          {isPromo && product.sold !== undefined && product.total !== undefined && (
            <div className="mb-3 w-full">
              <div className="w-full bg-red-100 rounded-full h-1.5 mb-1.5 relative overflow-hidden">
                <div className="bg-red-600 h-1.5 rounded-full absolute left-0 top-0" style={{ width: `${(product.sold / product.total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-medium px-1">
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.559-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                  Đã bán {product.sold}
                </span>
                <span>Còn lại {product.total - product.sold}/{product.total}</span>
              </div>
            </div>
          )}

          <button className={`w-full py-2 px-4 ${isPromo ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
