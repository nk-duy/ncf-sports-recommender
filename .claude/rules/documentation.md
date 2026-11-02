# Documentation & Memory Rules

Quy tắc quản lý và bảo trì tài liệu trong kho lưu trữ `ncf-sports-recommender`.

## 1. Vị trí Lưu trữ Tài liệu
- **Tài liệu AI Operating System:** Lưu trong thư mục `.claude/` (`commands/`, `skills/`, `hooks/`, `plans/`, `reference/`, `rules/`).
- **Tài liệu Hướng dẫn & Đồ án:** Lưu trong thư mục `docs/` (`architecture/`, `design/`, `requirements/`, `guides/`).
- **File Gốc Bắt Buộc:** `CLAUDE.md`, `AGENTS.md`, `README.md` đặt trực tiếp tại thư mục gốc của repository.
- **CẤM:** Không xả rác các file nháp ghi chú tạm thời (`scratch.txt`, `temp.md`, `note.txt`) ở thư mục gốc của dự án. Nếu cần tạo file tạm, hãy lưu trong thư mục con thích hợp hoặc xóa sau khi kiểm tra xong.

## 2. Tiêu chuẩn Định dạng Markdown
- Sử dụng cú pháp GitHub Flavored Markdown (GFM).
- **File Links:** Sử dụng cú pháp link Markdown chuẩn có thể nhấp được: `[CLAUDE.md](file:///d:/Projects/ncf-sports-recommender/CLAUDE.md)`.
- Khi trích dẫn bảng biểu hoặc luồng xử lý, sử dụng Mermaid code block (`mermaid`) hoặc Markdown Table để tăng tính trực quan.

## 3. Quy tắc Đồng bộ hóa (Single Source of Truth)
- Khi có bất kỳ thay đổi nào trong `backend/app/api/` hoặc `backend/app/models/`, phải dùng lệnh `/document` để đồng bộ lại:
  - `api-contracts.md`
  - `database-schema.md`
  - `CLAUDE.md` và `AGENTS.md`
- Không được để tồn tại 2 tài liệu mâu thuẫn nhau trong dự án (ví dụ một tài liệu bảo dùng MySQL, một tài liệu bảo dùng MongoDB).
