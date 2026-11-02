import type { NotificationTemplate, NotificationType } from "../types";

export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate[]> = {
  ai_recommend: [
    {
      label: "🔥 Gợi ý trang phục & giày AI",
      title: "🔥 Gợi ý sản phẩm chuẩn gu thể thao riêng cho bạn",
      message:
        "Dựa trên hồ sơ sở thích AI và các buổi tập của bạn, Kady Sport vừa tuyển chọn các mẫu giày thể thao và trang phục mới nhất với hiệu năng vượt trội. Bấm để khám phá ngay!",
      link: "/tai-khoan/recommendations",
    },
    {
      label: "⚡ Nâng cấp hiệu suất tập luyện",
      title: "⚡ Bộ sưu tập tối ưu hóa vận động tuần này",
      message:
        "Khám phá các phụ kiện và trang bị hỗ trợ phục hồi cơ bắp được hệ thống NCF AI đề xuất dành riêng cho bạn.",
      link: "/tai-khoan/recommendations",
    },
  ],
  order: [
    {
      label: "📦 Cập nhật chuẩn bị kiện hàng",
      title: "📦 Kady Sport đang đóng gói đơn hàng của bạn",
      message:
        "Đơn hàng của bạn đã qua bước kiểm tra chất lượng và đang được đóng gói cẩn thận. Kiện hàng sẽ sớm được giao tới địa chỉ của bạn!",
      link: "/tai-khoan/orders",
    },
    {
      label: "🚚 Thông báo giao hàng hỏa tốc",
      title: "🚚 Kiện hàng thể thao của bạn đang trên đường giao",
      message:
        "Đơn vị vận chuyển đang tiến hành phát hàng. Quý khách vui lòng chú ý điện thoại để nhận hàng thuận tiện nhất nhé!",
      link: "/tai-khoan/orders",
    },
  ],
  admin_message: [
    {
      label: "🌟 Tri ân hội viên Kady Sport",
      title: "🌟 Lời cảm ơn chân thành từ Kady Sport",
      message:
        "Cảm ơn bạn đã luôn đồng hành cùng Kady Sport trên hành trình nâng cao sức khỏe thể chất. Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7!",
      link: "/tai-khoan",
    },
    {
      label: "🎉 Sự kiện đặc quyền hội viên",
      title: "🎉 Lời mời tham gia sự kiện đặc quyền hội viên",
      message:
        "Bạn có đặc quyền tham gia chương trình ưu đãi tích điểm và trải nghiệm sớm các dòng sản phẩm thi đấu mới tại Kady Sport.",
      link: "/tai-khoan",
    },
  ],
};
