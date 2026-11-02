# CHƯƠNG 3: CÀI ĐẶT GIẢI PHÁP

Chương 3 trình bày chi tiết quá trình hiện thực hóa các bản thiết kế kiến trúc, cơ sở dữ liệu và giải thuật đã đề xuất tại Chương 2 thành hệ thống thương mại điện tử tích hợp gợi ý thông minh KADY Sports hoàn chỉnh. Nội dung chương bao gồm: môi trường triển khai và cấu trúc tổ chức mã nguồn thực tế; quy trình tự động chuẩn hóa dữ liệu và đồng bộ hình ảnh không trùng lặp cho 552 sản phẩm; cách thức cài đặt mạng học sâu NeuMF, tiến trình huấn luyện ngầm và dịch vụ suy luận mô-đun hóa kèm cơ chế giải thích trực quan; cơ chế bảo mật phiên kép cùng các nghiệp vụ đặt hàng an toàn; và kết quả xây dựng giao diện thực tế trên cả hai phân hệ Khách hàng và Quản trị viên.

---

## 3.1. MÔI TRƯỜNG TRIỂN KHAI VÀ CÔNG NGHỆ SỬ DỤNG

### 3.1.1. Cấu hình phần cứng và danh mục công nghệ thực tế

Quá trình tiền xử lý dữ liệu, huấn luyện mạng nơ-ron học sâu NeuMF và vận hành đồng thời máy chủ dịch vụ cùng giao diện web được triển khai trên môi trường máy tính cá nhân với thông số kỹ thuật tổng hợp tại (Bảng 3.1).

**Bảng 3.1: Cấu hình phần cứng và hệ điều hành triển khai hệ thống**

| Thành phần | Thông số kỹ thuật | Vai trò trong quá trình triển khai |
| :--- | :--- | :--- |
| Vi xử lý trung tâm | Intel Core i5 / i7 hoặc AMD Ryzen 5 / 7, 8 nhân 16 luồng | Thực thi bất đồng bộ các luồng xử lý của máy chủ FastAPI và biên dịch ứng dụng giao diện Next.js |
| Bộ nhớ truy cập ngẫu nhiên | 16 GB DDR4 tốc độ 3200 MHz | Lưu trữ thường trực trọng số mạng NeuMF, ma trận vector nhúng 32 chiều trên bộ nhớ đệm và vận hành MongoDB |
| Bộ xử lý đồ họa | NVIDIA GeForce RTX hỗ trợ tính toán song song | Tăng tốc phép nhân ma trận tensor trong quá trình huấn luyện và kiểm định mô hình PyTorch |
| Ổ cứng lưu trữ | 512 GB NVMe M.2 SSD | Đảm bảo tốc độ đọc ghi cao khi truy vấn 11 bộ sưu tập dữ liệu và nạp tệp trọng số mô hình |
| Hệ điều hành | Windows 11 64-bit tích hợp Windows PowerShell | Môi trường hệ điều hành nền tảng phục vụ phát triển, huấn luyện và kiểm thử tích hợp |

Để đảm bảo tính nhất quán với kiến trúc phân tầng độc lập đã thiết kế, hệ thống sử dụng bộ công nghệ, khung phát triển và thư viện chuyên dụng được đối chiếu chính xác theo mã nguồn thực tế tại (Bảng 3.2).

**Bảng 3.2: Bảng tổng hợp công nghệ, khung phát triển và thư viện sử dụng trong dự án**

| Phân hệ | Công nghệ / Thư viện | Phiên bản | Vai trò cụ thể trong hệ thống KADY Sports |
| :--- | :--- | :--- | :--- |
| **Giao diện ứng dụng** | Next.js & React | Next.js 16.3.5, React 19.2 | Xây dựng hơn 30 trang giao diện theo cơ chế định tuyến phân mục App Router hiện đại, tối ưu tốc độ tải trang và khả năng mở rộng |
| | TypeScript | 5.x | Kiểm soát kiểu dữ liệu tĩnh chặt chẽ cho toàn bộ thành phần giao diện, kho trạng thái và dữ liệu phản hồi từ máy chủ |
| | Tailwind CSS & Mantine UI | Tailwind v4, Mantine v9 | Thiết kế hệ thống giao diện thích ứng đa thiết bị, thanh điều hướng MegaMenu 3 cấp, hộp thoại và bảng biểu quản trị |
| | Zustand | 5.x | Quản lý trạng thái toàn cục và cô lập lưu trữ cục bộ cho phiên Khách hàng, phiên Quản trị viên, giỏ hàng và Chế độ soi AI |
| | Recharts & Lucide React | Recharts v3 | Trực quan hóa biểu đồ doanh thu, biểu đồ hội tụ hàm mất mát qua 20 chu kỳ huấn luyện và hệ thống biểu tượng trực quan |
| **Máy chủ nghiệp vụ** | Python & FastAPI | Python 3.12+, FastAPI 0.112+ | Xây dựng hệ thống điểm cuối giao tiếp bất đồng bộ tốc độ cao, tự động kiểm tra lược đồ dữ liệu với Pydantic v2 |
| | Uvicorn | 0.30+ | Máy chủ giao thức bất đồng bộ hiệu năng cao vận hành dịch vụ tại địa chỉ `http://localhost:8000` |
| | Motor & Beanie ODM | Motor 3.5+, Beanie 1.26+ | Trình điều khiển bất đồng bộ và ánh xạ tài liệu hướng đối tượng giữa các lớp mô hình Python với MongoDB |
| | SlowAPI | 0.1.10 | Giới hạn tần suất yêu cầu theo địa chỉ mạng nhằm bảo vệ các điểm cuối nhạy cảm như đăng nhập và kích hoạt huấn luyện lại |
| | PyJWT & Bcrypt | Chuẩn HS256 | Băm mật khẩu một chiều có muối ngẫu nhiên bằng Bcrypt và cấp phát, xác thực mã thông báo phiên làm việc JWT |
| **Trí tuệ nhân tạo** | PyTorch | 2.x | Cài đặt kiến trúc mạng học sâu NeuMF kết hợp nhánh GMF và nhánh MLP, hàm mất mát Binary Cross-Entropy và bộ tối ưu Adam |
| | NumPy & Pandas | 1.26+ / 2.x | Tiền xử lý ma trận tương tác ngầm, mã hóa chỉ mục liên tục cho người dùng – sản phẩm và thực hiện lấy mẫu âm |
| | Scikit-learn | 1.5+ | Hỗ trợ chuẩn hóa dữ liệu, phân tách tập kiểm thử và tính toán các độ đo đánh giá xếp hạng |
| **Cơ sở dữ liệu** | MongoDB | 7.0+ | Quản trị cơ sở dữ liệu `ncf_recommender_db` tại cổng `27017` gồm 11 bộ sưu tập tài liệu được thiết lập chỉ mục tối ưu |

