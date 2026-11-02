# Technical Reference Index

Tài liệu tham chiếu kỹ thuật chi tiết của hệ thống KADY Sports Recommender.  
Mọi AI Agent khi làm việc với codebase cần tra cứu các tài liệu này để tránh suy đoán sai lầm.

| Tài liệu tham chiếu | Mô tả nội dung |
|---|---|
| [`architecture.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/architecture.md) | Kiến trúc tổng thể hệ thống, phân rã monorepo Next.js + FastAPI + MongoDB |
| [`api-contracts.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/api-contracts.md) | Đặc tả các endpoints RESTful API (/api/v1/), request/response schema |
| [`database-schema.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/database-schema.md) | Cấu trúc các Beanie Document Collections trong MongoDB `ncf_recommender_db` |
| [`recommendation-pipeline.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/recommendation-pipeline.md) | Thuật toán gợi ý NCF (PyTorch GMF + MLP), cosine similarity và fallback logic |
| [`ui-ux-guidelines.md`](file:///d:/Projects/ncf-sports-recommender/.claude/reference/ui-ux-guidelines.md) | Quy chuẩn giao diện, bảng màu thể thao, typography, Mantine v9 và Tailwind v4 |

---

> [!NOTE]
> Các tài liệu này được xác thực trực tiếp từ mã nguồn thực tế và schema MongoDB đang hoạt động. Nếu có thay đổi trong code, hãy dùng lệnh `/document` để cập nhật lại.
