export default function NextBasketCrossSell() {
  const recommendations = [
    {
      id: 1,
      name: "Đôi Tạ Tay Thông Minh Điều Chỉnh 10kg SportsAI",
      description: "Cơ chế xoay đổi tạ từ 2kg - 10kg nhanh trong 1 giây, bổ trợ tăng sức bền cơ bắp khi chạy dài.",
      price: 1850000,
      tag: "Khớp 99% mục tiêu",
      tagColor: "bg-blue-100 text-blue-700",
      image: "https://www.gstop.vn/wp-content/uploads/2022/10/Giay-Chay-Bo-Nam-Nike-Air-Zoom-Pegasus-39-DH4071-007-DenXanh-2.jpg"
    },
    {
      id: 2,
      name: "Quần Short Tập Gym Co Giãn 2 Lớp Thoáng Khí SportsAI",
      description: "Thiết kế lớp lót ôm cơ đùi chống ma sát, đồng bộ màu sắc hoàn hảo với áo Dry-Fit bạn vừa...",
      price: 280000,
      tag: "Phối đồ chuẩn AI",
      tagColor: "bg-emerald-100 text-emerald-700",
      image: "https://www.gstop.vn/wp-content/uploads/2024/04/Giay-Chay-Bo-Nam-Qiaodan-Feiying-Pb4.0-Qinggong-2.0-Ff-Q322420108-TrangXanh-3-768x768.jpg"
    },
    {
      id: 3,
      name: "Balo Dã Ngoại Chống Nước Ultra-light",
      description: "Chất liệu Cordura siêu nhẹ, có ngăn thông khí đựng riêng giày chạy và khăn tập đẫm mồ hôi.",
      price: 850000,
      tag: "Đồng hành Marathon",
      tagColor: "bg-blue-100 text-blue-700",
      image: "https://www.gstop.vn/wp-content/uploads/2023/11/Balo-The-Thao-Nike-Heritage-Eugene-Db3300-010-Den-2.jpg"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h3 className="text-blue-700 font-bold flex items-center gap-2 mb-2 md:mb-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Gợi ý bổ trợ cho đơn hàng của bạn từ SportsAI Engine
          <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-widest ml-1">
            NCF NEXT-BASKET
          </span>
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
        <p className="text-sm text-gray-600 max-w-3xl">
          Dựa trên giày Marathon Carbon và trang phục Dry Fit bạn vừa mua, thuật toán <strong className="text-gray-900">Neural Collaborative Filtering</strong> đề xuất 3 món đồ tối ưu hiệu suất tập luyện:
        </p>
        <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex-shrink-0 mt-2 md:mt-0">
          Xem tất cả gợi ý AI →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col hover:border-blue-200 hover:shadow-md transition-all">
            {/* Image Box */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-lg mb-4 flex items-center justify-center border border-gray-100 overflow-hidden group">
              <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-1 rounded shadow-sm z-10 ${item.tagColor}`}>
                {item.tag}
              </span>
              <img src={item.image} alt={item.name} className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            {/* Info */}
            <div className="flex flex-col flex-1">
              <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                {item.name}
              </h4>
              <p className="text-[11px] text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
              
              {/* Bottom (Price & Action) */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-lg font-black text-gray-900">{item.price.toLocaleString('vi-VN')} đ</span>
                <button className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm vào đơn
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
