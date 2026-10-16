'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/shared/components/Breadcrumb';
import Link from 'next/link';
import { 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Phone, 
  MessageCircle,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';

export type PolicyTab = 'giao-hang' | 'doi-tra' | 'bao-hanh' | 'dieu-khoan' | 'bao-mat';

export const POLICY_TABS = [
  { id: 'giao-hang', label: 'Chính sách giao hàng', icon: Truck },
  { id: 'doi-tra', label: 'Đổi trả trong 30 ngày', icon: RefreshCw },
  { id: 'bao-hanh', label: 'Chính sách bảo hành', icon: ShieldCheck },
  { id: 'dieu-khoan', label: 'Điều khoản sử dụng', icon: FileText },
  { id: 'bao-mat', label: 'Chính sách bảo mật', icon: Lock },
];

function PolicyContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<PolicyTab>('giao-hang');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as PolicyTab;
    if (tabParam && ['giao-hang', 'doi-tra', 'bao-hanh', 'dieu-khoan', 'bao-mat'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Chính sách & Quy định' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Header / Banner - Tự nhiên, phong cách thương mại điện tử chuyên nghiệp */}
      <div className="bg-white border-b border-gray-200 py-8 sm:py-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Chính Sách & Quy Định Mua Hàng
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Thông tin chi tiết về dịch vụ giao vận, bảo hành, đổi size và cam kết bảo mật quyền lợi dành cho khách hàng tại KADY.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Danh mục chính sách
              </div>
              <div className="space-y-1">
                {POLICY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as PolicyTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                        isActive 
                          ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={17} className={isActive ? 'text-white' : 'text-gray-400'} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight size={15} className={`opacity-60 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hỗ trợ nhanh */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-sm">
              <div className="flex items-center gap-2 text-gray-900 font-bold mb-1.5">
                <HelpCircle size={16} className="text-blue-600" />
                <span>Cần hỗ trợ trực tiếp?</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Nếu bạn có câu hỏi về đơn hàng, đổi size hoặc bảo hành, đội ngũ CSKH luôn sẵn sàng hỗ trợ từ 08:00 – 21:30 hàng ngày.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:19006868"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Phone size={14} className="text-blue-600" />
                  Hotline: 1900 6868
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <MessageCircle size={14} />
                  Nhắn tin qua Zalo
                </a>
              </div>
            </div>
          </div>

          {/* Policy Detail Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
            
            {/* 1. GIAO HÀNG */}
            {activeTab === 'giao-hang' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chính Sách Giao Hàng & Đồng Kiểm
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Áp dụng cho toàn bộ đơn hàng đặt qua website</p>
                </div>

                <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3.5 text-xs sm:text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span><strong>Ưu đãi vận chuyển:</strong> Miễn phí giao hàng tiêu chuẩn cho tất cả đơn hàng từ <strong>499.000đ</strong> trở lên trên toàn quốc.</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Thời gian và cước phí vận chuyển</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                          <tr>
                            <th className="p-3">Khu vực</th>
                            <th className="p-3">Thời gian dự kiến</th>
                            <th className="p-3">Cước phí (Đơn &lt; 499k)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                          <tr>
                            <td className="p-3 font-medium text-gray-800">Nội thành TP.HCM & Hà Nội</td>
                            <td className="p-3">Giao nhanh 2 - 4 tiếng hoặc trong ngày</td>
                            <td className="p-3">25.000đ</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-gray-800">Các tỉnh thành miền Nam / Bắc</td>
                            <td className="p-3">1 - 2 ngày làm việc</td>
                            <td className="p-3">30.000đ</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-gray-800">Tuyến huyện / Xã / Vùng xa</td>
                            <td className="p-3">2 - 4 ngày làm việc</td>
                            <td className="p-3">35.000đ</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Quy định đồng kiểm khi nhận hàng</h3>
                    <p className="text-gray-600 mb-2">
                      Để bạn hoàn toàn yên tâm khi mua sắm online, KADY luôn khuyến khích khách hàng <strong>đồng kiểm mở hộp trước mặt nhân viên giao hàng</strong>:
                    </p>
                    <ul className="space-y-1.5 text-gray-600 pl-1">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Kiểm tra đúng mẫu mã, màu sắc, size số đã đặt trên website.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Kiểm tra ngoại quan sản phẩm, tem mác và phụ kiện/quà tặng đi kèm (nếu có).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Trường hợp phát hiện hàng bị móp méo, trầy xước do vận chuyển hoặc sai mẫu, quý khách có quyền từ chối nhận hàng mà không tốn bất kỳ chi phí nào.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
                    * Căn cứ theo Nghị định 52/2013/NĐ-CP và Nghị định 85/2021/NĐ-CP về Thương mại điện tử.
                  </div>
                </div>
              </div>
            )}

            {/* 2. ĐỔI TRẢ 30 NGÀY */}
            {activeTab === 'doi-tra' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chính Sách Đổi Size & Đổi Trả Trong 30 Ngày
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Đổi size tận nơi, thủ tục đơn giản và thuận tiện</p>
                </div>

                <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3.5 text-xs sm:text-sm font-medium">
                    👟 <strong>Dịch vụ Đổi Size Tận Nhà:</strong> Thử giày hoặc đồ tập không vừa vặn? KADY gửi shipper mang size mới đến tận cửa đổi cho bạn, bạn không cần phải ra bưu cục gửi hàng lại.
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Điều kiện áp dụng đổi trả</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Sản phẩm còn nguyên tem mác, hộp đựng ban đầu và chưa qua sử dụng / giặt ủi.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Thời gian áp dụng trong vòng <strong>30 ngày</strong> kể từ ngày bạn nhận hàng thành công.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>Được đổi sang size khác cùng mẫu, hoặc đổi sang sản phẩm khác có giá trị tương đương/cao hơn.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Các bước đổi hàng</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 1</span>
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">Liên hệ CSKH</h4>
                        <p className="text-[12px] text-gray-500">Nhắn Zalo hoặc gọi Hotline thông báo mã đơn và size cần đổi.</p>
                      </div>
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 2</span>
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">Giao size mới</h4>
                        <p className="text-[12px] text-gray-500">Shipper mang sản phẩm mới đến tận nhà bạn trong 1 - 2 ngày.</p>
                      </div>
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 3</span>
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">Đổi tại chỗ</h4>
                        <p className="text-[12px] text-gray-500">Bạn gửi lại sản phẩm không vừa cho shipper mang về là xong.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
                    * Căn cứ theo Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15.
                  </div>
                </div>
              </div>
            )}

            {/* 3. BẢO HÀNH */}
            {activeTab === 'bao-hanh' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chính Sách Bảo Hành Sản Phẩm
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Cam kết 100% hàng chính hãng và chế độ bảo hành chu đáo</p>
                </div>

                <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Thời gian bảo hành theo nhóm hàng</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="text-gray-900 text-sm">Giày thể thao (Running, Cầu lông, Pickleball, Bóng đá):</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Bảo hành bung keo, sút chỉ, đứt gãy đế do lỗi từ nhà sản xuất.</p>
                        </div>
                        <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">6 tháng</span>
                      </div>

                      <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="text-gray-900 text-sm">Vợt Cầu lông & Vợt Pickleball:</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Bảo hành lỗi cấu trúc khung carbon do khuyết tật vật liệu.</p>
                        </div>
                        <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">3 - 6 tháng</span>
                      </div>

                      <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="text-gray-900 text-sm">Quần áo & Phụ kiện tập luyện:</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Bảo hành đường may, khóa kéo, bong tróc logo in ấn.</p>
                        </div>
                        <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">30 ngày</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Trường hợp không thuộc phạm vi bảo hành</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Sản phẩm hư hỏng do va đập ngoại lực (cạch vợt, trầy rách bề mặt khi thi đấu sân gạch/bê tông).</li>
                      <li>Hao mòn tự nhiên trong quá trình vận động (mòn đinh giày, đứt cước do lực đánh quá mức).</li>
                      <li>Sản phẩm đã qua tự ý can thiệp, sửa chữa tại các cơ sở bên ngoài.</li>
                    </ul>
                  </div>

                  <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
                    * Căn cứ theo Điều 21 Luật Bảo vệ quyền lợi người tiêu dùng và Luật Chất lượng sản phẩm, hàng hóa 2007.
                  </div>
                </div>
              </div>
            )}

            {/* 4. ĐIỀU KHOẢN SỬ DỤNG */}
            {activeTab === 'dieu-khoan' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Điều Khoản Sử Dụng Dịch Vụ
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Quy định về giao dịch và sử dụng website kady.vn</p>
                </div>

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">1. Chấp thuận điều khoản</h3>
                    <p className="text-gray-600">
                      Khi truy cập và đặt hàng trên website KADY Sport, khách hàng xác nhận đã đọc, hiểu và đồng ý với các điều khoản mua bán, phương thức thanh toán và giao nhận được công bố công khai.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">2. Giá cả và thông tin đơn hàng</h3>
                    <p className="text-gray-600">
                      Toàn bộ giá bán hiển thị trên website là giá thanh toán cuối cùng tính bằng Đồng Việt Nam (VND). Giá đã bao gồm thuế GTGT (VAT) theo quy định hiện hành và chưa bao gồm phí giao hàng (nếu đơn hàng dưới mức miễn phí ship).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">3. Quyền sở hữu trí tuệ</h3>
                    <p className="text-gray-600">
                      Toàn bộ nội dung hình ảnh, video sản phẩm, logo thương hiệu và bài viết trên website thuộc quyền sở hữu của KADY Sport. Mọi hành vi sao chép nhằm mục đích thương mại khi chưa có sự chấp thuận đều bị nghiêm cấm theo Luật Sở hữu trí tuệ.
                    </p>
                  </div>

                  <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
                    * Căn cứ theo Luật Giao dịch điện tử số 20/2023/QH15 và Bộ luật Dân sự 2015.
                  </div>
                </div>
              </div>
            )}

            {/* 5. BẢO MẬT THÔNG TIN */}
            {activeTab === 'bao-mat' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chính Sách Bảo Mật Thông Tin
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Cam kết bảo vệ dữ liệu cá nhân của khách hàng</p>
                </div>

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">1. Mục đích thu thập thông tin</h3>
                    <p className="text-gray-600">
                      KADY chỉ thu thập các thông tin tối thiểu cần thiết phục vụ việc hoàn tất đơn đặt hàng gồm: Họ tên, Số điện thoại nhận hàng, Địa chỉ giao nhận và Email (dùng để gửi hóa đơn điện tử và mã tra cứu vận đơn).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">2. Cam kết không chia sẻ dữ liệu</h3>
                    <p className="text-gray-600">
                      Chúng tôi cam kết không bán, không chuyển nhượng và không chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại hay quảng cáo. Dữ liệu địa chỉ nhận hàng chỉ được cung cấp cho đơn vị vận chuyển đối tác để thực hiện giao phát hàng.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">3. An toàn thanh toán</h3>
                    <p className="text-gray-600">
                      Toàn bộ giao dịch thanh toán trực tuyến qua cổng điện tử đều được mã hóa bằng giao thức bảo mật SSL. Hệ thống không lưu giữ thông tin thẻ ngân hàng hoặc mật khẩu tài khoản thanh toán của khách hàng.
                    </p>
                  </div>

                  <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
                    * Tuân thủ quy định tại Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân (PDPD) và Luật An toàn thông tin mạng 2015.
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default function PoliciesPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PolicyContent />
    </Suspense>
  );
}
