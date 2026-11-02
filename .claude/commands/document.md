# Command: /document

## 1. Mục đích
Tự động đồng bộ hóa và cập nhật tài liệu kỹ thuật của dự án khi có thay đổi về kiến trúc, database schema, API contracts hoặc luồng người dùng, đảm bảo tài liệu phản ánh chính xác 100% mã nguồn thực tế.

## 2. Input
- Module hoặc tính năng vừa được triển khai / chỉnh sửa.
- Tài liệu liên quan trong `.claude/reference/` hoặc `docs/`.

## 3. Quy trình thực hiện (4 bước)

1. **Quét thay đổi thực tế:**
   - Kiểm tra các endpoint mới trong `backend/app/api/v1/router.py`.
   - Kiểm tra các trường dữ liệu mới trong `backend/app/models/`.
   - Kiểm tra các route giao diện mới trong `frontend/src/app/`.
2. **Cập nhật Reference:**
   - Nếu thay đổi API $\rightarrow$ Cập nhật [`.claude/reference/api-contracts.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/api-contracts.md).
   - Nếu thay đổi Model $\rightarrow$ Cập nhật [`.claude/reference/database-schema.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/database-schema.md).
   - Nếu thay đổi luồng gợi ý $\rightarrow$ Cập nhật [`.claude/reference/recommendation-pipeline.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/recommendation-pipeline.md).
3. **Đồng bộ hóa File bộ nhớ AI:**
   - Cập nhật mục lục trong `CLAUDE.md` và `AGENTS.md` nếu có module mới.
4. **Kiểm tra liên kết chéo (Cross-reference links):**
   - Đảm bảo tất cả các link Markdown đều trỏ đúng file tồn tại.

## 4. Output mong đợi
Diff cập nhật của các tài liệu kỹ thuật tương ứng, giữ nguyên văn phong chuyên nghiệp và có cấu trúc bảng biểu/Mermaid rõ ràng.

## 5. Tiêu chí hoàn thành (Definition of Done)
- Không bịa đặt tham số API hoặc thuộc tính database chưa có trong code.
- Mọi sơ đồ luồng dữ liệu đều phải tương thích với mã nguồn thực tế.
