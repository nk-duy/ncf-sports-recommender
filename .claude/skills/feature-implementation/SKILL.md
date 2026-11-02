---
name: feature-implementation
description: Implements approved feature plans with strict adherence to Next.js 16 App Router, FastAPI Beanie, and PyTorch NCF architectures without scope creep.
---

# Skill: Feature Implementation

## 1. Điều kiện kích hoạt (Activation Triggers)
- Sau khi kế hoạch tính năng đã được phê duyệt qua skill `feature-planning`.
- Khi người dùng yêu cầu trực tiếp sửa đổi hoặc viết code cho một tính năng cụ thể.

## 2. Tài liệu cần tham khảo trước (References)
- Bản kế hoạch cụ thể tại `.claude/plans/`
- [Code Style Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/code-style.md)
- [Architecture Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/architecture.md)
- [Security Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/security.md)

## 3. Quy trình thực hiện từng bước (Step-by-step)

1. **Chuẩn bị và cô lập phạm vi:**
   - Đọc kỹ bản kế hoạch, chỉ thao tác trên đúng các tệp đã được liệt kê.
   - Không tự ý format lại toàn bộ file hoặc sửa đổi logic của các tính năng không liên quan.

2. **Triển khai tầng Backend (nếu có):**
   - **Pydantic Schema:** Định nghĩa schema request/response với type hinting rõ ràng trong `backend/app/schemas/`.
   - **Beanie Document Model:** Bổ sung field hoặc index cần thiết trong `backend/app/models/`.
   - **Service Layer:** Viết hàm nghiệp vụ trong `backend/app/services/`. Luôn áp dụng error handling (`try/except`) và log lỗi rõ ràng.
   - **API Router:** Tạo endpoint trong `backend/app/api/v1/endpoints/` và đăng ký vào `api/v1/router.py`.

3. **Triển khai tầng Frontend (nếu có):**
   - **Zustand Store / Service:** Khai báo state, actions và hàm gọi API trong `frontend/src/shared/store/` hoặc module tương ứng.
   - **Component Layer:** Sử dụng Tailwind CSS v4 và Mantine UI v9 nhất quán với phong cách hiện có.
   - **Image Handling:** Tất cả thẻ `<img>` phải có thuộc tính `onError` trỏ về link ảnh fallback thể thao hợp lệ.
   - **Next.js 16 Rules:** Luôn `await` props `params` hoặc `searchParams` trong các Server Component/Page.

4. **Bảo toàn quy tắc gợi ý NCF (nếu liên quan đến sản phẩm):**
   - Tất cả kết quả gợi ý trả về phải được xử lý qua hàm `_filter_duplicate_recs` để loại bỏ sản phẩm trùng ảnh và trùng tên gốc.

5. **Giữ gìn tính toàn vẹn của mã nguồn:**
   - Giữ nguyên toàn bộ chú thích (comments), docstrings hiện hữu.

## 4. Công cụ được phép sử dụng (Allowed Tools)
- `replace_file_content`: Áp dụng các chỉnh sửa cục bộ, chính xác.
- `multi_replace_file_content`: Sửa đổi nhiều khối không liền kề trong một file.
- `write_to_file`: Tạo file mới.
- `run_command`: Chạy thử cú pháp nhanh nếu cần.

## 5. Kết quả mong đợi (Expected Output)
Mã nguồn hoàn chỉnh, sạch sẽ, không có lỗi cú pháp hoặc cảnh báo linter, tuân thủ đúng kiến trúc modular và sẵn sàng cho việc kiểm thử.

## 6. Tiêu chí kiểm tra kết quả (Verification Criteria)
- Không có lỗi type checking hoặc cú pháp.
- Không có logic bị trùng lặp giữa các module.
- Chuyển tiếp ngay sang skill `testing` để xác minh tính đúng đắn trước khi bàn giao cho người dùng.
