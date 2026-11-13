# RESTful API Contracts Reference

> **Base URL:** `http://localhost:8000/api/v1`  
> **Format:** `application/json` (UTF-8)

---

## 1. Authentication (`/auth`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | Public | Đăng ký tài khoản khách hàng mới | `{ email, password, full_name, phone? }` | `{ access_token, token_type, user }` |
| `POST` | `/auth/login` | Public | Đăng nhập hệ thống | `OAuth2PasswordRequestForm` (`username`, `password`) | `{ access_token, token_type, user }` |
| `GET` | `/auth/me` | Bearer Token | Lấy thông tin tài khoản hiện tại | Header: `Authorization: Bearer <token>` | `UserResponse` |

---

## 2. Products Catalog (`/products`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `GET` | `/products/` | Public | Lọc & phân trang sản phẩm | `page, limit, sport_type, product_type, brand, gender, sort_by, min_price, max_price` *(Hỗ trợ chọn nhiều môn qua dấu phẩy: `sport_type=Đá bóng,Cầu lông`)* | `{ items: Product[], total, page, total_pages }` |
| `GET` | `/products/{id}` | Public | Chi tiết sản phẩm theo UUID hoặc ID | URL param: `id` | `ProductDetailResponse` |
| `POST` | `/products/` | Admin | Tạo mới sản phẩm thể thao | `ProductCreateSchema` | `Product` |
| `PUT` | `/products/{id}` | Admin | Cập nhật thông tin sản phẩm | URL param `id`, `ProductUpdateSchema` | `Product` |
| `DELETE`| `/products/{id}` | Admin | Xóa mềm hoặc ẩn sản phẩm | URL param `id` | `{ success: true, message }` |

---

## 3. Recommendation System (`/recommendations`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `GET` | `/recommendations/` | Public / User | Gợi ý sản phẩm cá nhân hóa, dung hợp Thị giác 48D & Khám phá liên bộ môn | `top_k=8/12, current_product_id?, sport_type?, w_ncf=1.0, w_visual=0.35, w_context=1.0, discovery_mode=false`. *(Nếu có Authorization Bearer, dùng NCF user vector & User Visual Profile 48D)* | `Product[]` *(Đã lọc độc bản)* |
| `GET` | `/recommendations/latent-radar` | Public / User | Biểu đồ Radar sở thích tiềm ẩn 8 bộ môn thể thao (NCF 32D & Thị giác 48D) | `user_id?, w_ncf=1.0, w_visual=0.35` | `LatentRadarAxis[]` *(8 bộ môn, thang 0-100)* |
| `POST` | `/recommendations/cross-sell` | Public | Gợi ý bán kèm theo giỏ hàng (Basket Cross-sell) | `top_k=8`, Body: `string[]` (mảng các `product_id` trong giỏ) | `Product[]` *(Phụ kiện liên quan)* |
| `GET` | `/recommendations/model-info`| Admin | Lấy thông tin siêu dữ liệu & metrics mô hình NCF | Không | `{ has_model, num_users, num_items, metrics, last_trained }` |
| `GET` | `/recommendations/training-status` | Admin | Theo dõi tiến độ huấn luyện thời gian thực | Không | `{ is_training, progress, current_epoch, current_loss, message }` |
| `POST` | `/recommendations/retrain` | Admin | Kích hoạt huấn luyện NCF ngầm (Non-blocking) | Không | `{ status: "started", message, training_status }` |
| `POST` | `/recommendations/log-impression` | Public / User | Ghi nhận lượt hiển thị gợi ý (Impression Tracking) | `{ recommended_product_ids, source, user_id? }` | `{ impression_id, status: "success" }` |
| `POST` | `/recommendations/track-click` | Public / User | Ghi nhận lượt nhấp vào gợi ý để đo CTR thực | `{ impression_id, product_id, user_id? }` | `{ status: "success", message }` |
| `GET` | `/recommendations/metrics` | Admin | Thống kê Online CTR & Offline HR@10 / NDCG@10 | Không | `{ total_impressions, total_clicks, ctr, hit_rate_at_10, ndcg_at_10, sources }` |

---

## 4. Orders & Checkout (`/orders`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `POST` | `/orders/` | Public / User | Đặt hàng mới | `OrderCreateSchema` (`items`, `customer_info`, `shipping_method`, `payment_method`, `voucher_code?`) | `OrderResponse` (`order_id`, `tracking_code`, `total_amount`) |
| `GET` | `/orders/{id}` | Bearer Token | Xem chi tiết đơn hàng | URL param `id` | `OrderDetail` |
| `GET` | `/orders/track/{tracking_code}`| Public | Tra cứu công khai tiến độ giao hàng | URL param `tracking_code` | `OrderTrackingInfo` (`status`, `timeline`, `items`) |
| `GET` | `/orders/my-orders` | Bearer Token | Lấy danh sách đơn của người dùng | Header: `Authorization: Bearer <token>` | `Order[]` |
| `PATCH`| `/orders/{id}/status` | Admin | Cập nhật trạng thái đơn (Chờ xác nhận $\rightarrow$ Đang giao $\rightarrow$ Hoàn thành) | `{ status: "shipping" / "completed" / "cancelled" }` | `Order` |

---

## 5. User Interactions (`/interactions`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `POST` | `/interactions/` | Public / User | Ghi nhận tương tác (click, view, add-to-cart, purchase) để nạp dữ liệu train NCF | `{ user_id, product_id, interaction_type, rating? }` | `{ success: true }` |

---

## 6. Admin Portal Management (`/admin`)

| Method | Endpoint | Quyền | Mô tả | Request Body / Params | Response |
|---|---|---|---|---|---|
| `GET` | `/admin/dashboard-stats` | Admin | Thống kê doanh thu, số đơn hàng, khách hàng mới | `time_range=7d / 30d` | `{ revenue, orders_count, inventory_alerts, top_selling }` |
| `GET` | `/admin/recent-orders` | Admin | Danh sách đơn hàng mới nhất cần xử lý | `limit=10` | `OrderSummary[]` |

---

## 7. Supporting Endpoints

- **Vouchers (`/vouchers`):** Tra cứu voucher khả dụng, kiểm tra tính hợp lệ và chiết khấu.
- **Reviews (`/reviews`):** Đánh giá sản phẩm (rating 1-5 sao, bình luận, avatar khách hàng).
- **Uploads (`/uploads`):** Tải ảnh sản phẩm hoặc banner lên server tĩnh `uploads/`.
- **Banners (`/banners`):** Quản lý slider trang chủ và banner khuyến mãi thể thao.
- **Customers (`/customers`):** Quản lý hồ sơ khách hàng, phân hạng thành viên và tổng chi tiêu.
- **Attributes (`/attributes`):** Quản lý danh mục thuộc tính kích cỡ, màu sắc theo môn thể thao.
