---
name: documentation
description: Keeps technical documentation, API contracts, database schema specifications, and AI operating system files perfectly synchronized with codebase reality.
---

# Skill: Documentation Management

## 1. Điều kiện kích hoạt (Activation Triggers)
- Sau khi thêm mới hoặc sửa đổi API endpoints, database models hoặc cấu trúc thư mục.
- Khi người dùng gõ lệnh `/document`.
- Định kỳ sau mỗi đợt nâng cấp tính năng lớn để duy trì tính nhất quán của AI Project Memory.

## 2. Tài liệu cần tham khảo trước (References)
- [Documentation Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/documentation.md)
- [CLAUDE.md](file:///d:/Projects/ncf-sports-recommender/CLAUDE.md)
- [AGENTS.md](file:///d:/Projects/ncf-sports-recommender/AGENTS.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Rà soát đối chiếu Code và Docs:**
   - Đối chiếu danh sách router trong `backend/app/api/v1/router.py` với `.claude/reference/api-contracts.md`.
   - Đối chiếu các trường dữ liệu trong `backend/app/models/` với `.claude/reference/database-schema.md`.
   - Đối chiếu các modules trong `frontend/src/modules/` với sơ đồ cấu trúc trong `CLAUDE.md`.

2. **Cập nhật tài liệu kỹ thuật theo tiêu chuẩn:**
   - Sử dụng định dạng Markdown chuẩn của GitHub.
   - Thêm bảng biểu so sánh hoặc sơ đồ Mermaid khi mô tả luồng dữ liệu phức tạp.
   - Luôn sử dụng cú pháp link Markdown có thể nhấp được: `[CLAUDE.md](file:///d:/Projects/ncf-sports-recommender/CLAUDE.md)`.

3. **Bảo tồn tài liệu đồ án & luận văn:**
   - Không được xóa hoặc ghi đè các tài liệu học thuật gốc trong thư mục `docs/` (`Baocao.docx`, `in_B2205891_ThachLyNa_LuanVan.pdf`).
   - Mọi tài liệu kỹ thuật bổ sung cho AI cần được lưu vào các thư mục con tương ứng (`docs/architecture/`, `docs/guides/`, `.claude/reference/`).

4. **Kiểm tra tính toàn vẹn của liên kết (Link Integrity Check):**
   - Rà soát toàn bộ các đường dẫn tương đối và tuyệt đối để tránh tạo ra link 404 (broken markdown links).

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `replace_file_content` / `multi_replace_file_content`: Cập nhật nội dung tài liệu.
- `write_to_file`: Tạo tài liệu tham khảo hoặc hướng dẫn mới.
- `run_command`: Chạy script kiểm tra link nếu có.

## 5. Kết quả mong đợi (Expected Output)
Tài liệu dự án cập nhật đầy đủ, chính xác, không có thông tin lỗi thời, giúp các phiên làm việc tiếp theo của AI luôn nắm bắt đúng ngữ cảnh.

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- Không có bất kỳ endpoint hoặc model nào có trong code mà bị bỏ sót trong tài liệu kỹ thuật.
- Mọi ví dụ code trong tài liệu đều chạy được và đúng cú pháp.