Tại tầng lưu trữ, tệp khởi tạo kết nối (`backend/app/core/database.py`) sử dụng Beanie ODM để đăng ký và đồng bộ tự động toàn bộ **11 bộ sưu tập** trong cơ sở dữ liệu `ncf_recommender_db`, bao gồm: `products` lưu sản phẩm và biến thể SKU nhúng, `users` lưu tài khoản và hồ sơ thể thao, `interactions` lưu lịch sử phản hồi ngầm, `orders` lưu đơn đặt hàng và chi tiết mặt hàng nhúng, `vouchers` lưu mã giảm giá, `reviews` lưu đánh giá sao và nhận xét, `banners` lưu biểu ngữ quảng bá, `mega_menus` lưu cây danh mục điều hướng 3 cấp, `product_attributes` lưu từ điển thuộc tính bộ môn – thương hiệu – màu sắc – kích cỡ, `recommendation_impressions` lưu nhật ký hiển thị và nhấp chuột đánh giá hiệu quả khối gợi ý, cùng `notifications` lưu thông báo hai chiều giữa quản trị viên và khách hàng.

### 3.1.2. Cấu trúc tổ chức thư mục mã nguồn

Mã nguồn của dự án được phân tách thành hai không gian làm việc độc lập gồm `backend/` và `frontend/` theo kiến trúc phân miền rõ ràng, thuận tiện cho việc bảo trì, kiểm thử và mở rộng từng mô-đun mà không gây ảnh hưởng dây chuyền.

**1. Tổ chức mã nguồn phía máy chủ dịch vụ và trí tuệ nhân tạo (`backend/app/`):**

```text
backend/
├── app/
│   ├── api/
│   │   ├── deps.py                     # Kiểm tra xác thực JWT và phân quyền người dùng / quản trị viên
│   │   └── v1/endpoints/               # 17 mô-đun điểm cuối RESTful API: products, recommendations,
│   │                                   # orders, auth, users, customers, notifications, vouchers, ...
│   ├── core/
│   │   ├── config.py                   # Quản lý biến môi trường và cấu hình hệ thống
│   │   ├── database.py                 # Khởi tạo kết nối bất đồng bộ Motor & Beanie ODM cho 11 bộ sưu tập
│   │   ├── limiter.py                  # Cấu hình giới hạn tần suất truy cập SlowAPI
│   │   ├── rec_utils.py                # Bộ lọc khử trùng lặp gợi ý 3 tầng dùng chung
│   │   ├── security.py                 # Xử lý băm mật khẩu Bcrypt và ký số mã JWT
│   │   └── vn_utils.py                 # Chuẩn hóa tiếng Việt không dấu và từ điển đồng nghĩa thể thao
│   ├── ml/
│   │   ├── ncf_model.py                # Định nghĩa lớp mạng học sâu PyTorch NCF: GMF 16D + MLP [32,16,8]
│   │   ├── trainer.py                  # Tiến trình huấn luyện ngầm bất đồng bộ và nạp nóng trọng số
│   │   ├── recommendation_analytics.py # Ghi nhận lượt hiển thị, lượt nhấp và tính chỉ số CTR trực tuyến
│   │   ├── training_metrics.json       # Lưu trữ siêu tham số, lịch sử 20 chu kỳ và bảng đối sánh thực nghiệm
│   │   └── saved_models/               # Lưu tệp trọng số ncf_weights.pth và từ điển ánh xạ mappings.json
│   ├── models/                         # 11 lớp mô hình tài liệu Beanie ODM ánh xạ vào MongoDB
│   ├── schemas/                        # Các lớp lược đồ kiểm tra dữ liệu đầu vào / đầu ra Pydantic v2
│   ├── services/                       # Tầng xử lý nghiệp vụ cốt lõi: recommendation_service.py,
│   │                                   # order_service.py, product_service.py, notification_service.py, ...
│   └── main.py                         # Điểm khởi chạy ứng dụng FastAPI, cấu hình CORS và tệp tĩnh
└── scripts/                            # Các kịch bản chuẩn hóa dữ liệu: seed_master.py, train_ncf.py,
                                        # sync_and_deduplicate_images.py, create_admin.py, seed_customers.py
```

**2. Tổ chức mã nguồn phía giao diện ứng dụng (`frontend/src/`):**

```text
frontend/src/
├── app/
│   ├── (public)/                       # Nhóm tuyến đường mua sắm công khai và khu vực tài khoản khách hàng:
│   │                                   # san-pham, gio-hang, thanh-toan, tra-cuu-don-hang, tai-khoan, ...
│   ├── admin/                          # Nhóm tuyến đường phân hệ Quản trị viên: tong-quan, san-pham,
│   │                                   # don-hang, khach-hang, danh-muc, khuyen-mai, thuoc-tinh, ...
│   ├── layout.tsx                      # Khung bố cục gốc cấu hình phông chữ và Mantine Provider
│   └── page.tsx                        # Trang chủ cửa hàng tích hợp khối gợi ý cá nhân hóa NCF
├── modules/
│   ├── public/                         # Các thành phần giao diện nghiệp vụ cửa hàng theo từng miền chức năng
│   ├── user/                           # Giao diện quản lý hồ sơ thể thao, lịch sử đơn hàng và thông báo cá nhân
│   └── admin/                          # Giao diện bảng điều khiển, hộp thoại đánh giá AI và quản trị dữ liệu
└── shared/
    ├── components/                     # Các thành phần dùng chung: ProductCard, MegaMenu, Header,
    │                                   # AiXRayToggle, AiXRayInspector, NotificationBellDropdown, ...
    ├── store/                          # Các kho trạng thái Zustand v5: authStore, adminAuthStore,
    │                                   # cartStore, useAiXRayStore, wishlistStore, compareStore
    ├── lib/                            # Tiện ích gọi API và xử lý định dạng tiền tệ, thời gian
    └── types/                          # Định nghĩa kiểu dữ liệu TypeScript: Product, AIExplanation, ...
```

---

## 3.2. CÀI ĐẶT QUY TRÌNH CHUẨN HÓA DỮ LIỆU VÀ ĐỒNG BỘ HÌNH ẢNH SẢN PHẨM

Dữ liệu thô trích xuất từ tập dữ liệu công khai Amazon Sports & Outdoors chứa nhiều sản phẩm có đơn giá ngoại tệ, thiếu phân loại kích cỡ – màu sắc bán lẻ tại thị trường Việt Nam, đặc biệt có một tỷ lệ đáng kể đường dẫn ảnh máy chủ gốc đã ngừng hoạt động hoặc trùng lặp hình ảnh giữa các mặt hàng khác nhau. Để giải quyết triệt để vấn đề này mà không làm xáo trộn không gian chỉ mục đã huấn luyện của mô hình học sâu, đề tài xây dựng hai kịch bản tự động hóa phối hợp chặt chẽ gồm (`backend/scripts/seed_master.py`) và (`backend/scripts/sync_and_deduplicate_images.py`).

### 3.2.1. Khởi tạo danh mục chuẩn và chuẩn hóa thuộc tính thương mại

