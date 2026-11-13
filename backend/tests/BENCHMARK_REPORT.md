# BÁO CÁO KIỂM THỬ HIỆU NĂNG & ĐỘ SẴN SÀNG TOÀN HỆ THỐNG (BENCHMARK REPORT)
> **Dự án:** KADY Sports Store & NCF Recommendation Engine  
> **Thời điểm kiểm thử:** `09/11/2026 21:57:25`  
> **Môi trường:** FastAPI + PyTorch NeuMF (GMF 16D + MLP `[32, 16, 8]`) + MongoDB Motor (Atomic Inventory Updates)

---

## 1. Kiểm thử Concurrency & Chống Bán Âm Kho (Atomic Stock Update)
| Chỉ tiêu kiểm tra | Kết quả thực tế | Mức độ đạt chuẩn |
|---|---|---|
| Số request đồng thời (`asyncio.gather`) | **5 requests** | Chuẩn Concurrency |
| Tồn kho ban đầu của biến thể | **2 sản phẩm** | Test Case giới hạn (`stock = 2`) |
| Số đơn hàng tạo thành công | **2 đơn** | Đúng 100% tồn kho |
| Số đơn hàng bị chặn do hết hàng | **3 đơn** | Báo lỗi HTTP 400 chuẩn |
| Tồn kho cuối cùng trong Database | **0 sản phẩm** | **Không bán âm (Zero Overselling)** |
| Trạng thái bài kiểm tra | **PASSED (ĐẠT CHUẨN)** | Đảm bảo tính nguyên tử (Atomic) |

---

## 2. Kiểm thử Độ Trễ Suy Luận Gợi Ý NCF (Inference & End-to-End API Latency)
| Phân loại User | Số lượng | Mean Latency | Median (P50) | 95th Percentile (P95) | Tỷ lệ thành công |
|---|:---:|:---:|:---:|:---:|:---:|
| **Known Users** (Có trong tập huấn luyện NCF) | 10 | **105.25 ms** | **103.39 ms** | **114.18 ms** | 100.0% |
| **Cold-Start Users** (User mới chưa có lịch sử) | 5 | **41.96 ms** | **40.74 ms** | **45.71 ms** | 100.0% |
| **Guest Visitors** (Khách vãng lai) | 5 | **45.78 ms** | **42.91 ms** | **53.98 ms** | 100.0% |
| **Tổng thể toàn bộ hệ thống** | **20 reqs** | **74.56 ms** | **76.70 ms** | **113.58 ms** | **100.0%** |

---

## 3. Độ Phủ Danh Mục & Đa Dạng Hóa Gợi Ý (Catalog Coverage & Diversity)
| Tiêu chí đo đạc | Số liệu thực tế | Ý nghĩa khoa học & ứng dụng |
|---|---|---|
| Quy mô kiểm thử | **10 users** | Mẫu khảo sát người dùng thực tế |
| Tổng số lượt gợi ý Top-10 | **100 vị trí** | $K=10$ sản phẩm cho mỗi người dùng |
| Số sản phẩm độc nhất xuất hiện | **65 sản phẩm** | Khử trùng lặp hoàn toàn qua `filter_duplicate_recommendations` |
| Quy mô toàn bộ kho sản phẩm | **633 sản phẩm** | 100% sản phẩm thuộc MegaMenu 8 bộ môn có tương tác |
| Độ phủ danh mục (Catalog Coverage %) | **10.27%** | Tỷ lệ kho hàng được thuật toán NCF phân phối trên 10 Users |
| Số bộ môn thể thao được phân phối | **6 bộ môn** | Bóng chuyền, Chạy bộ, Cầu lông, Dã ngoại, Phụ kiện chung, Đá bóng |
