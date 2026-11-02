---
name: requirements-analysis
description: Analyzes user requests, decomposes user stories, defines acceptance criteria, identifies scope ambiguities, and verifies system constraints for KADY Sports Recommender.
---

# Skill: Requirements Analysis

## 1. Điều kiện kích hoạt (Activation Triggers)
- Khi người dùng đưa ra một yêu cầu mới, tính năng mới hoặc mô tả bài toán cần giải quyết.
- Khi người dùng gõ lệnh `/analyze`.
- Khi yêu cầu ban đầu còn mơ hồ, thiếu thông tin kỹ thuật hoặc có khả năng mâu thuẫn với cấu trúc hiện tại.

## 2. Tài liệu cần tham khảo trước (References)
- [Architecture Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/architecture.md)
- [API Contracts](file:///d:/Projects/ncf-sports-recommender/.claude/reference/api-contracts.md)
- [Database Schema](file:///d:/Projects/ncf-sports-recommender/.claude/reference/database-schema.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Trích xuất mục tiêu cốt lõi:**
   - Xác định rõ vai trò người dùng (Khách vãng lai, Khách hàng đã đăng nhập, Admin).
   - Xác định giá trị nghiệp vụ đem lại (ví dụ: tăng tỷ lệ chốt đơn nhờ cross-sell, cải thiện độ chính xác gợi ý NCF).

2. **Bóc tách User Stories & Acceptance Criteria:**
   - Định dạng User Story: *"Với vai trò là [Role], tôi muốn [Action] để [Benefit]."*
   - Thiết lập Acceptance Criteria (AC) dạng Checklist kiểm thử được (có thể test đúng/sai rõ ràng).

3. **Phân tích ranh giới hệ thống (Scope Boundaries):**
   - Xác định rõ những gì **NẰM TRONG PHẠM VI (In-Scope)**.
   - Xác định rõ những gì **NẰM NGOÀI PHẠM VI (Out-of-Scope)** để tránh phình to tính năng (scope creep).

4. **Xác minh các ràng buộc hiện hữu:**
   - Frontend Next.js 16: Cần Server Component hay Client Component? Có cần thêm Zustand state không?
   - Backend FastAPI: Có cần schema Pydantic mới không? Có cần thêm route vào `api/v1/router.py` không?
   - Database MongoDB: Có cần thêm trường mới vào Beanie model không? Có tương thích ngược với dữ liệu cũ không?

5. **Phát hiện mâu thuẫn & câu hỏi làm rõ:**
   - Liệt kê các điểm chưa rõ ràng cần hỏi ý kiến người dùng trước khi chuyển sang bước lập kế hoạch.

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `view_file`: Xem các file model, router, schema liên quan.
- `grep_search`: Tìm kiếm các từ khóa, hằng số, route tương tự trong dự án.
- `ask_question`: Đặt câu hỏi trắc nghiệm/làm rõ cho người dùng nếu phát hiện điểm mù.

## 5. Kết quả mong đợi (Expected Output)
Báo cáo phân tích yêu cầu chuẩn gồm:
- Mục tiêu tính năng (Objective).
- User Stories & Tiêu chí chấp nhận (Acceptance Criteria).
- Bảng phân tích tác động hệ thống (System Impact Table).
- Danh sách câu hỏi/rủi ro cần lưu ý.

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- Không có giả định thiếu căn cứ về cơ sở dữ liệu (ví dụ: tuyệt đối không nhắc đến MySQL hay Drizzle).
- Mọi Acceptance Criteria đều có thể đo lường và kiểm chứng bằng thao tác kỹ thuật cụ thể.
