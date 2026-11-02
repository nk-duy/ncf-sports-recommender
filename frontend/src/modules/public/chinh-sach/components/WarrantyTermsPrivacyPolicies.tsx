import { PolicyTab } from '../types';

interface WarrantyTermsPrivacyPoliciesProps {
  activeTab: PolicyTab;
}

export default function WarrantyTermsPrivacyPolicies({
  activeTab,
}: WarrantyTermsPrivacyPoliciesProps) {
  if (activeTab === 'bao-hanh') {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Chính Sách Bảo Hành Sản Phẩm
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Cam kết 100% hàng chính hãng và chế độ bảo hành chu đáo
          </p>
        </div>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              1. Thời gian bảo hành theo nhóm hàng
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <strong className="text-gray-900 text-sm">
                    Giày thể thao (Running, Cầu lông, Pickleball, Bóng đá):
                  </strong>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bảo hành bung keo, sút chỉ, đứt gãy đế do lỗi từ nhà sản xuất.
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">
                  6 tháng
                </span>
              </div>

              <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <strong className="text-gray-900 text-sm">
                    Vợt Cầu lông &amp; Vợt Pickleball:
                  </strong>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bảo hành lỗi cấu trúc khung carbon do khuyết tật vật liệu.
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">
                  3 - 6 tháng
                </span>
              </div>

              <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <strong className="text-gray-900 text-sm">
                    Quần áo &amp; Phụ kiện tập luyện:
                  </strong>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bảo hành đường may, khóa kéo, bong tróc logo in ấn.
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-xs bg-gray-100 px-3 py-1 rounded-md">
                  30 ngày
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              2. Trường hợp không thuộc phạm vi bảo hành
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                Sản phẩm hư hỏng do va đập ngoại lực (cạch vợt, trầy rách bề mặt khi thi đấu sân gạch/bê tông).
              </li>
              <li>
                Hao mòn tự nhiên trong quá trình vận động (mòn đinh giày, đứt cước do lực đánh quá mức).
              </li>
              <li>Sản phẩm đã qua tự ý can thiệp, sửa chữa tại các cơ sở bên ngoài.</li>
            </ul>
          </div>

          <div className="pt-2 text-xs text-gray-400 border-t border-gray-100">
            * Căn cứ theo Điều 21 Luật Bảo vệ quyền lợi người tiêu dùng và Luật Chất lượng sản phẩm, hàng hóa 2007.
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'dieu-khoan') {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Điều Khoản Sử Dụng Dịch Vụ
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Quy định về giao dịch và sử dụng website kady.vn
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">1. Chấp thuận điều khoản</h3>
            <p className="text-gray-600">
              Khi truy cập và đặt hàng trên website KADY Sport, khách hàng xác nhận đã đọc, hiểu và đồng ý với các điều khoản mua bán, phương thức thanh toán và giao nhận được công bố công khai.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              2. Giá cả và thông tin đơn hàng
            </h3>
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
    );
  }

  return (
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
  );
}
