# Security & Data Protection Rules

Quy tắc bảo vệ dữ liệu, kiểm soát truy cập và bảo mật hệ thống.

## 1. Bảo vệ Thông tin Bí mật (Secrets Protection)
- **CẤM:** Không commit mật khẩu, khóa bí mật JWT (`SECRET_KEY`), chuỗi kết nối MongoDB chứa credentials lên git hoặc đưa vào code công khai.
- **Biến môi trường:** Tất cả cấu hình nhạy cảm phải đọc từ file `.env` thông qua `pydantic-settings` trong `backend/app/core/config.py`.

## 2. Kiểm soát Quyền hạn (Role-Based Access Control)
- Phân biệt rành mạch giữa 2 vai trò: `customer` và `admin`.
- Các endpoints thay đổi trạng thái nhạy cảm (Tạo/Sửa/Xóa sản phẩm, Đổi trạng thái đơn hàng, Retrain mô hình NCF, Xem danh sách khách hàng) **BẮT BUỘC** phải có dependency kiểm tra quyền Admin:
  ```python
  current_user: User = Depends(get_current_active_admin)
  ```
- Khách hàng chỉ được xem đơn hàng thuộc sở hữu của chính họ (`user_id == current_user.user_id`).

## 3. An toàn Cơ sở dữ liệu (Data Integrity)
- **CẤM:** Không tự ý chạy các hàm phá hủy dữ liệu như:
  - `client.drop_database()`
  - `Product.delete_all()`
  - `db.orders.delete_many({})`
- Khi thực hiện xóa sản phẩm, ưu tiên áp dụng xóa mềm (Soft Delete) bằng cách đặt cờ `is_deleted = True` hoặc `is_hidden = True`.

## 4. Rate Limiting & Chống Spam
- Endpoints nhạy cảm (Đăng nhập, Đăng ký, Đặt đơn hàng) phải được bảo vệ bởi middleware SlowAPI để chống brute-force và spam đơn ảo.