Kịch bản (`backend/scripts/seed_master.py`) thực hiện thiết lập nền tảng dữ liệu vận hành đồng bộ cho toàn hệ thống qua bốn tác vụ tuần tự:
1. **Đồng bộ cấu trúc danh mục 3 cấp và bộ từ điển thuộc tính:** Khởi tạo cây điều hướng trong bộ sưu tập `mega_menus` và tập thuộc tính `product_attributes` bao phủ **8 nhóm bộ môn** gồm `Pickleball`, `Chạy bộ`, `Cầu lông`, `Đá bóng`, `Bóng chuyền`, `Gym & Fitness`, `Dã ngoại` và `Phụ kiện chung`, phân rã chi tiết thành **29 danh mục con** chuyên biệt như vợt thi đấu, bóng tiêu chuẩn, giày sân cỏ nhân tạo, giày chạy đường dài, trang phục thoáng khí, thảm tập, lều cắm trại, bình giữ nhiệt và băng bảo vệ khớp.
2. **Bản địa hóa đơn giá VNĐ và sinh biến thể tồn kho SKU:** Tự động quy đổi và chuẩn hóa phân khúc giá bán thực tế bằng đồng Việt Nam, thiết lập tỷ lệ khuyến mãi hợp lý, đồng thời khởi tạo mảng tài liệu nhúng `variants` cho từng sản phẩm bao gồm tên màu, mã màu hiển thị, dải kích cỡ phù hợp theo chủng loại từ cỡ giày `38–44`, cỡ trang phục `S–XL` đến quy cách dụng cụ, đi kèm mã định danh kho `sku` duy nhất và lượng tồn kho `stock`.
3. **Đồng bộ thống kê đánh giá thực tế:** Tính toán lại điểm trung bình `rating` và tổng số lượt nhận xét `reviews_count` trên bảng `products` khớp trực tiếp với các bản ghi đánh giá trong bộ sưu tập `reviews`, cung cấp đầu vào tin cậy cho thành phần điểm chất lượng trong công thức xếp hạng gợi ý.
4. **Thiết lập dữ liệu khuyến mãi và vận hành:** Khởi tạo bộ mã giảm giá kiểm thử gồm `WELCOME50`, `FREESHIP`, `SALE50`, `KADYVIP100` và biểu ngữ trang chủ phục vụ luồng mua sắm trọn vẹn.

### 3.2.2. Khôi phục ảnh gốc Amazon theo mã ASIN và phân bổ khử trùng lặp đường dẫn gốc

Trên nền danh mục 552 sản phẩm đã chuẩn hóa, kịch bản (`backend/scripts/sync_and_deduplicate_images.py`) đảm nhận nhiệm vụ kiểm toán chất lượng thị giác và loại bỏ hoàn toàn hiện tượng trùng lặp ảnh đại diện giữa các mặt hàng cùng nhóm hoặc làm hỏng liên kết với mô hình học sâu. Quy trình xử lý được thực thi theo thuật toán ba bước nghiêm ngặt:

- **Bước 1 – Khôi phục ảnh gốc độ phân giải cao theo mã ASIN:** Kịch bản nạp tệp kiểm chứng trạng thái kết nối `amazon_alive_status.json` và đối chiếu trực tiếp với trường `product_id` của từng bản ghi trong MongoDB. Toàn bộ **332 sản phẩm** có đường dẫn ảnh gốc từ tập dữ liệu Amazon Sports & Outdoors còn phản hồi hợp lệ với mã HTTP 200 và chưa bị trùng đường dẫn cơ sở đều được khôi phục nguyên bản ảnh gốc độ phân giải cao đúng với thiết kế thực tế của nhà sản xuất.
- **Bước 2 – Phân bổ xoay vòng kho ảnh thể thao kiểm chứng không trùng đường dẫn gốc:** Đối với các sản phẩm còn lại có liên kết ảnh cũ bị hỏng hoặc trùng lặp, kịch bản xây dựng kho dữ liệu `CURATED_CATEGORY_POOLS` gồm **140 ảnh thể thao chuyên dụng** đã được kiểm tra kết nối thực tế, phân loại chi tiết vào đúng 8 bộ môn và 29 danh mục con. Để ngăn chặn hiện tượng hai sản phẩm khác nhau sử dụng cùng một bức ảnh nhưng chỉ khác tham số kích thước phía sau dấu hỏi chấm, kịch bản trích xuất đường dẫn gốc `base_url = img.split("?")[0]` và kiểm tra đối chiếu trên tập hợp `used_base_in_cat` của từng danh mục con trước khi cấp phát. Song song đó, mỗi mặt hàng được gắn kèm mảng 4 ảnh góc nhìn phụ trong trường `images` nhằm phục vụ thư viện ảnh đa góc chụp tại trang chi tiết sản phẩm.
- **Bước 3 – Cập nhật tại chỗ bảo toàn không gian ánh xạ NCF:** Thay vì xóa bảng dữ liệu và tạo mới làm thay đổi mã định danh, kịch bản chỉ thực thi lệnh cập nhật trường hình ảnh trực tiếp trên tài liệu hiện hành thông qua khóa `_id`, qua đó bảo toàn nguyên vẹn **100% tập 552 mã định danh `product_id`** đã lưu trong tệp ánh xạ (`backend/app/ml/saved_models/mappings.json`) của mạng nơ-ron NeuMF.

Đoạn mã trích lược dưới đây minh họa cơ chế đối chiếu mã ASIN, kiểm soát không trùng lặp `base_url` theo từng danh mục con và cập nhật bảo toàn định danh trong tệp (`backend/scripts/sync_and_deduplicate_images.py`):

```python
# Trích lược từ tệp: backend/scripts/sync_and_deduplicate_images.py
used_base_in_cat = defaultdict(set)
used_amazon_base = set()
updates = []

# Pha 1: Khôi phục 332 ảnh gốc độ phân giải cao còn hoạt động theo mã ASIN
for p in all_products:
    pid = p.get("product_id", "")
    cat_key = resolve_subcat_key(p)
    amz_info = amazon_status.get(pid)
    if amz_info and amz_info.get("alive") and amz_info.get("url"):
        amz_url = amz_info["url"]
        base_u = amz_url.split("?")[0]
        if base_u not in used_amazon_base:
            used_amazon_base.add(base_u)
            used_base_in_cat[cat_key].add(base_u)
            gallery = build_gallery_urls(amz_url, CURATED_CATEGORY_POOLS.get(cat_key, []))
            updates.append((p["_id"], amz_url, gallery, "amazon_original"))
            continue
    needs_curated.append((p, cat_key))

# Pha 2: Phân bổ ảnh thể thao đã kiểm chứng không trùng đường dẫn gốc base_url
for p, cat_key in needs_curated:
    pool = CURATED_CATEGORY_POOLS.get(cat_key, DEFAULT_FALLBACK_POOL)
    chosen_base = None
    for candidate_id in pool:
        cand_url = unsplash_url(candidate_id)
        cand_base = cand_url.split("?")[0]
        if cand_base not in used_base_in_cat[cat_key]:
            chosen_base = cand_id = candidate_id
            used_base_in_cat[cat_key].add(cand_base)
            break
    final_main = unsplash_url(chosen_base or pool[0], w=900)
    gallery = build_gallery_urls(final_main, pool)
    updates.append((p["_id"], final_main, gallery, "curated_unique"))

# Pha 3: Cập nhật trực tiếp theo _id, bảo toàn nguyên vẹn 552 mã product_id trong mappings.json
for doc_id, main_img, gallery_imgs, _ in updates:
    await db.products.update_one(
        {"_id": doc_id},
        {"$set": {"image_url": main_img, "main_image": main_img, "images": gallery_imgs}}
    )
```

---

