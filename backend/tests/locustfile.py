"""
KADY Sports - Locust Load Testing & Performance Benchmark Script
===============================================================
Kịch bản kiểm thử tải trọng (Load Testing) và đo lường độ trễ (Latency/P95/RPS)
cho hệ thống KADY Sports Store & NCF Recommendation Engine.

Mô phỏng hành vi người dùng thực tế với các nhóm tác vụ:
- Task trọng số 5 (Weight 5): Khách duyệt Trang chủ & Lấy danh sách Gợi ý NCF cá nhân hóa.
- Task trọng số 3 (Weight 3): Khách lọc sản phẩm theo Môn thể thao, xem Chi tiết sản phẩm & Gợi ý bán chéo (Cross-Sell).
- Task trọng số 1 (Weight 1): Khách săn Voucher & xem danh mục Khuyến mãi.

Cách chạy trên Windows PowerShell:
---------------------------------
1. Kích hoạt môi trường ảo:
   .\\backend\\venv\\Scripts\\Activate.ps1

2. Cài đặt locust (nếu chưa có):
   pip install locust

3. Chạy giao diện Web UI (Mặc định http://localhost:8089):
   locust -f backend/tests/locustfile.py --host http://localhost:8000

4. Hoặc chạy chế độ dòng lệnh (Headless Mode - ví dụ 50 users, spawn rate 5, chạy trong 1 phút):
   locust -f backend/tests/locustfile.py --host http://localhost:8000 --headless -u 50 -r 5 --run-time 1m --html load_test_report.html
"""

import random
from locust import HttpUser, task, between, tag

# Danh mục bộ môn thể thao thực tế của KADY Sports
SPORTS_LIST = [
    "Chạy bộ",
    "Bóng đá",
    "Cầu lông",
    "Bóng rổ",
    "Gym / Fitness",
    "Quần vợt",
    "Bơi lội",
]

# Danh sách ID mẫu dự phòng khi chưa tải được danh mục
FALLBACK_PRODUCT_IDS = [
    "SHOE-CARB-902",
    "RACKET-PRO-01",
    "BALL-FIFA-03",
    "JERSEY-RUN-11",
    "MAT-YOGA-05",
]


class KadySportsCustomerUser(HttpUser):
    """
    Người dùng mô phỏng hành vi khách hàng mua sắm trên KADY Sports
    """
    wait_time = between(1.0, 3.0)  # Giả lập thời gian suy nghĩ của người dùng từ 1 đến 3 giây
    product_ids: list = []

    def on_start(self):
        """Khởi tạo phiên người dùng: Lấy trước một số ID sản phẩm thực tế để dùng cho việc xem chi tiết"""
        self.product_ids = list(FALLBACK_PRODUCT_IDS)
        try:
            resp = self.client.get(
                "/api/v1/products?limit=20",
                name="/api/v1/products [init]",
                timeout=5.0
            )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) > 0:
                    fetched_ids = [
                        p.get("product_id") or p.get("id")
                        for p in data
                        if (p.get("product_id") or p.get("id"))
                    ]
                    if fetched_ids:
                        self.product_ids = fetched_ids
        except Exception:
            # Dùng fallback khi khởi động nếu API chưa sẵn sàng
            pass

    @tag("home", "recommendations")
    @task(5)
    def browse_homepage_and_recommendations(self):
        """
        [Trọng số 5] Hành vi truy cập Trang chủ:
        1. Gọi lấy gợi ý cá nhân hóa NCF (top_k=8).
        2. Lấy danh sách sản phẩm nổi bật (featured banner).
        """
        # 1. Gọi API gợi ý NCF (Cold-start guest / Popular fallback / NCF model)
        with self.client.get(
            "/api/v1/recommendations/?top_k=8",
            name="/api/v1/recommendations/ [Top-8]",
            catch_response=True,
            timeout=10.0
        ) as response:
            if response.status_code == 200:
                try:
                    recs = response.json()
                    if isinstance(recs, list) and len(recs) > 0:
                        # Cập nhật thêm pool product_id từ chính gợi ý
                        for r in recs:
                            pid = r.get("product_id") or r.get("id")
                            if pid and pid not in self.product_ids:
                                self.product_ids.append(pid)
                        response.success()
                    else:
                        response.success()
                except Exception as exc:
                    response.failure(f"Invalid JSON response: {exc}")
            else:
                response.failure(f"HTTP {response.status_code}: {response.text[:100]}")

        # 2. Lấy banner sản phẩm nổi bật
        self.client.get(
            "/api/v1/products/featured?limit=5",
            name="/api/v1/products/featured",
            timeout=5.0
        )

    @tag("catalog", "product_detail", "cross_sell")
    @task(3)
    def browse_sport_and_view_product(self):
        """
        [Trọng số 3] Hành vi tìm kiếm & xem chi tiết:
        1. Lọc sản phẩm theo môn thể thao ngẫu nhiên.
        2. Xem chi tiết 1 sản phẩm cụ thể.
        3. Lấy danh sách gợi ý bán chéo (Cross-Sell) dựa trên sản phẩm đó.
        """
        sport = random.choice(SPORTS_LIST)

        # 1. Lọc theo bộ môn thể thao
        self.client.get(
            f"/api/v1/products?sport_type={sport}&limit=12",
            name="/api/v1/products?sport_type=[sport]",
            timeout=5.0
        )

        # Chọn một product_id để xem chi tiết
        pid = random.choice(self.product_ids) if self.product_ids else "SHOE-CARB-902"

        # 2. Xem chi tiết sản phẩm
        with self.client.get(
            f"/api/v1/products/{pid}",
            name="/api/v1/products/[product_id]",
            catch_response=True,
            timeout=5.0
        ) as response:
            if response.status_code in (200, 404):
                # 404 nếu sản phẩm test không tồn tại vẫn được xử lý an toàn
                response.success()
            else:
                response.failure(f"Product detail failed with status {response.status_code}")

        # 3. Lấy gợi ý bán chéo (Cross-sell items embeddings)
        payload = [pid]
        self.client.post(
            "/api/v1/recommendations/cross-sell?top_k=3",
            json=payload,
            name="/api/v1/recommendations/cross-sell [Top-3]",
            timeout=5.0
        )

    @tag("promotions", "vouchers")
    @task(1)
    def browse_vouchers_and_promotions(self):
        """
        [Trọng số 1] Hành vi săn khuyến mãi:
        1. Xem danh sách Voucher hiện có của cửa hàng.
        2. Lấy danh sách sản phẩm đang có chương trình giảm giá.
        """
        # 1. Danh sách Voucher
        self.client.get(
            "/api/v1/vouchers",
            name="/api/v1/vouchers",
            timeout=5.0
        )

        # 2. Danh mục sản phẩm khuyến mãi
        self.client.get(
            "/api/v1/products?is_promotion=true&limit=10",
            name="/api/v1/products?is_promotion=true",
            timeout=5.0
        )

