---
name: feature-planning
description: Designs system data flows, plans backend endpoints and frontend components, assesses architectural risks, and produces execution plans before writing code.
---

# Skill: Feature Planning

## 1. Điều kiện kích hoạt (Activation Triggers)
- Sau khi hoàn thành phân tích yêu cầu từ `requirements-analysis`.
- Khi người dùng gõ lệnh `/plan` hoặc yêu cầu lập kế hoạch cho một tính năng lớn.
- Khi chuẩn bị thực hiện refactoring hoặc thay đổi luồng xử lý trên 2 module trở lên.

## 2. Tài liệu cần tham khảo trước (References)
- [Feature Plan Template](file:///d:/Projects/ncf-sports-recommender/.claude/plans/templates/feature-plan.md)
- [Architecture Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/architecture.md)
- [Recommendation Pipeline Spec](file:///d:/Projects/ncf-sports-recommender/.claude/reference/recommendation-pipeline.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Khảo sát kiến trúc hiện hành:**
   - Đọc các service và component đang chịu trách nhiệm cho nghiệp vụ tương tự.
   - Kiểm tra cách đặt tên file, đường dẫn import và quy ước modular clean architecture.

2. **Thiết kế luồng xử lý (Data Flow Design):**
   - Mô tả cụ thể luồng dữ liệu 2 chiều giữa Frontend $\leftrightarrow$ Backend $\leftrightarrow$ Database.
   - Vẽ biểu đồ luồng Mermaid ngắn gọn để trực quan hóa tương tác giữa các thành phần.

3. **Lập danh sách tệp mã nguồn cần tác động:**
   - Phân loại rõ ràng:
     - `Tạo mới (Create)`: Đường dẫn tuyệt đối và mục đích của file mới.
     - `Chỉnh sửa (Modify)`: Chỉ rõ khối mã hoặc hàm cần cập nhật.
     - `Không đụng tới (Untouched)`: Những file lân cận cần giữ nguyên để tránh regression.

4. **Đánh giá rủi ro & giải pháp phòng ngừa (Risk Assessment):**
   - Rủi ro về dữ liệu: Schema migration (nếu có trường mới, giá trị mặc định là gì?).
   - Rủi ro về giao diện: Break layout, hydration mismatch trong Next.js 16, vỡ ảnh nếu không có onError.
   - Rủi ro về AI: Làm loãng vector NCF hoặc trùng lặp sản phẩm gợi ý.

5. **Xây dựng Checklist thực thi từng bước (Execution Steps):**
   - Chia nhỏ thành các bước tuần tự (Backend Schema $\rightarrow$ Service $\rightarrow$ API Endpoint $\rightarrow$ Frontend Store $\rightarrow$ UI Component $\rightarrow$ Integration Verification).

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `view_file`: Xem chi tiết các hàm và kiểu dữ liệu hiện hữu.
- `write_to_file`: Lưu bản kế hoạch hoàn chỉnh vào `.claude/plans/<feature-name>.md`.

## 5. Kết quả mong đợi (Expected Output)
Tệp kế hoạch triển khai hoàn chỉnh tuân thủ mẫu chuẩn tại `.claude/plans/templates/feature-plan.md`, sẵn sàng để người dùng xem xét và phê duyệt.

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- Kế hoạch phải có đầy đủ các bước từ backend tới frontend và bước kiểm thử xác nhận.
- Đã được người dùng xác nhận trước khi chuyển sang skill `feature-implementation`.