## 3.3. CÀI ĐẶT MÔ HÌNH HỌC SÂU NEUMF VÀ DỊCH VỤ GỢI Ý SẢN PHẨM

### 3.3.1. Cài đặt mạng học sâu NCF và tiến trình huấn luyện ngầm an toàn khóa trạng thái

Kiến trúc Lọc cộng tác thần kinh kết hợp giữa Phân rã ma trận tổng quát và Mạng nơ-ron đa tầng được cài đặt trực tiếp bằng thư viện PyTorch thông qua lớp `NCF` tại tệp (`backend/app/ml/ncf_model.py`). Khi khởi tạo phục vụ huấn luyện và suy luận thực tế trong hệ thống KADY Sports với tham số `embedding_dim = 16` và `hidden_layers = [32, 16, 8]`, mô hình thiết lập bốn ma trận nhúng độc lập:
- Hai ma trận `embedding_user_mf` và `embedding_item_mf` có số chiều ẩn bằng `16`, thực hiện phép nhân từng phần tử `torch.mul` để nắm bắt tương tác tuyến tính bậc thấp giữa người dùng và sản phẩm trong nhánh GMF.
- Hai ma trận `embedding_user_mlp` và `embedding_item_mlp` có số chiều ẩn bằng `16`, hợp thành tổng không gian biểu diễn tiềm ẩn **32 chiều** cho mỗi thực thể khi kết hợp hai nhánh. Tại nhánh MLP, hai vector 16 chiều của người dùng và sản phẩm được nối tiếp bằng `torch.cat` thành vector đầu vào 32 chiều, sau đó đi qua 3 tầng ẩn kết nối đầy đủ có kích thước giảm dần `[32, 16, 8]` sử dụng hàm kích hoạt phi tuyến `ReLU` để trích xuất các mối tương quan hành vi bậc cao.
- Tại tầng dự đoán hợp nhất, vector biểu diễn 32 chiều của người dùng – sản phẩm sau khi chắt lọc qua nhánh GMF 16 chiều và nhánh MLP thu gọn 8 chiều được nối tại `predict_layer` và đi qua hàm kích hoạt `Sigmoid` để chuẩn hóa điểm dự đoán xác suất tương tác $\hat{y}_{ui}$ về khoảng `[0, 1]`.

```python
# Tệp mã nguồn: backend/app/ml/ncf_model.py
import torch
import torch.nn as nn

class NCF(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=16, hidden_layers=[32, 16, 8]):
        super(NCF, self).__init__()
        self.num_users = int(num_users)
        self.num_items = int(num_items)

        self.embedding_user_mf = nn.Embedding(num_embeddings=num_users, embedding_dim=embedding_dim)
        self.embedding_item_mf = nn.Embedding(num_embeddings=num_items, embedding_dim=embedding_dim)
        self.embedding_user_mlp = nn.Embedding(num_embeddings=num_users, embedding_dim=embedding_dim)
        self.embedding_item_mlp = nn.Embedding(num_embeddings=num_items, embedding_dim=embedding_dim)

        mlp_modules = []
        input_size = embedding_dim * 2
        for layer_size in hidden_layers:
            mlp_modules.append(nn.Linear(input_size, layer_size))
            mlp_modules.append(nn.ReLU())
            input_size = layer_size
        self.mlp_layers = nn.Sequential(*mlp_modules)

        predict_size = embedding_dim + hidden_layers[-1]
        self.predict_layer = nn.Linear(predict_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, user_indices, item_indices):
        mf_vector = torch.mul(
            self.embedding_user_mf(user_indices),
            self.embedding_item_mf(item_indices)
        )
        mlp_vector = torch.cat([
            self.embedding_user_mlp(user_indices),
            self.embedding_item_mlp(item_indices)
        ], dim=-1)
        mlp_vector = self.mlp_layers(mlp_vector)

        predict_vector = torch.cat([mf_vector, mlp_vector], dim=-1)
        return self.sigmoid(self.predict_layer(predict_vector)).squeeze()
```

Để quản trị viên có thể kích hoạt huấn luyện lại mô hình ngay trên giao diện web khi phát sinh thêm dữ liệu mua sắm mới mà không làm gián đoạn luồng truy cập của khách hàng, lớp `NCFTrainer` tại tệp (`backend/app/ml/trainer.py`) triển khai tiến trình huấn luyện ngầm bất đồng bộ qua `asyncio.create_task`. Hệ thống trích xuất toàn bộ bản ghi từ bộ sưu tập `interactions`, thực hiện lấy mẫu âm tỷ lệ `1:4` với 4 sản phẩm chưa tương tác gán nhãn `0.0` cho mỗi tương tác dương, tối ưu hóa hàm mất mát `nn.BCELoss()` bằng thuật toán `Adam` ($\eta = 0,001$) qua `20` chu kỳ.

Điểm kỹ thuật quan trọng trong (`backend/app/ml/trainer.py`) là cơ chế bảo toàn khóa trạng thái `is_training` bằng cấu trúc `try-except-finally`. Nếu xảy ra bất kỳ ngoại lệ nào trong lúc truy vấn dữ liệu, cấp phát bộ nhớ hay ghi tệp, khối `finally` luôn đảm bảo đặt lại `self.training_status["is_training"] = False`, ngăn chặn triệt để lỗi treo khóa tiến trình khiến hệ thống từ chối các yêu cầu huấn luyện lại tiếp theo. Ngay khi hoàn tất chu kỳ thứ 20, tiến trình xuất tệp `ncf_weights.pth`, `mappings.json`, `training_metrics.json` và gọi hàm `self.on_model_updated()` để nạp nóng bộ trọng số mới vào bộ nhớ RAM.

```python
# Trích lược cơ chế huấn luyện ngầm bảo toàn khóa trạng thái tại: backend/app/ml/trainer.py
async def _run_training_job(self):
    try:
        # 1. Trích xuất tương tác, ánh xạ chỉ mục, lấy mẫu âm tỷ lệ 1:4 và huấn luyện 20 chu kỳ
        # ...
        torch.save(new_model.state_dict(), self.model_path)
        with open(self.mappings_path, "w", encoding="utf-8") as f:
            json.dump(mappings_data, f, ensure_ascii=False, indent=2)
        with open(self.metrics_json_path, "w", encoding="utf-8") as f:
            json.dump(training_metrics, f, ensure_ascii=False, indent=2)

        # 2. Kích hoạt nạp nóng mô hình và ma trận vector nhúng 32 chiều mới vào bộ nhớ RAM
        if self.on_model_updated:
            self.on_model_updated()

        self.training_status["progress"] = 100
        self.training_status["message"] = f"Hoàn tất huấn luyện NCF! HR@8: {hr_8}%, NDCG@8: {ndcg_8}"
    except Exception as e:
        logger.error(f"[NCF Training Error] {e}")
        self.training_status["error"] = str(e)
        self.training_status["message"] = f"Huấn luyện thất bại: {e}"
    finally:
        # Chốt chặn bắt buộc: luôn giải phóng khóa huấn luyện trong mọi kịch bản lỗi
        self.training_status["is_training"] = False
```

### 3.3.2. Cài đặt dịch vụ suy luận mô-đun hóa và bộ lọc khử trùng lặp ba tầng

