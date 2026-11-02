# Command: /plan

## 1. Mục đích
Thiết lập kế hoạch triển khai chi tiết, từng bước (Step-by-step Implementation Plan) cho một tính năng hoặc đợt tái cấu trúc (refactoring), dựa trên mẫu chuẩn tại `.claude/plans/templates/feature-plan.md`.

## 2. Input
- Kết quả từ lệnh `/analyze` hoặc yêu cầu tính năng cụ thể từ người dùng.
- Trạng thái hiện tại của codebase.

## 3. Quy trình thực hiện (5 bước)

1. **Khởi tạo kế hoạch:**  
   Sử dụng cấu trúc mẫu tại [`.claude/plans/templates/feature-plan.md`](file:///d:/Projects/ncf-sports-recommender/.claude/plans/templates/feature-plan.md).
2. **Chi tiết hóa các thay đổi:**  
   - Backend: Schemas (Pydantic), Models (Beanie), Services, Router endpoints.
   - Frontend: Stores (Zustand), API client hooks, Components, Pages (App Router).
3. **Thiết kế luồng dữ liệu (Data Flow):**  
   Mô tả luồng từ UI Event $\rightarrow$ API Request $\rightarrow$ Service/DB $\rightarrow$ UI State Update.
4. **Xác định chiến lược kiểm thử (Testing Strategy):**  
   Xác định cách kiểm tra từng bước bằng script, curl hoặc browser testing.
5. **Lập danh sách việc cần làm (Task Checklist):**  
   Liệt kê các bước thực thi theo thứ tự phụ thuộc (Dependencies Order).

## 4. Output mong đợi
Tệp kế hoạch dạng Markdown được lưu vào thư mục `.claude/plans/` hoặc hiển thị trực tiếp cho người dùng đánh giá trước khi thực thi code.

## 5. Tiêu chí hoàn thành (Definition of Done)
- Kế hoạch phải bao gồm danh sách đầy đủ các file cần tạo mới hoặc chỉnh sửa.
- Không có bước mơ hồ dạng "làm xong phần backend". Mọi bước đều phải có hành động cụ thể.
- Yêu cầu người dùng xác nhận (User Approval) trước khi bắt tay vào viết code.
