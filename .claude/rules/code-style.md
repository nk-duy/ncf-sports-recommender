# Code Style & Quality Standards

Quy chuẩn viết mã nguồn nhằm đảm bảo tính dễ đọc, dễ bảo trì và hạn chế tối đa lỗi logic.

## 1. Python & FastAPI Conventions
- **Kiểu dữ liệu (Type Hinting):** Sử dụng đầy đủ type hints (`Optional[str]`, `List[Product]`, `Dict[str, Any]`, Pydantic models).
- **Hàm bất đồng bộ (Async/Await):** Tất cả các thao tác I/O (gọi MongoDB Beanie, đọc file, HTTP requests) phải là `async def` và được `await`.
- **Xử lý ngoại lệ (Exception Handling):**
  - Không bao giờ dùng `except: pass` im lặng.
  - Luôn ghi log lỗi chi tiết: `print(f"[{module_name}] Error in {func_name}: {e}")` hoặc dùng module `logging`.
  - Trả về mã lỗi HTTP thích hợp (`HTTPException(status_code=404, detail="...")`).
- **Tương thích Windows Console:** Khi in chuỗi tiếng Việt trong script Python trên Windows, luôn thêm:
  ```python
  import sys
  if sys.stdout.encoding != 'utf-8':
      sys.stdout.reconfigure(encoding='utf-8')
  ```

## 2. TypeScript & React / Next.js Conventions
- **Clean Component Structure:**
  1. Imports (Thư viện ngoài $\rightarrow$ Components nội bộ $\rightarrow$ Hooks/Stores $\rightarrow$ Types/Utils $\rightarrow$ Styles).
  2. Interfaces & Types.
  3. Component Definition.
  4. State & Hooks.
  5. Handlers.
  6. Return JSX.
- **Props Interface:** Mọi component đều phải định nghĩa `interface ComponentProps` rõ ràng, tránh sử dụng kiểu `any`.
- **CSS Styling:** Ưu tiên class utility của Tailwind CSS v4. Tránh viết inline styles trừ trường hợp tính toán vị trí động (như tọa độ zoom chuột hoặc confetti).
- **Null Safety:** Luôn dùng optional chaining (`product?.price`, `sizes?.[0]`) và giá trị mặc định để tránh màn hình trắng khi API trả về thiếu trường.

## 3. Preservation of Code Integrity
- **Không xóa chú thích:** Giữ nguyên các comment giải thích thuật toán, chú thích nghiệp vụ và docstrings trong code hiện có.
- **Tập trung vào phạm vi (Scope Focus):** Chỉ sửa đúng khối code liên quan đến yêu cầu của người dùng. Không format lại cả file gây rối loạn git diff.