Nhằm đảm bảo tốc độ phản hồi dưới ngưỡng một phần nghìn giây cho tầng tính toán mạng nơ-ron và giữ mã nguồn mạch lạc, dịch vụ gợi ý trung tâm tại tệp (`backend/app/services/recommendation_service.py`) được phân rã thành **4 hàm xử lý cốt lõi** phối hợp cùng bộ lọc khử trùng lặp dùng chung tại (`backend/app/core/rec_utils.py`):

1. **Hàm phân giải ngữ cảnh thể thao `_resolve_user_sport_context`:** Tự động xác định bộ môn mục tiêu `target_sport`, chủng loại `target_type` và mảng danh mục con `target_categories` từ mã sản phẩm khách hàng đang xem; đồng thời kiểm tra tính hợp lệ của định danh người dùng qua `ObjectId.is_valid` để trích xuất danh sách bộ môn yêu thích `interested_sports` đã lưu trong hồ sơ thể thao cá nhân.
2. **Hàm suy luận trên bộ nhớ `_predict_in_memory_ncf` kèm chốt chặn biên chỉ mục:** Thực hiện dự đoán xác suất tương tác đồng loạt cho toàn bộ sản phẩm ứng viên trong chế độ `torch.no_grad()`. Trước khi đưa chỉ số vào tầng nhúng PyTorch, hàm kiểm tra nghiêm ngặt điều kiện biên `0 <= u_idx < num_users` và `0 <= idx < num_items`. Chốt chặn này giúp hệ thống không bao giờ gặp lỗi tràn chỉ mục tensor khi có tài khoản mới đăng ký hoặc sản phẩm mới vừa thêm vào kho hàng trước kỳ huấn luyện tiếp theo.
3. **Hàm tính tương đồng không gian nhúng `_compute_item_embedding_similarities`:** Ghép nối ma trận trọng số `embedding_item_mf.weight.data` kích thước 16 chiều và `embedding_item_mlp.weight.data` kích thước 16 chiều theo chiều cuối cùng để thu được ma trận biểu diễn sản phẩm **32 chiều**. Khi đo độ tương đồng góc `cosine_similarity` giữa sản phẩm hiện tại với toàn bộ kho hàng, hàm cộng thêm hằng số làm mượt `1e-8` vào cả hai toán hạng `curr_embed + 1e-8` và `all_item_embeds + 1e-8` nhằm triệt tiêu hoàn toàn nguy cơ chia cho không đối với các vector có chuẩn cực nhỏ. Cơ chế tương tự cũng được áp dụng tại hàm gợi ý bán kèm giỏ hàng `get_cross_sell_recommendations` bằng cách lấy trung bình cộng vector 32 chiều của các mặt hàng trong giỏ và ưu tiên cộng thưởng `+0,25` cho nhóm phụ kiện cùng bộ môn.
4. **Hàm chấm điểm hợp nhất `_score_candidate_products`:** Kết hợp tuyến tính ba nguồn tín hiệu gồm điểm dự đoán mạng học sâu `ncf_score`, điểm thưởng ngữ cảnh `context_boost` gồm `+0,45` khi trùng bộ môn thể thao đang xem, `+0,15` khi trùng nhóm sản phẩm, `+0,15` khi giao danh mục con, và điểm chất lượng đánh giá `rating_score` tính theo `rating * 0,05`. Tổng điểm `final_score` sau đó được quy đổi sang tỷ lệ tương thích trực quan `match_percent` nằm trong dải `82%–99%` và sinh chuỗi giải thích tiếng Việt tương ứng với nguyên nhân đóng góp lớn nhất.

```python
# Trích lược các hàm suy luận cốt lõi tại: backend/app/services/recommendation_service.py
def _predict_in_memory_ncf(self, u_idx: int, exclude_ids: List[str]) -> Dict[str, float]:
    if not self.model or not self.mappings:
        return {}
    max_user_id = getattr(self.model, "num_users", 0)
    max_item_id = getattr(self.model, "num_items", 0)

    # Chốt chặn biên chỉ mục người dùng và sản phẩm chống tràn tensor
    if u_idx < 0 or u_idx >= max_user_id:
        return {}
    item_to_index = self.mappings.get("item_to_index", {})
    index_to_item = self.mappings.get("index_to_item", {})
    valid_pairs = [
        (idx, pid) for pid, idx in item_to_index.items()
        if 0 <= idx < max_item_id and pid not in exclude_ids
    ]
    if not valid_pairs:
        return {}

    valid_indices = [idx for idx, _ in valid_pairs]
    u_tensor = torch.tensor([u_idx] * len(valid_indices), dtype=torch.long)
    i_tensor = torch.tensor(valid_indices, dtype=torch.long)
    with torch.no_grad():
        predictions = self.model(u_tensor, i_tensor).squeeze().tolist()
        if isinstance(predictions, float):
            predictions = [predictions]
    return {
        index_to_item[str(idx)]: float(score)
        for (idx, _), score in zip(valid_pairs, predictions)
        if str(idx) in index_to_item
    }

def _compute_item_embedding_similarities(self, current_product_id: Optional[str], exclude_list: List[str]) -> Dict[str, float]:
    # Hợp nhất vector nhúng GMF 16D + MLP 16D thành 32D và tính Cosine kèm hằng số làm mượt 1e-8
    with torch.no_grad():
        all_item_embeds = torch.cat([
            self.model.embedding_item_mf.weight.data,
            self.model.embedding_item_mlp.weight.data
        ], dim=-1)
        curr_embed = all_item_embeds[torch.tensor([curr_idx], dtype=torch.long)]
        sims = cosine_similarity(curr_embed + 1e-8, all_item_embeds + 1e-8).squeeze().tolist()
```

Trước khi trả danh sách kết quả cuối cùng về giao diện ở mọi nhánh suy luận từ gợi ý cá nhân hóa NeuMF, gợi ý ngữ cảnh khởi đầu lạnh đến gợi ý phụ kiện bán kèm giỏ hàng, danh sách ứng viên bắt buộc đi qua bộ lọc khử trùng lặp 3 tầng `filter_duplicate_recommendations` tại tệp (`backend/app/core/rec_utils.py`):
- **Tầng 1 – Khử trùng mã định danh:** Loại bỏ các bản ghi trùng `product_id` qua tập hợp `seen_ids`.
- **Tầng 2 – Khử trùng tên dòng sản phẩm gốc:** Sử dụng biểu thức chính quy cắt bỏ các hậu tố biến thể như `- Mẫu 1`, `- V2`, thông tin màu sắc hoặc kích cỡ, chuyển về chữ thường và đối chiếu 35 ký tự đầu qua tập hợp `seen_base_names`.
- **Tầng 3 – Khử trùng đường dẫn hình ảnh:** Kiểm tra trường `image_url` qua tập hợp `seen_images`, đảm bảo trên một khung gợi ý không bao giờ xuất hiện hai thẻ sản phẩm có cùng ảnh đại diện.

### 3.3.3. Cài đặt cơ chế Giải thích AI và giao diện Chế độ soi AI

