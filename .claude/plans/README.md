# Implementation Plans Directory

Nơi lưu trữ các bản kế hoạch triển khai tính năng và cải tiến kỹ thuật trước khi tiến hành viết code.

## Quy tắc quản lý kế hoạch

1. **Bắt buộc cho các thay đổi lớn:** Bất kỳ tính năng mới nào liên quan từ 2 module trở lên hoặc ảnh hưởng tới schema database bắt buộc phải có một bản kế hoạch lưu tại thư mục này.
2. **Quy ước đặt tên file:** `.claude/plans/YYYY-MM-DD-<feature-slug>.md`  
   *(Ví dụ: `2026-10-22-recently-viewed-recommendations.md`)*
3. **Mẫu chuẩn:** Sử dụng mẫu tại [`templates/feature-plan.md`](file:///d:/Projects/ncf-sports-recommender/.claude/plans/templates/feature-plan.md).
4. **Trạng thái kế hoạch:** Mỗi kế hoạch phải ghi rõ trạng thái ở đầu tài liệu:
   - `DRAFT`: Đang soạn thảo
   - `APPROVED`: Đã được phê duyệt bởi người dùng
   - `IN_PROGRESS`: Đang trong quá trình triển khai code
   - `COMPLETED`: Đã hoàn thành và xác minh kiểm thử
