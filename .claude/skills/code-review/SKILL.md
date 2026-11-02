---
name: code-review
description: Audits code quality, identifies edge cases, security flaws, performance bottlenecks, and architectural anti-patterns across Next.js and FastAPI services.
---

# Skill: Code Review

## 1. Điều kiện kích hoạt (Activation Triggers)
- Sau khi hoàn thành một lượt triển khai tính năng hoặc sửa lỗi.
- Khi người dùng gõ lệnh `/review`.
- Trước khi tạo Pull Request hoặc đánh dấu hoàn tất công việc.

## 2. Tài liệu cần tham khảo trước (References)
- [Code Style Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/code-style.md)
- [Security Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/security.md)
- [Architecture Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/architecture.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Kiểm tra Logic & Độ ổn định (Correctness & Robustness):**
   - Đảm bảo các nhánh điều kiện (if/else), try/catch bao phủ được các tình huống ngoại lệ (mạng chập chờn, DB timeout, dữ liệu null).
   - Kiểm tra các thao tác mảng (map, filter, find) có kiểm tra mảng rỗng trước khi truy cập phần tử không.

2. **Kiểm tra An ninh & Quyền hạn (Security & Permissions):**
   - Không được hardcode secrets, token, URI database có mật khẩu vào mã nguồn.
   - Các API nhạy cảm (quản lý sản phẩm, đơn hàng, retrain model) phải có xác thực token và role admin.
   - Tránh SQL/NoSQL Injection bằng việc sử dụng truy vấn Beanie có tham số hóa.

3. **Kiểm tra Hiệu năng & Tài nguyên (Performance & Scaling):**
   - Tránh việc fetch toàn bộ collection MongoDB vào RAM (`.find().to_list()` không có limit hoặc projection).
   - Tránh tính toán lại embedding NCF quá nhiều lần; sử dụng caching hoặc vector cosine hiệu quả.
   - Tránh lạm dụng `'use client'` khiến bundle size của Next.js tăng vọt.

4. **Kiểm tra Tính nhất quán & Thẩm mỹ (UI/UX Consistency):**
   - Thẻ `<img>` có xử lý `onError` không?
   - Định dạng tiền tệ có dùng thống nhất hàm `toLocaleString('vi-VN')` hoặc `formatVND` không?
   - Trạng thái loading và empty state có trực quan và thân thiện với người dùng không?

5. **Phân loại và Ghi nhận Kết quả:**
   - Tạo danh sách nhận xét phân loại rõ ràng:
     - 🔴 **Critical:** Lỗi logic gây crash, hở bảo mật hoặc vi phạm kiến trúc nghiêm trọng.
     - 🟡 **Warning:** Thiếu xử lý edge-case, nguy cơ chậm khi dữ liệu lớn, trùng lặp logic nhẹ.
     - 🟢 **Suggestion:** Gợi ý tối ưu cú pháp, đặt tên biến rõ nghĩa hơn hoặc cải thiện trải nghiệm người dùng.

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `view_file`: Xem lại toàn bộ file sau khi chỉnh sửa.
- `grep_search`: Tìm kiếm các vị trí có thể bị ảnh hưởng dây chuyền.

## 5. Kết quả mong đợi (Expected Output)
Báo cáo Code Review chi tiết, chỉ rõ dòng mã và kèm đề xuất sửa lỗi cụ thể (kèm code block).

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- Đưa ra đánh giá công tâm, chính xác, không khen ngợi hình thức nếu vẫn còn lỗi tồn đọng.