Để khắc phục tính chất hộp đen thường gặp của các mạng nơ-ron học sâu và giúp người dùng hiểu rõ lý do một thiết bị thể thao được đề xuất, hệ thống mở rộng lược đồ phản hồi sản phẩm tại (`backend/app/schemas/product.py`) bằng đối tượng `AIExplanation`. Đối tượng này đóng gói đầy đủ chiến lược suy luận `strategy` gồm `hybrid_ncf`, `cosine_cross_sell` và `cold_start`, điểm mạng học sâu `ncf_score`, điểm cộng ngữ cảnh `context_boost`, độ tương đồng `cosine_score`, điểm uy tín đánh giá `rating_score`, tổng điểm xếp hạng `final_score`, tỷ lệ tương thích `match_percent` và câu giải thích ngắn gọn `reason`.

Ở phía giao diện Next.js, đề tài xây dựng hai thành phần tương tác trực quan đặt tại thư mục (`frontend/src/shared/components/`):
- **Nút kích hoạt (`AiXRayToggle.tsx`):** Đặt cố định trên thanh công cụ đầu trang cửa hàng, kết nối với kho trạng thái `useAiXRayStore` để cho phép bật hoặc tắt tức thời chế độ kiểm tra giải thích gợi ý trên toàn bộ trang web mà không cần tải lại trang.
- **Lớp phủ phân tích (`AiXRayInspector.tsx`):** Tích hợp trực tiếp bên trong mỗi thẻ sản phẩm (`ProductCard.tsx`). Khi người dùng bật Chế độ soi AI, góc trên thẻ sản phẩm hiển thị huy hiệu phần trăm tương thích nổi bật như `AI 95%`, đồng thời chân thẻ sản phẩm mở rộng bảng thông số hiển thị nhãn thuật toán đang kích hoạt, câu lý do gợi ý cụ thể và ba ô số liệu phân rã chi tiết từng thành phần điểm số gồm `Điểm NCF` hoặc `Cosine`, `Ngữ cảnh` và `Đánh giá`.

---

## 3.4. CÀI ĐẶT CƠ CHẾ BẢO MẬT PHIÊN KÉP VÀ CÁC NGHIỆP VỤ THƯƠNG MẠI ĐIỆN TỬ

### 3.4.1. Tách biệt độc lập phiên đăng nhập Khách hàng – Quản trị viên và cô lập giỏ hàng

Trong thực tế vận hành và kiểm thử trên cùng một trình duyệt web, nếu phân hệ mua sắm của khách hàng và phân hệ quản trị dùng chung một khóa lưu trữ mã xác thực, việc đăng xuất ở trang cửa hàng sẽ vô tình xóa mất quyền truy cập của quản trị viên hoặc ngược lại. Hệ thống KADY Sports giải quyết triệt để bài toán này bằng kiến trúc cô lập phiên kép hoàn toàn độc lập:

- **Kho trạng thái phiên Khách hàng (`frontend/src/shared/store/authStore.ts`):** Lưu trữ mã xác thực JWT dưới khóa riêng `kady_customer_token` và thông tin tài khoản tại khóa `kady_customer_user` trong `localStorage`. Ngay khi khách hàng đăng nhập bằng mật khẩu hoặc qua Google OAuth, hàm `setAuth` kích hoạt đồng bộ kho giỏ hàng (`frontend/src/shared/store/cartStore.ts`) chuyển sang vùng lưu trữ định danh riêng biệt theo mẫu khóa `` `kady_cart_${userId}` ``, trong khi người dùng chưa đăng nhập sử dụng vùng nhớ tạm `kady_cart_guest`. Khi khách hàng bấm đăng xuất, hàm `logout` chỉ thu hồi hai khóa `kady_customer_token`, `kady_customer_user` và đưa giỏ hàng về trạng thái rỗng của khách vãng lai, tuyệt đối không chạm tới dữ liệu giỏ hàng đã lưu của các tài khoản khác cũng như không ảnh hưởng tới phiên quản trị viên.
- **Kho trạng thái phiên Quản trị viên (`frontend/src/shared/store/adminAuthStore.ts`):** Lưu trữ mã xác thực riêng tại khóa `kady_admin_token` và hồ sơ quản trị tại `kady_admin_user`. Toàn bộ nhánh đường dẫn `/admin/*` được bảo vệ hai lớp: lớp giao diện tại (`frontend/src/app/admin/layout.tsx`) kiểm tra sự tồn tại của `kady_admin_token` cùng điều kiện bắt buộc `user.role === 'admin'` trước khi kết xuất nội dung; lớp máy chủ tại (`backend/app/api/deps.py`) giải mã chữ ký số JWT bằng khóa bí mật và đối chiếu vai trò thực tế trong cơ sở dữ liệu MongoDB.

### 3.4.2. Dịch vụ đặt hàng mô-đun hóa, hoàn kho tự động, thông báo hai chiều và xuất báo cáo

Các nghiệp vụ thương mại điện tử trọng yếu được cài đặt chặt chẽ tại tầng dịch vụ nhằm bảo đảm tính toàn vẹn dữ liệu kho hàng, khuyến mãi và thông tin giao dịch:

1. **Quy trình tạo đơn hàng 4 bước và hoàn kho an toàn tại (`backend/app/services/order_service.py`):**
   - `_validate_and_deduct_inventory`: Kiểm tra sự tồn tại của từng mặt hàng trong giỏ, đối chiếu số lượng đặt mua với tồn kho tổng `product.stock` và tồn kho chi tiết của đúng phân loại màu sắc – kích cỡ trong mảng `product.variants`. Nếu vượt quá số lượng khả dụng, hệ thống lập tức từ chối giao dịch và trả thông báo rõ tên sản phẩm thiếu hàng; nếu hợp lệ, hệ thống khấu trừ đồng thời tồn kho biến thể và tồn kho tổng với ngưỡng chặn dưới không âm.
   - `_validate_and_apply_voucher`: Xác thực mã giảm giá đang hoạt động, kiểm tra điều kiện chưa vượt hạn mức `usage_limit` và cộng tăng chỉ số `used_count`.
   - `_build_order_document`: Đóng gói danh sách mặt hàng vào mảng tài liệu nhúng `OrderItem` nhằm cố định đơn giá tại thời điểm mua, tính phí vận chuyển và tổng tiền thanh toán cuối cùng.
   - `_post_order_creation_actions`: Tự động xóa bộ đệm thống kê quản trị qua hàm `invalidate_dashboard_cache` để bảng điều khiển cập nhật doanh thu tức thời, đồng thời phát thông báo xác nhận đơn hàng cho người mua.
   - **Cơ chế hoàn kho khi hủy đơn `_restore_order_inventory_and_voucher`:** Khi khách hàng hủy đơn đang chờ xác nhận hoặc quản trị viên chuyển trạng thái đơn sang `cancelled`, hệ thống tự động cộng trả đúng số lượng từng biến thể SKU về kho `products`, giảm trừ lượt sử dụng `used_count` của mã giảm giá đã áp dụng và phát thông báo cập nhật trạng thái.
