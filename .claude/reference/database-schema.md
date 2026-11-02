# MongoDB Database Schema Reference

> **Database Engine:** MongoDB 7.0+  
> **Database Name:** `ncf_recommender_db`  
> **ODM Library:** Beanie (Asynchronous Pydantic-based ODM for Motor)

---

## 1. Collection: `products` (`app.models.product.Product`)

Tập hợp chính lưu trữ kho hàng thể thao và metadata danh mục:

```python
class Product(Document):
    product_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True)
    name: str                           # Tên sản phẩm thể thao (VD: Giày Cầu Lông Yonex Eclipsion Z3)
    slug: Optional[str] = None          # Đường dẫn thân thiện SEO
    price: float                        # Giá bán thực tế (VND)
    original_price: Optional[float]     # Giá gốc trước khuyến mãi
    discount_percent: Optional[int] = 0 # Tỷ lệ giảm giá (%)
    image_url: str                      # Ảnh đại diện chính (URL hợp lệ đã verify)
    images: List[str] = []              # Danh sách ảnh phụ cho thumbnail & lightbox
    sport_type: str                     # Môn: Đá bóng, Cầu lông, Bóng chuyền, Pickleball, Chạy bộ, Dã ngoại, Đa dụng
    product_type: str                   # Loại: Giày, Trang phục, Dụng cụ, Thiết bị, Phụ kiện
    category: List[str] = []            # Cây danh mục phân cấp
    sub_category: Optional[str] = None  # Danh mục chi tiết (VD: Bọc Ống Đồng & Vớ)
    brand: Optional[str] = "KADY"       # Thương hiệu: Nike, Adidas, Yonex, Mizuno, Decathlon...
    rating: float = 5.0                 # Điểm đánh giá trung bình (1.0 - 5.0)
    reviews_count: int = 0              # Số lượt đánh giá
    sizes: List[str] = []               # Kích cỡ khả dụng: 38, 39, 40, L, XL, Freesize...
    colors: List[str] = []              # Màu sắc: Đen, Trắng, Đỏ, Xanh Navy...
    stock: int = 100                    # Số lượng tồn kho
    gender: Optional[str] = "Unisex"    # Nam, Nữ, Unisex, Trẻ em
    description: Optional[str] = ""     # Mô tả chi tiết chất liệu, công nghệ thể thao
    is_hidden: bool = False             # Ẩn khỏi catalog storefront
    is_deleted: bool = False            # Đánh dấu xóa mềm
    created_at: datetime
    updated_at: datetime
```

---

## 2. Collection: `users` (`app.models.user.User`)

Lưu trữ thông tin tài khoản khách hàng và quản trị viên:

```python
class User(Document):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True)
    email: EmailStr = Field(unique=True)
    hashed_password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "customer"              # "customer" hoặc "admin"
    is_active: bool = True
    avatar_url: Optional[str] = None
    membership_tier: str = "Bronze"     # Bronze, Silver, Gold, Platinum
    total_spent: float = 0.0            # Tổng tiền đã mua sắm thành công
    created_at: datetime
```

---

## 3. Collection: `orders` (`app.models.order.Order`)

Quản lý thông tin đơn hàng và tiến trình giao vận:

```python
class Order(Document):
    order_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True)
    tracking_code: str                  # Mã vận đơn tra cứu (VD: KD891234VN)
    user_id: Optional[str] = None       # ID người dùng (nếu đã đăng nhập)
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    shipping_address: str
    items: List[OrderItem]              # [product_id, name, price, quantity, size, color, image_url]
    subtotal: float                     # Tiền hàng
    shipping_fee: float                 # Phí vận chuyển
    discount_amount: float = 0.0        # Số tiền giảm giá từ voucher
    total_amount: float                 # Tổng thanh toán cuối cùng
    payment_method: str                 # "cod", "vnpay", "qr_transfer"
    payment_status: str = "pending"     # "pending", "paid", "refunded"
    order_status: str = "pending"       # "pending", "confirmed", "shipping", "delivered", "cancelled"
    timeline: List[OrderTimelineEvent]  # Lịch sử các mốc thời gian cập nhật trạng thái
    notes: Optional[str] = None
    created_at: datetime
```

---

## 4. Collection: `interactions` (`app.models.interaction.Interaction`)

Thu thập hành vi người dùng làm tập dữ liệu huấn luyện cho mạng NCF:

```python
class Interaction(Document):
    user_id: str                        # Mã khách hàng
    product_id: str                     # Mã sản phẩm tương tác
    interaction_type: str               # "view", "like", "add_to_cart", "purchase", "rating"
    rating: Optional[float] = 1.0       # Trọng số phản hồi ngầm định hoặc điểm đánh giá
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

---

## 5. Other Collections

- **`vouchers` (`Voucher`):** `code`, `discount_type` (percent/fixed), `discount_val`, `min_order_value`, `max_discount`, `usage_limit`, `used_count`, `valid_until`.
- **`reviews` (`Review`):** `product_id`, `user_id`, `user_name`, `rating` (1-5), `comment`, `avatar_url`, `created_at`.
- **`banners` (`Banner`):** `title`, `image_url`, `link_url`, `position` ("hero", "promo_split"), `is_active`, `sort_order`.
- **`attributes` (`Attribute`):** Nhóm thuộc tính cấu hình danh mục thể thao (`sport_type`, `sizes`, `colors`, `brands`).
