# UI/UX & Design Guidelines

> **Frontend Tech Stack:** Next.js 16.3+ | Tailwind CSS v4 | Mantine UI v9 | Lucide Icons

---

## 1. Design Philosophy: Energetic & Premium Sports Store
Giao diện KADY Sports được thiết kế theo phong cách hiện đại, năng động, mang tinh thần thể thao chuyên nghiệp nhưng vẫn giữ được sự tinh gọn, chuẩn mực của một đồ án tốt nghiệp xuất sắc:
- **Clean Whitespace:** Bố cục thoáng đãng, các khối sản phẩm phân chia ranh giới rõ ràng với viền xám siêu nhẹ `border-gray-200/80` và bo góc mềm mại `rounded-2xl` hoặc `rounded-xl`.
- **Micro-Interactions:** Hiệu ứng hover mượt mà (`hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`).
- **Glassmorphism:** Sử dụng lớp nền mờ kính `backdrop-blur-md bg-white/90` cho Header cố định và các Badge trên ảnh sản phẩm.

---

## 2. Color Palette & Design Tokens

| Tên Token | Mã màu / Class | Ý nghĩa & Vị trí sử dụng |
|---|---|---|
| **Primary Blue** | `#2563EB` (`blue-600`) | Nút CTA chính, Tab đang chọn, Icon thương hiệu KADY |
| **Accent Red** | `#DC2626` (`red-600`) | Nhãn giảm giá (`-20%`), Nút Flash Sale, Trái tim Wishlist |
| **Success Green** | `#16A34A` (`green-600`) | Huy hiệu còn hàng, Đơn giao thành công, Thông báo lưu đơn |
| **Dark Neutral** | `#111827` (`gray-900`) | Tiêu đề H1, H2, Giá sản phẩm, Chữ nội dung chính |
| **Muted Neutral** | `#6B7280` (`gray-500`) | Đơn vị tính, SKU, breadcrumbs, đánh giá phụ |
| **Surface Gray** | `#F9FAFB` (`gray-50`) | Nền khung ảnh sản phẩm, thẻ voucher, bảng thông số kỹ thuật |

---

## 3. Image Display & Error Handling Standards

> [!CRITICAL]
> **TIÊU CHUẨN HIỂN THỊ HÌNH ẢNH SẢN PHẨM:**  
> Không bao giờ để giao diện bị vỡ hoặc hiển thị biểu tượng icon ảnh hỏng của trình duyệt.

1. **Khung ảnh chính (Product Detail & Card):**
   - Dùng tỷ lệ chuẩn `aspect-square`.
   - Lồng ảnh với `object-contain p-2 sm:p-3` trên nền `bg-gray-50` để sản phẩm lấp đầy khung hình mà không bị méo góc.
   - Thêm thuộc tính `onError` bắt buộc:
   ```tsx
   <img
     src={displayImage}
     alt={product.name}
     onError={(e) => {
       e.currentTarget.onerror = null;
       e.currentTarget.src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";
     }}
   />
   ```
2. **Thumbnails (Ảnh phụ):**
   - Dùng `object-cover rounded-lg` để tạo ô vuông xem trước rõ ràng, bo góc chuẩn mực.

---

## 4. Currency & Formatting Guidelines
- **Tiền tệ Việt Nam Đồng (VND):** Luôn định dạng có dấu chấm phân cách hàng nghìn và ký hiệu `đ` ở đuôi:
  ```ts
  export const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  // Hoặc ngắn gọn: price.toLocaleString('vi-VN') + 'đ'
  ```
- **Xử lý số lượng lớn:** Bảng dữ liệu hoặc thống kê dùng Badge của Mantine UI (`<Badge color="blue" variant="light">`).