2. **Chốt chặn kiểm tra định danh đơn hàng `ObjectId.is_valid`:** Tại hàm `get_order_by_id` trong (`backend/app/services/order_service.py`), trước khi khởi tạo đối tượng `PydanticObjectId` để truy vấn khóa chính MongoDB, hệ thống luôn kiểm tra `ObjectId.is_valid`. Nếu chuỗi đầu vào là mã vận đơn rút gọn hiển thị cho khách hàng dạng `#ORD-671F8A`, hệ thống tự động chuyển sang nhánh đối chiếu hậu tố mã đơn thay vì ép kiểu trực tiếp gây lỗi ngoại lệ máy chủ.
3. **Hệ thống thông báo hai chiều tại (`backend/app/services/notification_service.py`):** Bên cạnh luồng thông báo tự động khi đặt hàng thành công qua `notify_order_placed` và khi thay đổi tiến độ vận đơn qua `notify_order_status_change`, dịch vụ cung cấp hàm `send_notification` và `send_bulk_notifications` cho phép quản trị viên gửi thông báo chăm sóc cá nhân hoặc gửi chiến dịch hàng loạt đính kèm mã giảm giá `voucher_code` trực tiếp tới chuông thông báo của từng nhóm khách hàng.
4. **Xuất báo cáo quản trị Excel động tại (`frontend/src/modules/admin/tong-quan/components/DashboardManager.tsx`):** Chức năng `handleExportReport` tổng hợp dữ liệu trực tiếp theo bộ lọc thời gian đang chọn và kết xuất tệp bảng tính Excel `.xls` chuẩn mã hóa tiếng Việt UTF-8 gồm 6 bảng chuyên sâu: 5 chỉ số kinh doanh cốt lõi, 9 chỉ số đánh giá thực nghiệm mô hình NCF, thống kê tiến trình đơn hàng và phương thức thanh toán, biến động doanh thu 7 tháng gần nhất, tỷ trọng danh mục bộ môn và bảng xếp hạng sản phẩm chủ lực.

---

## 3.5. KẾT QUẢ XÂY DỰNG GIAO DIỆN ỨNG DỤNG

Hệ thống giao diện KADY Sports được hoàn thiện đồng bộ giữa phân hệ mua sắm dành cho Khách hàng và phân hệ điều hành dành cho Quản trị viên, phản ánh đầy đủ các mô-đun giải thuật và nghiệp vụ đã cài đặt.

### 3.5.1. Giao diện phân hệ Khách hàng mua sắm trực tuyến

Khi truy cập vào cửa hàng trực tuyến, Trang chủ hiển thị biểu ngữ chiến dịch thể thao nổi bật, thanh công cụ tích hợp nút bật tắt **Chế độ soi AI** và khối **"Gợi ý dành riêng cho bạn"** được cá nhân hóa trực tiếp từ dịch vụ suy luận NeuMF. Khi kích hoạt Chế độ soi AI, từng thẻ sản phẩm hiển thị rõ huy hiệu phần trăm tương thích ở góc trên cùng bảng phân rã 3 thành phần điểm số gồm `Điểm NCF`, `Ngữ cảnh` và `Đánh giá` ngay bên dưới tên sản phẩm như minh họa tại (Hình 3.1).

