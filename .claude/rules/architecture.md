# Architecture Rules & System Invariants

Các quy tắc kiến trúc mang tính bắt buộc (Invariants) cho toàn bộ AI Agents và lập trình viên:

## 1. Database Boundary: MongoDB Only
- **BẮT BUỘC:** Mọi thao tác lưu trữ dữ liệu phải đi qua MongoDB (`ncf_recommender_db`) sử dụng Beanie Document ODM trong thư mục `backend/app/models/`.
- **CẤM:** Không cài đặt, cấu hình hoặc đề xuất chuyển sang MySQL, PostgreSQL, Prisma, Drizzle ORM hay SQLite. Bỏ qua mọi nội dung liên quan đến Drizzle trong các tài liệu mẫu cũ.

## 2. Decoupled Monorepo Structure
- Không gọi trực tiếp code Python từ frontend và không import code Next.js vào backend.
- Giao tiếp giữa Client và Server **duy nhất** qua giao thức HTTP RESTful API tại tiền tố `/api/v1/`.
- Cổng kết nối chuẩn: Frontend chạy port `3000`, Backend chạy port `8000`, MongoDB chạy port `27017`.

## 3. Next.js 16 App Router Invariants
- `params` và `searchParams` là **Async Promises**:
  ```tsx
  // ĐÚNG (Next.js 16):
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    ...
  }
  
  // SAI (Next.js 14/15 cũ):
  export default function Page({ params }: { params: { id: string } }) {
    const id = params.id; // Gây cảnh báo hoặc lỗi runtime!
  }
  ```
- Mặc định là Server Component trừ khi component cần state (`useState`), effect (`useEffect`), hoặc browser DOM events (`onClick`). Khi đó, đặt `'use client'` ở dòng đầu tiên.

## 4. Recommendation Engine Deduplication Invariant
- Không một API endpoint gợi ý nào được phép trả về 2 sản phẩm có cùng hình ảnh hoặc cùng tên sản phẩm gốc.
- Mọi logic sinh danh sách gợi ý (`get_recommendations_for_user`, `get_cross_sell_recommendations`, `_get_fallback_cross_sell`, `_get_diverse_trending_recommendations`) **BẮT BUỘC** phải bọc đầu ra bằng:
  ```python
  return self._filter_duplicate_recs(candidates, top_k)
  ```

## 5. Dependency Management
- Không cài thêm dependencies nặng trừ khi có lý do kỹ thuật rõ ràng và được người dùng đồng ý.
- Giữ `requirements.txt` và `package.json` tinh gọn, đúng mục đích.
