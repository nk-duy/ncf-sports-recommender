# BẢNG THỐNG KÊ THÔNG SỐ HỆ THỐNG KADY SPORTS & MÔ HÌNH NCF
> **Tài liệu cung cấp số liệu thực nghiệm chuẩn xác phục vụ Viết Báo cáo Luận văn Tốt nghiệp**  
> **Thời điểm trích xuất:** `09/11/2026 21:57:22`  
> **Nguồn trích xuất:** Cơ sở dữ liệu MongoDB `ncf_recommender_db`, File cấu hình `mappings.json`, `training_metrics.json` và PyTorch NCF Model `ncf_weights.pth`.

---

## MỤC LỤC BẢNG SỐ LIỆU LUẬN VĂN
1. [Bảng 3.1: Thống kê Tổng quan Cơ sở dữ liệu MongoDB (Chương 3)](#1-thống-kê-cơ-sở-dữ-liệu-chương-3)
2. [Bảng 3.2: Phân bố Lịch sử Tương tác Khách hàng - Interaction Logs (Chương 3)](#2-phân-bố-lịch-sử-tương-tác-interaction-logging)
3. [Bảng 4.1: Thống kê Tập dữ liệu Huấn luyện & Độ thưa Ma trận NCF (Chương 4)](#3-thống-kê-tập-dữ-liệu-huấn-luyện-ncf-bảng-41)
4. [Bảng 4.2: Siêu tham số & Kiến trúc Mạng NCF Đề xuất (Chương 4)](#4-siêu-tham-số--kiến-trúc-ncf-bảng-42)
5. [Bảng 4.3: Đối sánh Hiệu năng Thực nghiệm giữa các Mô hình (Bảng 4.3)](#5-đối-sánh-hiệu-năng-thực-nghiệm-bảng-43)
6. [Bảng 4.4: Tiến trình Hội tụ Huấn luyện qua 20 Epochs (Bảng 4.4)](#6-tiến-trình-hội-tụ-huấn-luyện-qua-20-epochs-bảng-44)
7. [Bảng 4.5: Đo lường Hiệu năng Suy luận Thực tế trên RAM (Latency Benchmark)](#7-hiệu-năng-suy-luận-thời-gian-thực-inference-latency)

---

## 1. THỐNG KÊ CƠ SỞ DỮ LIỆU (CHƯƠNG 3)
*Số liệu phục vụ mô tả Kiến trúc Hệ cơ sở dữ liệu MongoDB (`ncf_recommender_db`).*

### Bảng 3.1: Thống kê Thực thể CSDL KADY Sports
| STT | Tên Thực thể / Collection | Số lượng Bản ghi | Mô tả chi tiết trong hệ thống |
|:---:|---|:---:|---|
| 1 | **Collections** | **11** | Tổng số bộ sưu tập đang vận hành trong `ncf_recommender_db` |
| 2 | **Sản phẩm (`products`)** | **633** | Danh mục mặt hàng thể thao (Chạy bộ, Bóng đá, Gym, Cầu lông...) |
| 3 | **Biến thể SKU (`variants`)** | **1945** | Tổng số phân loại Size/Màu sắc chi tiết của các sản phẩm |
| 4 | **Bộ môn Thể thao (`sport_type`)** | **8** | Bóng chuyền, Chạy bộ, Cầu lông, Dã ngoại, Gym & Fitness, Phụ kiện chung, Pickleball, Đá bóng |
| 5 | **Phân loại hàng (`product_type`)** | **4** | Giày dép, Phụ kiện, Quần áo, Thiết bị |
| 6 | **Người dùng (`users`)** | **230** | Tài khoản hệ thống (Khách hàng, Admin) |
| 7 | **Đơn đặt hàng (`orders`)** | **440** | Đơn hàng phát sinh trên website KADY Sports |
| 8 | **Đánh giá & Nhận xét (`reviews`)** | **529** | Đánh giá sao kèm bình luận thực tế từ người mua |
| 9 | **Mã ưu đãi / Voucher (`vouchers`)** | **5** | Mã giảm giá kích hoạt mua sắm (5 mã đang hiệu lực) |
| 10 | **Tương tác Hành vi (`interactions`)** | **4,994** | Lịch sử vết hành vi phục vụ huấn luyện mô hình gợi ý |
| 11 | **Lượt hiển thị gợi ý (`impressions`)** | **437** | Lượt log impression để đo lường tỷ lệ Click-Through-Rate (CTR) |

#### Phân bố chi tiết Sản phẩm & Đơn hàng:
- **Tổng số lượng tồn kho:** **67,812** đơn vị sản phẩm lưu hành.
- **Biên độ giá bán:** Thấp nhất **60,000 đ**, Cao nhất **14,875,000 đ**, Giá trung bình **810,110 đ**.
- **Điểm đánh giá trung bình:** **4.65 / 5.0 ⭐** (Phân bố: 5⭐: 413, 4⭐: 80, 3⭐: 16, 2⭐: 8, 1⭐: 12).
- **Tổng doanh thu tích lũy:** **1,434,883,000 VNĐ**.

---

## 2. PHÂN BỐ LỊCH SỬ TƯƠNG TÁC (INTERACTION LOGGING)
*Số liệu phục vụ Mục 3.3: Thu thập Dữ liệu Phản hồi Ẩn (Implicit Feedback Mining).*

### Bảng 3.2: Ma trận Phân bố Hành vi Người dùng
| Loại tương tác (`interaction_type`) | Số lượng bản ghi | Tỷ lệ (%) | Trọng số ngầm (Implicit Weight $r_{ui}$) |
|---|:---:|:---:|:---:|
| **Xem chi tiết sản phẩm (`view`)** | **1,212** | **24.27%** | 1.0 |
| **Nhấp chuột từ gợi ý (`click`)** | **1,436** | **28.75%** | 1.5 |
| **Thêm vào giỏ hàng (`add_to_cart`)** | **1,298** | **25.99%** | 2.5 |
| **Yêu thích sản phẩm (`wishlist`)** | **51** | **1.02%** | 3.0 |
| **Hoàn tất mua hàng (`purchase`)** | **935** | **18.72%** | 4.0 |
| **Đánh giá nhận xét (`review`)** | **0** | **0.00%** | 5.0 |
| **TỔNG CỘNG** | **4,994** | **100.0%** | — |

---

## 3. THỐNG KÊ TẬP DỮ LIỆU HUẤN LUYỆN NCF (BẢNG 4.1)
*Số liệu phục vụ Bảng 4.1: Đặc tả Thông số Tập dữ liệu Huấn luyện NCF.*

### Bảng 4.1: Đặc tả Kích thước Ma trận Tương tác Người dùng - Mặt hàng
| Thuộc tính (Metric) | Ký hiệu Toán học | Giá trị Thực tế | Ghi chú & Ý nghĩa khoa học |
|---|:---:|:---:|---|
| **Số lượng Người dùng (Users)** | $|U|$ | **230** | Số người dùng duy nhất được mã hóa vào User Embedding |
| **Số lượng Mặt hàng (Items)** | $|I|$ | **633** | Số sản phẩm duy nhất được mã hóa vào Item Embedding |
| **Tổng số ô ma trận tiềm năng** | $|U| \times |I|$ | **145,590** | Kích thước không gian tương tác đầy đủ |
| **Số tương tác thực tế (Interactions)** | $|R|$ | **4,994** | Tổng số phản hồi hành vi đã ghi nhận |
| **Mẫu dữ liệu huấn luyện (Train Samples)** | $|R_{train}|$ | **16,740** | Dữ liệu nạp vào vòng lặp huấn luyện |
| **Mẫu đánh giá thực nghiệm (Test Instances)**| $|R_{test}|$ | **203** | Phép kiểm thử Leave-One-Out (1 mẫu dương + 99 mẫu âm) |
| **Độ thưa Ma trận (Matrix Sparsity)** | $S$ | **96.57%** | $S = 1 - \frac{|R|}{|U| \times |I|}$ |
| **Tỷ lệ Mật độ Tương tác (Density)** | $D$ | **3.43%** | $D = \frac{|R|}{|U| \times |I|}$ |
| **Số tương tác trung bình mỗi User** | $\bar{r}_u$ | **21.7** | Trung bình số lượt tương tác mỗi người dùng đã tạo ra |
| **Số tương tác trung bình mỗi Item** | $\bar{r}_i$ | **7.9** | Trung bình số lượt quan tâm/giao dịch trên mỗi sản phẩm |

---

## 4. SIÊU THAM SỐ & KIẾN TRÚC NCF (BẢNG 4.2)
*Số liệu phục vụ Bảng 4.2: Thiết lập Siêu tham số Mô hình NCF (NeuMF).*

### Bảng 4.2: Bảng Cấu hình Siêu tham số Mô hình NCF
| Phân loại Siêu tham số | Tham số Thiết kế | Giá trị Thiết lập | Ý nghĩa & Vai trò |
|---|---|:---:|---|
| **Kích thước Embedding** | GMF Embedding Dimension ($K_{GMF}$) | **16** | Vector tiềm ẩn biểu diễn tương tác tuyến tính |
| | MLP Embedding Dimension ($K_{MLP}$) | **16** | Vector tiềm ẩn biểu diễn tương tác phi tuyến tính |
| | Tổng chiều dài Vector Embeddings | **32** | Ghép nối song song 2 nhánh GMF + MLP |
| **Kiến trúc Tầng ẩn MLP** | Cấu trúc các tầng ẩn (`mlp_layers`) | **[32, 16, 8]** | 3 lớp nén đặc trưng [32 $\to$ 16 $\to$ 8] |
| | Hàm kích hoạt (Activation Function) | **ReLU** | Chống bão hòa Gradient và biểu diễn phi tuyến |
| **Học máy & Tối ưu hóa** | Thuật toán Tối ưu (Optimizer) | **Adam (lr=0.003, weight_decay=1e-4)** | Tự thích ứng learning rate theo đà mômen |
| | Hàm mất mát (Loss Function) | **Binary Cross-Entropy (BCELoss)** | Tối ưu hóa dự đoán xác suất tương tác nhị phân |
| | Tỷ lệ Lấy mẫu âm (Negative Sampling) | **1:4** | 1 tương tác dương ghép với 4 mẫu âm ngẫu nhiên |
| | Mẫu âm đánh giá (Test Negatives) | **99** | 99 sản phẩm âm tính cho mỗi tương tác kiểm thử |
| **Quá trình Huấn luyện** | Số chu kỳ lặp (Epochs) | **20** | Số lần duyệt qua toàn bộ tập dữ liệu |
| | Kích thước lô (Batch Size) | **128** | Cân bằng tốc độ GPU/CPU và độ ổn định Gradient |

---

## 5. ĐỐI SÁNH HIỆU NĂNG THỰC NGHIỆM (BẢNG 4.3)
*Số liệu phục vụ Bảng 4.3: Bảng So sánh Kết quả Giữa Mô hình Đề xuất và các Baseline.*

### Bảng 4.3: Kết quả Đối sánh Thực nghiệm Mô hình Đề xuất và Baseline
| STT | Phương pháp / Mô hình | Phân loại Cơ chế | BCE Loss $\downarrow$ | HR@8 (%) $\uparrow$ | NDCG@8 $\uparrow$ | HR@10 (%) $\uparrow$ | NDCG@10 $\uparrow$ | Đánh giá |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Gợi ý theo Độ phổ biến (Popularity)** | Xếp hạng dựa trên tần suất tương tác tập huấn luyện | **0.6931** | **13.30%** | **0.0551** | **15.76%** | **0.0624** | Baseline đối chuẩn |
| 2 | **Generalized Matrix Factorization** | Tương tác tuyến tính tích Hadamard vector ẩn 16 chiều | **0.0072** | **36.45%** | **0.2069** | **41.87%** | **0.2227** | Baseline đối chuẩn |
| 3 | **Multi-Layer Perceptron** | Tương tác phi tuyến sâu qua các tầng ReLU [32, 16, 8] | **0.1775** | **49.26%** | **0.2738** | **58.13%** | **0.3001** | Baseline đối chuẩn |
| 4 | **Neural Collaborative Filtering (Hybrid)** | Hợp nhất song song đặc trưng GMF 16D, MLP [32, 16, 8] và trọng số ngữ cảnh thể thao | **0.2060** | **74.88%** | **0.3805** | **87.19%** | **0.4169** | **Tối ưu nhất (Proposed)** |

> **Nhận xét Khoa học:**  
> - Mô hình **NeuMF (Hybrid)** cho kết quả vượt trội so với **Popularity**, **GMF thuần** và **MLP thuần** nhờ việc cộng hưởng đồng thời đặc trưng tuyến tính (Hadamard Product 16D), phi tuyến sâu (MLP Layers `[32, 16, 8]`) và trọng số ngữ cảnh bộ môn thể thao (`context_boost` + `rating_score`).

---

## 6. TIẾN TRÌNH HỘI TỤ HUẤN LUYỆN QUA 20 EPOCHS (BẢNG 4.4)
*Số liệu phục vụ Bảng 4.4 & Biểu đồ Hội tụ Đường cong Học tập (Loss & Metrics Curves).*

### Bảng 4.4: Lịch sử Đào tạo Chi tiết qua Từng Vòng Lặp (Epoch-by-Epoch Convergence)
| Epoch | Hàm mất mát (BCE Loss) $\downarrow$ | Hit Rate @ 8 (HR@8) $\uparrow$ | NDCG @ 8 $\uparrow$ | Hit Rate @ 10 (HR@10) $\uparrow$ | NDCG @ 10 $\uparrow$ | Trạng thái Hội tụ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Epoch 01** | 0.5384 | 36.45% | 0.1699 | 40.89% | 0.1829 | Khởi tạo ban đầu |
| **Epoch 02** | 0.4774 | 46.31% | 0.2191 | 52.22% | 0.2365 | Đang học tối ưu |
| **Epoch 03** | 0.4711 | 55.67% | 0.2584 | 66.50% | 0.2905 | Đang học tối ưu |
| **Epoch 04** | 0.4670 | 65.02% | 0.3080 | 76.35% | 0.3417 | Đang học tối ưu |
| **Epoch 05** | 0.4552 | 72.91% | 0.3764 | 83.25% | 0.4070 | Đang học tối ưu |
| **Epoch 06** | 0.4365 | 75.37% | 0.3989 | 84.24% | 0.4252 | Đang học tối ưu |
| **Epoch 07** | 0.4081 | 78.33% | 0.4026 | 87.68% | 0.4303 | Đang học tối ưu |
| **Epoch 08** | 0.3790 | 76.35% | 0.3896 | 86.21% | 0.4188 | Đang học tối ưu |
| **Epoch 09** | 0.3572 | 73.40% | 0.3625 | 86.70% | 0.4018 | Đang học tối ưu |
| **Epoch 10** | 0.3391 | 73.40% | 0.3637 | 87.68% | 0.4058 | Đang học tối ưu |
| **Epoch 11** | 0.3213 | 75.37% | 0.3939 | 88.18% | 0.4319 | Đang học tối ưu |
| **Epoch 12** | 0.3061 | 77.34% | 0.4059 | 88.18% | 0.4379 | Đang học tối ưu |
| **Epoch 13** | 0.2905 | 76.35% | 0.3862 | 87.19% | 0.4182 | Đang học tối ưu |
| **Epoch 14** | 0.2755 | 74.88% | 0.3625 | 87.68% | 0.4006 | Đang học tối ưu |
| **Epoch 15** | 0.2619 | 78.33% | 0.3894 | 88.67% | 0.4198 | Tiệm cận hội tụ |
| **Epoch 16** | 0.2461 | 76.35% | 0.3846 | 88.67% | 0.4210 | Tiệm cận hội tụ |
| **Epoch 17** | 0.2362 | 72.91% | 0.3803 | 87.19% | 0.4226 | Tiệm cận hội tụ |
| **Epoch 18** | 0.2252 | 76.85% | 0.3758 | 87.68% | 0.4078 | Tiệm cận hội tụ |
| **Epoch 19** | 0.2174 | 75.86% | 0.3924 | 87.68% | 0.4274 | Tiệm cận hội tụ |
| **Epoch 20** | 0.2060 | 74.88% | 0.3805 | 87.19% | 0.4169 | **Hội tụ ổn định** |

---

## 7. HIỆU NĂNG SUY LUẬN THỜI GIAN THỰC (INFERENCE LATENCY)
*Số liệu phục vụ Bảng 4.5 & Phân tích Đánh giá Độ trễ Phản hồi API (Real-time Serving Readiness).*

### Bảng 4.5: Thời gian Suy luận Mô hình PyTorch NCF trên Bộ nhớ RAM (100 Lượt đo)
| Thông số Phép đo | Ký hiệu | Giá trị Đo đạc Thực tế (ms) | Đánh giá Sẵn sàng Production |
|---|:---:|:---:|---|
| **Thời gian Trung bình (Mean Latency)** | $\mu$ | **0.822 ms** | **Xuất sắc (< 5 ms)** - Đáp ứng yêu cầu thời gian thực cực cao |
| **Phân vị 50 (Median Latency - P50)** | $P_{50}$ | **0.796 ms** | Đảm bảo phản hồi gần như tức thì cho 50% người dùng |
| **Phân vị 95 (P95 Latency)** | $P_{95}$ | **0.966 ms** | Đảm bảo tải mượt mà ngay cả trong thời điểm cao điểm |
| **Thời gian Nhanh nhất (Min Latency)** | $L_{min}$ | **0.705 ms** | Thời gian xử lý ma trận embedding thuần trên CPU |
| **Thời gian Lâu nhất (Max Latency)** | $L_{max}$ | **1.205 ms** | Không bị nghẽn CPU hoặc treo Garbage Collection |
| **Khả năng Phục vụ Ước tính (Throughput)** | $QPS$ | **~1,216 req/s** | Tốc độ suy luận tối đa lý thuyết trên một luồng CPU |

---

## 8. TÓM TẮT THÔNG SỐ VÀNG ĐỂ ĐIỀN VÀO LUẬN VĂN

```text
+---------------------------------------------------------------------------------+
| THÔNG SỐ VÀNG CHO BÁO CÁO LUẬN VĂN (KADY SPORTS & NCF RECOMMENDER)              |
+---------------------------------------------------------------------------------+
- Tổng số sản phẩm trong cơ sở dữ liệu:          633 sản phẩm (8 bộ môn)
- Tổng số biến thể phân loại (SKU Variants):      1945 phân loại
- Tổng số bản ghi tương tác khách hàng:           4,994 tương tác
- Số người dùng trong ma trận NCF:                230 người dùng
- Số mặt hàng trong ma trận NCF:                  633 mặt hàng
- Kích thước không gian tương tác (|U| x |I|):    145,590 ô
- Độ thưa ma trận tương tác (Sparsity):           96.57%
- Kích thước Vector nhúng tiềm ẩn:                32 chiều (GMF 16D + MLP 16D)
- Kiến trúc các tầng sâu MLP:                     [32, 16, 8] -> Sigmoid
- Hàm mất mát huấn luyện cuối cùng (BCE Loss):    0.2060
- Hit Rate tại Top-8 (HR@8):                      74.9%
- NDCG tại Top-8 (NDCG@8):                        0.381
- Hit Rate tại Top-10 (HR@10):                    87.2%
- NDCG tại Top-10 (NDCG@10):                      0.417
- Thời gian suy luận NCF trên RAM:                0.822 ms / user (P95: 0.966 ms)
+---------------------------------------------------------------------------------+
```
