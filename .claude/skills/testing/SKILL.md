---
name: testing
description: Verifies backend endpoints, runs Python validation scripts, performs frontend linting and build checks, and produces evidence-based test reports.
---

# Skill: Testing & Verification

## 1. Điều kiện kích hoạt (Activation Triggers)
- Sau khi hoàn thành triển khai mã nguồn hoặc sửa lỗi tính năng.
- Trước khi báo cáo hoàn thành công việc cho người dùng.
- Khi cần kiểm tra tính tương thích, tính đúng đắn của dữ liệu trong MongoDB hoặc pipeline gợi ý NCF.

## 2. Tài liệu cần tham khảo trước (References)
- [Testing Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/testing.md)
- [API Contracts](file:///d:/Projects/ncf-sports-recommender/.claude/reference/api-contracts.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Xác định phạm vi cần kiểm thử:**
   - Nếu sửa Backend: Cần test endpoint qua curl/urllib script, kiểm tra mã HTTP status (200 OK, 400, 404, 500) và cấu trúc payload JSON.
   - Nếu sửa Frontend: Cần chạy `npm run lint` hoặc kiểm tra build của component, kiểm tra console log và network request.
   - Nếu sửa Recommendation Engine: Cần test độc bản (không trùng URL ảnh, không trùng tên sản phẩm gốc, trả về đúng số lượng `top_k`).

2. **Soạn thảo kịch bản kiểm thử độc lập (Test Script):**
   - Tạo script kiểm thử nhỏ gọn trong `backend/scripts/` nếu cần (ví dụ: `test_feature_x.py`).
   - Đảm bảo script cấu hình mã hóa Unicode an toàn trên Windows:
     ```python
     import sys
     sys.stdout.reconfigure(encoding='utf-8')
     ```

3. **Thực thi kiểm thử thực tế:**
   - Chạy lệnh bằng công cụ `run_command`.
   - Thu thập output thực tế (Status code, Response Body, Thời gian phản hồi).

4. **Phân tích kết quả:**
   - Phân biệt rõ ràng giữa:
     - Lỗi có sẵn từ trước (Pre-existing issues).
     - Lỗi mới phát sinh do thay đổi vừa thực hiện (Regression).
   - Tuyệt đối **KHÔNG BAO GIỜ BỊA ĐẶT KẾT QUẢ TEST** nếu chưa chạy lệnh thực tế!

5. **Lập báo cáo kiểm thử (Verification Report):**
   - Liệt kê: Lệnh đã chạy, Trạng thái (Passed/Failed), Bằng chứng (Logs/Output), Những phần chưa thể kiểm thử tự động (cần người dùng tương tác tay trên trình duyệt).

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `run_command`: Chạy các lệnh kiểm thử qua PowerShell.
- `write_to_file`: Tạo script test tạm thời nếu cần.

## 5. Kết quả mong đợi (Expected Output)
Báo cáo kiểm thử có bằng chứng cụ thể (output, logs, HTTP status), khẳng định tính năng hoạt động ổn định.

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- 100% các kết luận về kết quả test đều phải dựa trên log thực tế thu được từ `run_command`.
