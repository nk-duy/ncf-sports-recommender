# Testing & Verification Rules

Quy tắc bắt buộc khi tiến hành kiểm thử và xác nhận chất lượng trước khi bàn giao.

## 1. Không bịa đặt kết quả kiểm thử (Evidence-based Only)
- **CẤM TUYỆT ĐỐI:** Tuyên bố "Đã kiểm tra và hoạt động tốt" khi chưa chạy lệnh hoặc script xác minh thực tế.
- Mọi kết luận về tính năng hoạt động phải đi kèm bằng chứng cụ thể:
  - Mã trạng thái HTTP (200 OK).
  - Trích xuất ngắn từ payload trả về.
  - Log thực tế từ command tool.

## 2. Quy trình kiểm thử chuẩn cho từng phần
1. **Kiểm thử API Endpoint:**
   - Sử dụng script Python với `urllib.request` hoặc `httpx` để gửi request thực tế lên `http://localhost:8000`.
   - Kiểm tra cả trường hợp thành công (happy path) và trường hợp lỗi đầu vào (bad request).
2. **Kiểm thử Thuật toán Gợi ý:**
   - Xác minh số lượng trả về khớp với `top_k`.
   - Xác minh không có URL ảnh nào trùng lặp (`len(set(imgs)) == len(imgs)`).
   - Xác minh không có sản phẩm nào có tên gốc trùng lặp.
3. **Kiểm thử Giao diện Frontend:**
   - Đảm bảo dev server Next.js (`npm run dev`) biên dịch không lỗi (Zero compile errors).
   - Kiểm tra console log không có lỗi đỏ (unhandled promise rejections hoặc invalid DOM nesting).

## 3. Phân biệt loại lỗi
- **Lỗi có sẵn (Pre-existing):** Các warning cũ của thư viện bên ngoài không ảnh hưởng luồng nghiệp vụ.
- **Lỗi mới (Regressions):** Bất kỳ lỗi nào phát sinh sau khi sửa code phải được ưu tiên khắc phục ngay lập tức trước khi chuyển sang việc khác.
