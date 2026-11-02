import { Check } from 'lucide-react';
import { PolicyTab } from '../types';

interface ShippingAndReturnPoliciesProps {
  activeTab: PolicyTab;
}

export default function ShippingAndReturnPolicies({
  activeTab,
}: ShippingAndReturnPoliciesProps) {
  if (activeTab === 'giao-hang') {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Chính Sách Giao Hàng &amp; Đồng Kiểm
          </h2>
          <p className="text-xs text-gray-400 mt-1">Áp dụng cho toàn bộ đơn hàng đặt qua website</p>
        </div>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3.5 text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <span>
              <strong>Ưu đãi vận chuyển:</strong> Miễn phí giao hàng tiêu chuẩn cho tất cả đơn hàng từ{' '}
              <strong>499.000đ</strong> trở lên trên toàn quốc.
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              1. Thời gian và cước phí vận chuyển
            </h3>
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
                    <td className="p-3 font-medium text-gray-800">Nội thành TP.HCM &amp; Hà Nội</td>
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
            <h3 className="text-base font-bold text-gray-900 mb-2">
              2. Quy định đồng kiểm khi nhận hàng
            </h3>
            <p className="text-gray-600 mb-2">
              Để bạn hoàn toàn yên tâm khi mua sắm online, KADY luôn khuyến khích khách hàng{' '}
              <strong>đồng kiểm mở hộp trước mặt nhân viên giao hàng</strong>:
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
                <span>
                  Trường hợp phát hiện hàng bị móp méo, trầy xước do vận chuyển hoặc sai mẫu, quý khách có quyền từ chối nhận hàng mà không tốn bất kỳ chi phí nào.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
            * Căn cứ theo Nghị định 52/2013/NĐ-CP và Nghị định 85/2021/NĐ-CP về Thương mại điện tử.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Chính Sách Đổi Size &amp; Đổi Trả Trong 30 Ngày
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Đổi size tận nơi, thủ tục đơn giản và thuận tiện
        </p>
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
              <span>
                Thời gian áp dụng trong vòng <strong>30 ngày</strong> kể từ ngày bạn nhận hàng thành công.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Được đổi sang size khác cùng mẫu, hoặc đổi sang sản phẩm khác có giá trị tương đương/cao hơn.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2">2. Các bước đổi hàng</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 1</span>
              <h4 className="font-semibold text-gray-900 text-xs mb-1">Liên hệ CSKH</h4>
              <p className="text-[12px] text-gray-500">
                Nhắn Zalo hoặc gọi Hotline thông báo mã đơn và size cần đổi.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 2</span>
              <h4 className="font-semibold text-gray-900 text-xs mb-1">Giao size mới</h4>
              <p className="text-[12px] text-gray-500">
                Shipper mang sản phẩm mới đến tận nhà bạn trong 1 - 2 ngày.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 3</span>
              <h4 className="font-semibold text-gray-900 text-xs mb-1">Đổi tại chỗ</h4>
              <p className="text-[12px] text-gray-500">
                Bạn gửi lại sản phẩm không vừa cho shipper mang về là xong.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
          * Căn cứ theo Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15.
        </div>
      </div>
    </div>
  );
}