(Hình 3.1: Giao diện Trang chủ KADY Sports và khối gợi ý cá nhân hóa NCF khi bật Chế độ soi AI — [Hướng dẫn chụp: Mở URL http://localhost:3000/ đăng nhập tài khoản khách hàng, bật nút "Chế độ soi AI" trên thanh Header và chụp khu vực khối sản phẩm Gợi ý dành riêng cho bạn hiển thị phần trăm tương thích cùng bảng phân rã điểm số])

Đối với người dùng mới, hệ thống hỗ trợ đăng ký tài khoản truyền thống hoặc đăng nhập nhanh qua tài khoản Google OAuth, đi kèm biểu mẫu thiết lập **Hồ sơ thể thao cá nhân** cho phép lựa chọn các bộ môn yêu thích như Pickleball, Cầu lông, Chạy bộ, Đá bóng cùng cỡ giày và màu sắc ưa thích tại (Hình 3.2). Dữ liệu này được lưu trực tiếp vào trường `interested_sports` nhằm giải quyết tức thời bài toán khởi đầu lạnh ngay từ phiên truy cập đầu tiên.

(Hình 3.2: Giao diện đăng nhập Google OAuth và thiết lập Hồ sơ thể thao cá nhân — [Hướng dẫn chụp: Mở URL http://localhost:3000/dang-nhap hoặc http://localhost:3000/tai-khoan/settings và chụp phần tùy chọn các bộ môn thể thao yêu thích, cỡ giày cá nhân trong Hồ sơ thể thao])

Trên thanh điều hướng chính, thành phần MegaMenu 3 cấp được nạp động từ cơ sở dữ liệu, tổ chức khoa học toàn bộ 8 bộ môn và 29 danh mục con theo ba tầng phân cấp trực quan: Bộ môn thể thao → Nhóm trang thiết bị → Danh mục chi tiết tại (Hình 3.3), giúp khách hàng định vị nhanh chủng loại dụng cụ chuyên biệt chỉ sau một thao tác rê chuột.

(Hình 3.3: Thanh điều hướng MegaMenu 3 cấp phủ kín 8 bộ môn và 29 danh mục con — [Hướng dẫn chụp: Mở URL http://localhost:3000/ rê chuột vào mục danh mục sản phẩm trên thanh điều hướng để mở rộng bảng MegaMenu 3 cấp và chụp toàn bộ khung danh mục phân tầng])

Tại trang Danh mục sản phẩm ở (Hình 3.4), khách hàng có thể kết hợp thanh tìm kiếm tiếng Việt dung sai dấu và từ đồng nghĩa thể thao như gõ không dấu `giay da banh` hoặc `vot cau long` cùng cột bộ lọc đa tiêu chí theo bộ môn, khoảng giá VNĐ, thương hiệu, kích cỡ và mức đánh giá sao.

(Hình 3.4: Giao diện trang Danh mục sản phẩm tích hợp tìm kiếm tiếng Việt không dấu và bộ lọc đa tiêu chí — [Hướng dẫn chụp: Mở URL http://localhost:3000/san-pham chọn lọc một bộ môn thể thao kèm khoảng giá ở cột trái và chụp danh sách thẻ sản phẩm kết quả])

Khi nhấp vào một mặt hàng bất kỳ để chuyển tới Trang chi tiết sản phẩm tại (Hình 3.5), hệ thống tự động ghi nhận ngầm hành vi xem trang về máy chủ, đồng thời hiển thị thư viện ảnh đa góc nhìn gồm 1 ảnh chính độ phân giải cao và 4 ảnh góc chụp phụ, bảng thông số kỹ thuật, các nút chọn biến thể màu sắc – kích cỡ kèm số lượng tồn kho SKU thời gian thực. Phía cuối trang là khối **"Sản phẩm tương tự cùng bộ môn"** kết hợp điểm dự đoán NeuMF, độ tương đồng vector nhúng 32 chiều và bộ lọc khử trùng lặp 3 tầng, đảm bảo toàn bộ sản phẩm gợi ý đều thuộc đúng bộ môn đang xem và không trùng lặp hình ảnh.

(Hình 3.5: Giao diện Trang chi tiết sản phẩm với thư viện ảnh đa góc nhìn, tùy chọn biến thể SKU và khối gợi ý tương tự — [Hướng dẫn chụp: Mở URL http://localhost:3000/san-pham và nhấp vào một sản phẩm cụ thể, chụp phần thông tin biến thể màu/kích cỡ và cuộn chụp khối Sản phẩm tương tự ở bên dưới])

Tại trang Giỏ hàng ở (Hình 3.6), bên cạnh danh sách mặt hàng đã chọn theo từng phân loại biến thể và ô nhập mã khuyến mãi Voucher, hệ thống tích hợp khối **"Gợi ý mua kèm thông minh"** sử dụng độ tương đồng góc Cosine trên vector trung bình giỏ hàng 32 chiều để đề xuất chính xác các phụ kiện bổ trợ cùng môn thể thao như vớ chống trượt khi mua giày bóng đá hoặc bóng thi đấu và quấn cán khi mua vợt Pickleball.

(Hình 3.6: Giao diện Giỏ hàng tích hợp khối gợi ý phụ kiện mua kèm dựa trên độ tương đồng Cosine 32 chiều và áp dụng mã giảm giá — [Hướng dẫn chụp: Mở URL http://localhost:3000/gio-hang khi trong giỏ đang có ít nhất một sản phẩm thể thao, bật Chế độ soi AI và chụp danh sách giỏ hàng cùng khối gợi ý mua kèm])

Ở bước Thanh toán và Hậu mãi tại (Hình 3.7), khách hàng điền địa chỉ nhận hàng, lựa chọn phương thức thanh toán tiền mặt khi nhận hàng hoặc quét mã chuyển khoản ngân hàng tự động điền sẵn số tiền và nội dung đơn hàng. Sau khi đặt mua thành công, cả khách hàng thành viên lẫn khách vãng lai đều có thể kiểm tra trực tuyến tiến trình xử lý vận đơn thông qua trang Tra cứu đơn hàng.

(Hình 3.7: Giao diện Thanh toán đơn hàng tích hợp mã QR chuyển khoản và trang Tra cứu tiến độ vận đơn — [Hướng dẫn chụp: Mở URL http://localhost:3000/thanh-toan hoặc http://localhost:3000/tra-cuu-don-hang và chụp biểu mẫu xác nhận thanh toán / tiến trình trạng thái đơn hàng])

Đặc biệt, trên thanh đầu trang của khách hàng đã đăng nhập tích hợp biểu tượng **Chuông thông báo thời gian thực** minh họa ở (Hình 3.8), hiển thị số lượng thông báo chưa đọc, cập nhật tức thời tiến độ giao hàng và cho phép khách hàng nhận trực tiếp các mã giảm giá cá nhân hóa do Quản trị viên gửi tặng.

(Hình 3.8: Giao diện Chuông thông báo nhận mã giảm giá từ Quản trị viên và cập nhật trạng thái đơn hàng — [Hướng dẫn chụp: Mở URL http://localhost:3000/ bấm vào biểu tượng Chuông thông báo trên góc phải Header hoặc mở http://localhost:3000/tai-khoan/notifications để chụp danh sách thông báo kèm mã Voucher])

### 3.5.2. Giao diện phân hệ Quản trị viên và Giám sát trí tuệ nhân tạo

Phân hệ Quản trị viên hoạt động độc lập tại đường dẫn `/admin` với cơ chế bảo mật phiên riêng biệt. Trang Tổng quan tại (Hình 3.9) cung cấp cái nhìn toàn cảnh về hoạt động kinh doanh thông qua các thẻ chỉ số doanh thu, tổng đơn hàng, khách hàng mới, cảnh báo sản phẩm sắp hết tồn kho, biểu đồ doanh thu theo thời gian, nút **Xuất báo cáo** ra tệp Excel `.xls` và bảng điều khiển **Giám sát & Huấn luyện lại mô hình NCF** hiển thị thanh tiến độ phần trăm theo từng chu kỳ huấn luyện ngầm.

(Hình 3.9: Bảng điều khiển Quản trị viên thống kê doanh thu, xuất báo cáo Excel và giám sát huấn luyện mô hình NCF — [Hướng dẫn chụp: Mở URL http://localhost:3000/admin đăng nhập quyền quản trị viên và chụp toàn cảnh trang Tổng quan gồm các thẻ KPI, khu vực điều khiển AI NCF và biểu đồ doanh thu])

Khi quản trị viên nhấp vào nút **"Báo cáo Thực nghiệm"** trên thẻ giám sát trí tuệ nhân tạo, hệ thống mở hộp thoại chuyên sâu **Thực nghiệm & Đánh giá Mô hình NCF** tại (Hình 3.10). Giao diện này trực quan hóa toàn bộ cấu hình siêu tham số không gian nhúng 32 chiều, biểu đồ đường hội tụ hàm mất mát `BCE Loss` giảm đều qua 20 chu kỳ, biểu đồ cột tăng trưởng độ đo `HR@8` – `NDCG@8` và bảng đối sánh thực nghiệm giữa 4 phương pháp gợi ý được đồng bộ tự động 100% từ tệp `training_metrics.json`.

(Hình 3.10: Hộp thoại Thực nghiệm & Đánh giá Mô hình NCF hiển thị siêu tham số, biểu đồ hội tụ và bảng đối sánh 4 phương pháp — [Hướng dẫn chụp: Mở URL http://localhost:3000/admin bấm mở hộp thoại Thực nghiệm & Đánh giá Mô hình NCF và chụp các phần cấu hình siêu tham số, biểu đồ huấn luyện cùng bảng đối sánh kết quả])

Tại khu vực Quản lý kho hàng và danh mục ở (Hình 3.11), trang Quản lý sản phẩm cho phép tìm kiếm, lọc nhanh theo bộ môn, ẩn hiện sản phẩm, chỉnh sửa thư viện hình ảnh đa góc nhìn và quản trị chi tiết ma trận biến thể màu sắc – kích cỡ – mã SKU – lượng tồn kho cùng chương trình giảm giá khuyến mãi.

(Hình 3.11: Giao diện Quản lý sản phẩm và cập nhật ma trận biến thể tồn kho SKU — [Hướng dẫn chụp: Mở URL http://localhost:3000/admin/san-pham chụp danh sách sản phẩm quản trị hoặc mở hộp thoại chỉnh sửa chi tiết biến thể SKU của một sản phẩm])

Cuối cùng, các mô-đun Quản lý đơn hàng và Quản lý khách hàng tại (Hình 3.12) hỗ trợ quản trị viên duyệt chuyển trạng thái vận đơn kèm cơ chế tự động hoàn kho khi hủy đơn, phân hạng chi tiêu thành viên từ `Đồng`, `Bạc`, `Vàng` đến `Kim Cương`, theo dõi hồ sơ sở thích thể thao của từng người mua và mở hộp thoại gửi thông báo trực tiếp hoặc phát tặng mã giảm giá riêng cho từng khách hàng hay toàn bộ tệp thành viên.

(Hình 3.12: Giao diện Quản lý đơn hàng và Quản lý khách hàng tích hợp gửi thông báo, tặng mã giảm giá — [Hướng dẫn chụp: Mở URL http://localhost:3000/admin/khach-hang hoặc http://localhost:3000/admin/don-hang và chụp danh sách khách hàng kèm hộp thoại Gửi thông báo / Tặng mã Voucher])
