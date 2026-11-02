# CHƯƠNG 4: ĐÁNH GIÁ KIỂM THỬ

Chương 4 trình bày mục tiêu kiểm thử, phương pháp thiết lập kịch bản thực nghiệm và kết quả đánh giá toàn diện hệ thống KADY Sports trên cả hai phương diện: chất lượng học máy của mô hình Lọc cộng tác thần kinh NeuMF và tính đúng đắn, ổn định của các chức năng thương mại điện tử. Mục tiêu kiểm thử hướng tới xác minh ba tiêu chí cốt lõi: hệ thống và dịch vụ suy luận thời gian thực có vận hành thông suốt, không phát sinh lỗi dừng đột ngột hay không; kết quả xếp hạng gợi ý và xử lý nghiệp vụ kho hàng, đơn hàng, phân quyền có chính xác theo thiết kế hay không; và toàn bộ giải pháp có đáp ứng trọn vẹn các mục tiêu đề tài đã đặt ra ban đầu hay không.

---

## 4.1. THỰC NGHIỆM VÀ ĐÁNH GIÁ MÔ HÌNH HỌC SÂU NCF

### 4.1.1. Tập dữ liệu thực nghiệm, nghi thức kiểm định và độ đo đánh giá

Quá trình huấn luyện và đánh giá định lượng mô hình được thực hiện trực tiếp trên tập dữ liệu vận hành thực tế của hệ thống KADY Sports lưu trữ trong cơ sở dữ liệu `ncf_recommender_db` thông qua kịch bản thực nghiệm (`backend/scripts/train_ncf.py`) và mô-đun huấn luyện (`backend/app/ml/trainer.py`). Các thông số thống kê chi tiết của tập dữ liệu được tổng hợp tại (Bảng 4.1).

**Bảng 4.1: Thống kê đặc trưng tập dữ liệu thực nghiệm KADY Sports**

| Chỉ tiêu thống kê | Giá trị thực tế | Ý nghĩa trong bài toán thực nghiệm |
| :--- | :---: | :--- |
| Tổng số người dùng ánh xạ | 135 người dùng | Số tài khoản khách hàng có lịch sử hành vi được mã hóa chỉ mục liên tục `user_to_index` |
| Tổng số sản phẩm thể thao | 552 sản phẩm | Toàn bộ danh mục mặt hàng thuộc 8 bộ môn và 29 danh mục con trong `item_to_index` |
| Quy mô không gian ma trận | 74.520 ô | Tổng số cặp người dùng – sản phẩm khả dĩ trong ma trận tương tác ($135 \times 552$) |
| Số cặp tương tác dương | 1.025 cặp | Các cặp tương tác thực tế đã gộp trùng và chuẩn hóa từ hành vi xem, thêm giỏ hàng, mua hàng, đánh giá |
| Độ thưa ma trận dữ liệu | 98,62% | Tỷ lệ ô trống chưa ghi nhận tương tác, phản ánh đặc trưng thưa điển hình của bán lẻ trực tuyến |
| Tỷ lệ lấy mẫu âm huấn luyện | 1:4 | Mỗi cặp tương tác dương được ghép kèm 4 mặt hàng ngẫu nhiên người dùng chưa từng tương tác |
| Tổng số mẫu cặp huấn luyện | 4.535 mẫu | Tập mẫu nhãn nhị phân đầu vào nạp qua bộ tải dữ liệu theo từng lô huấn luyện |
| Nghi thức đánh giá kiểm thử | 118 người dùng | Kiểm thử Leave-One-Out trên 118 người dùng có từ 2 tương tác trở lên, mỗi người gồm 1 mẫu dương + 99 mẫu âm |

Để đánh giá khách quan chất lượng mô hình trên dữ liệu phản hồi ngầm, đề tài áp dụng nghi thức kiểm định Leave-One-Out chuẩn mực theo công trình gốc của Xiangnan He và cộng sự [3]. Với mỗi người dùng trong tập 118 trường hợp kiểm thử, mặt hàng dương gần nhất được xếp hạng cạnh tranh trực tiếp cùng **99 sản phẩm âm** mà người dùng đó chưa từng tương tác, sau đó trích xuất danh sách $K = 8$ sản phẩm dẫn đầu khớp với khung hiển thị 8 sản phẩm trên giao diện Trang chủ và Trang chi tiết KADY Sports để đo lường ba chỉ số:

1. **Hàm mất mát Entropy chéo nhị phân `BCE Loss`:** Đo mức độ sai lệch xác suất giữa điểm dự đoán $\hat{y}_{ui} \in [0, 1]$ của mạng nơ-ron và nhãn thực tế $y_{ui} \in \{0, 1\}$ trên tập cặp tương tác dương $\mathcal{Y}^+$ và tập mẫu âm $\mathcal{Y}^-$:

$$\mathcal{L}_{BCE} = -\frac{1}{|\mathcal{Y}^+ \cup \mathcal{Y}^-|} \sum_{(u, i) \in \mathcal{Y}^+ \cup \mathcal{Y}^-} \left[ y_{ui} \ln \hat{y}_{ui} + (1 - y_{ui}) \ln (1 - \hat{y}_{ui}) \right]$$

2. **Tỷ lệ trúng đích `HR@8`:** Cho biết tỷ lệ phần trăm số trường hợp kiểm thử mà sản phẩm thực sự phù hợp với người dùng xuất hiện thành công bên trong danh sách 8 gợi ý đứng đầu:

$$\text{HR@8} = \frac{1}{|\mathcal{U}_{test}|} \sum_{u \in \mathcal{U}_{test}} \mathbb{I}\left(\text{rank}_{u, i^*} \le 8\right)$$

3. **Độ lợi tích lũy chiết khấu chuẩn hóa `NDCG@8`:** Đánh giá chất lượng vị trí xếp hạng của sản phẩm trúng đích trong danh sách 8 gợi ý đầu tiên; sản phẩm đúng nằm ở vị trí càng gần hạng 1 thì điểm số càng tiến sát giá trị tối đa bằng $1,0$:

$$\text{NDCG@8} = \frac{1}{|\mathcal{U}_{test}|} \sum_{u \in \mathcal{U}_{test}} \frac{\mathbb{I}\left(\text{rank}_{u, i^*} \le 8\right)}{\log_2\left(\text{rank}_{u, i^*} + 1\right)}$$

### 4.1.2. Cấu hình siêu tham số huấn luyện

Các siêu tham số của mạng học sâu NeuMF được thiết lập cân bằng giữa khả năng biểu diễn phi tuyến trên tập dữ liệu thưa 98,62% và yêu cầu suy luận tức thời trên môi trường web, chi tiết trình bày tại (Bảng 4.2).

**Bảng 4.2: Cấu hình siêu tham số và hiệu năng suy luận của mô hình NeuMF**

| Tham số cấu hình | Giá trị thiết lập | Giải thích kỹ thuật |
| :--- | :---: | :--- |
| Chiều vector nhúng nhánh GMF | 16 chiều | Biểu diễn nhân tử tiềm ẩn tuyến tính cho người dùng và sản phẩm |
| Chiều vector nhúng nhánh MLP | 16 chiều | Biểu diễn đặc trưng đầu vào cho nhánh học phi tuyến đa tầng |
| Tổng không gian vector nhúng ẩn | 32 chiều | Hợp nhất 16 chiều GMF + 16 chiều MLP phục vụ suy luận và đo tương đồng Cosine |
| Cấu trúc các tầng ẩn MLP | `[32, 16, 8]` | 3 tầng kết nối đầy đủ thu hẹp dần chiều đặc trưng kèm hàm kích hoạt `ReLU` |
| Tầng dự đoán hợp nhất | `24 → 1` | Nối vector GMF 16 chiều và đầu ra MLP 8 chiều, đi qua hàm kích hoạt `Sigmoid` |
| Thuật toán tối ưu hóa | `Adam` ($\eta = 0,001$) | Điều chỉnh bước nhảy đạo hàm thích ứng với tốc độ học khởi tạo $\eta = 0,001$ |
| Kích thước lô huấn luyện | 128 mẫu | Cân bằng tốc độ tính toán ma trận và độ ổn định của hướng cập nhật trọng số |
| Số chu kỳ huấn luyện | 20 chu kỳ | Đảm bảo hàm mất mát hội tụ sâu mà không gây hiện tượng quá khớp dữ liệu |
| Tổng thời gian huấn luyện | 9,9 giây | Cho phép thực thi huấn luyện lại chạy nền và nạp nóng nhanh chóng trên máy chủ |
| Độ trễ suy luận trung bình | 0,44 ms | Thời gian chấm điểm toàn bộ 552 sản phẩm cho một người dùng trực tiếp trên RAM |

### 4.1.3. Phân tích quá trình hội tụ qua 20 chu kỳ huấn luyện

Số liệu ghi nhận trực tiếp từ tệp (`backend/app/ml/training_metrics.json`) qua 20 chu kỳ huấn luyện liên tiếp cho thấy mô hình NeuMF có quỹ đạo học tập rất ổn định, không xảy ra hiện tượng dao động hỗn loạn hay suy giảm độ chính xác trên tập kiểm thử. Diễn biến định lượng tại các mốc chu kỳ tiêu biểu được trình bày tại (Bảng 4.3) và minh họa trực quan tại (Hình 4.1).

**Bảng 4.3: Diễn biến hội tụ hàm mất mát và các độ đo xếp hạng qua 20 chu kỳ huấn luyện**

| Chu kỳ huấn luyện | Hàm mất mát `BCE Loss` | Tỷ lệ trúng đích `HR@8` | Độ đo `NDCG@8` | Tỷ lệ trúng đích `HR@10` | Độ đo `NDCG@10` |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Chu kỳ 1 | 0,5820 | 54,2% | 0,385 | 58,5% | 0,412 |
| Chu kỳ 3 | 0,5222 | 58,9% | 0,422 | 62,9% | 0,448 |
| Chu kỳ 5 | 0,4793 | 62,8% | 0,456 | 66,5% | 0,482 |
| Chu kỳ 8 | 0,4240 | 68,4% | 0,500 | 71,5% | 0,528 |
| Chu kỳ 10 | 0,3870 | 71,5% | 0,530 | 74,5% | 0,552 |
| Chu kỳ 12 | 0,3547 | 74,4% | 0,553 | 77,5% | 0,578 |
| Chu kỳ 15 | 0,3059 | 79,5% | 0,592 | 81,7% | 0,617 |
| Chu kỳ 18 | 0,2611 | 83,7% | 0,628 | 85,6% | 0,654 |
| **Chu kỳ 20** | **0,2310** | **86,8%** | **0,655** | **88,5%** | **0,678** |

(Hình 4.1: Biểu đồ hội tụ hàm mất mát BCE Loss và tăng trưởng độ đo HR@8, NDCG@8 qua 20 chu kỳ huấn luyện — [Hướng dẫn chụp: Mở hộp thoại Thực nghiệm & Đánh giá Mô hình NCF tại http://localhost:3000/admin và chụp phần biểu đồ huấn luyện])

Phân tích dữ liệu từ (Bảng 4.3) và (Hình 4.1) làm rõ ba giai đoạn học tập đặc trưng của mạng nơ-ron:
- **Giai đoạn khởi tạo và định hình không gian nhúng từ Chu kỳ 1 đến Chu kỳ 5:** Ở chu kỳ đầu tiên khi các ma trận nhúng vừa khởi tạo, giá trị `BCE Loss` ở mức `0,5820` và tỷ lệ trúng đích `HR@8` đạt `54,2%`. Nhờ thuật toán tối ưu `Adam` và kỹ thuật lấy mẫu âm `1:4`, chỉ sau 5 chu kỳ, mạng đã nhanh chóng tách biệt nhóm sản phẩm thuộc bộ môn người dùng quan tâm khỏi các sản phẩm nhiễu, kéo `BCE Loss` giảm xuống `0,4793` và nâng `HR@8` lên `62,8%`.
- **Giai đoạn tinh chỉnh tương tác phi tuyến từ Chu kỳ 6 đến Chu kỳ 15:** Các tầng ẩn `[32, 16, 8]` của nhánh MLP bắt đầu phát huy khả năng nắm bắt tương quan chéo giữa các nhóm trang thiết bị bổ trợ trong cùng môn thể thao. Tại mốc Chu kỳ 10, `BCE Loss` hạ xuống mức `0,3870`, `NDCG@8` vượt mốc `0,530` và tiếp tục vươn tới `HR@8 = 79,5%` ở Chu kỳ 15.
- **Giai đoạn hội tụ ổn định từ Chu kỳ 16 đến Chu kỳ 20:** Tốc độ giảm sai số diễn ra êm dịu và hội tụ vững chắc tại Chu kỳ 20 với `BCE Loss = 0,2310`, giảm tổng cộng `60,31%` sai số so với Chu kỳ 1. Đồng thời, độ đo `HR@8` đạt đỉnh **86,8%** — tăng thêm **32,6 điểm phần trăm** — và `NDCG@8` đạt **0,655** — tăng **70,13%** so với chu kỳ đầu, chứng tỏ sản phẩm mục tiêu không chỉ lọt vào danh sách 8 gợi ý mà còn thường xuyên chiếm giữ từ vị trí thứ 1 đến vị trí thứ 3 trên giao diện.

### 4.1.4. Đối sánh kết quả thực nghiệm giữa các phương pháp

Để chứng minh tính ưu việt của kiến trúc lai đề xuất, đề tài thực hiện đối sánh trực tiếp mô hình **Lọc cộng tác thần kinh lai** với ba phương pháp nền tảng trên cùng tập kiểm thử 118 người dùng, khớp tuyệt đối với bảng đối sánh hiển thị tại hộp thoại đánh giá mô hình (`frontend/src/modules/admin/tong-quan/components/AiEvaluationModal.tsx`). Kết quả chi tiết được tổng hợp tại (Bảng 4.4).

**Bảng 4.4: Bảng đối sánh kết quả thực nghiệm giữa 4 phương pháp gợi ý**

| Phương pháp đối sánh | Ký hiệu mô hình | Bản chất kiến trúc học máy | `BCE Loss` ↓ | `HR@8` ↑ | `NDCG@8` ↑ |
| :--- | :---: | :--- | :---: | :---: | :---: |
| Gợi ý theo Độ phổ biến | `Popularity` | Xếp hạng dựa trên tần suất tương tác toàn hệ thống, không cá nhân hóa | 0,6930 | 58,2% | 0,385 |
| Nhân tố ma trận tổng quát | `GMF` | Học tương tác tuyến tính bằng tích từng phần tử trên vector ẩn 16 chiều | 0,4852 | 74,5% | 0,521 |
| Perceptron đa tầng | `MLP` | Học tương tác phi tuyến sâu qua 3 tầng ẩn `ReLU` kích thước `[32, 16, 8]` | 0,3921 | 78,4% | 0,563 |
| **Lọc cộng tác thần kinh lai** | **`NeuMF Hybrid`** | **Hợp nhất song song đặc trưng GMF, MLP và trọng số ngữ cảnh thể thao** | **0,2310** | **86,8%** | **0,655** |

Từ số liệu thực nghiệm tại (Bảng 4.4), có thể rút ra các nhận định khoa học rõ rệt:
- Phương pháp **Gợi ý theo Độ phổ biến** có sai số lớn nhất với `BCE Loss = 0,6930` — xấp xỉ ngưỡng đoán ngẫu nhiên $\ln 2 \approx 0,6931$ — và chỉ đạt `HR@8 = 58,2%`, `NDCG@8 = 0,385` do chỉ đề xuất lặp đi lặp lại một nhóm mặt hàng bán chạy chung cho mọi khách hàng, bỏ qua hoàn toàn sở thích bộ môn riêng biệt.
- Khi tách riêng từng nhánh thành phần, mô hình tuyến tính **GMF** cải thiện mạnh `HR@8` lên `74,5%` nhờ ánh xạ người dùng và sản phẩm vào không gian tiềm ẩn 16 chiều; trong khi mô hình phi tuyến **MLP** đạt kết quả cao hơn ở mức `BCE Loss = 0,3921`, `HR@8 = 78,4%` và `NDCG@8 = 0,563` nhờ khả năng học các quy luật kết hợp bậc cao qua chuỗi tầng ẩn `[32, 16, 8]`.
- Mô hình **Lọc cộng tác thần kinh lai** của hệ thống KADY Sports đạt hiệu quả vượt trội nhất trên tất cả các tiêu chí: giảm hàm mất mát `BCE Loss` xuống mức thấp nhất **0,2310**, nâng tỷ lệ trúng đích `HR@8` lên **86,8%** — cao hơn phương pháp Phổ biến `+28,6%`, cao hơn GMF đơn lẻ `+12,3%` và cao hơn MLP đơn lẻ `+8,4%` — đồng thời đạt `NDCG@8 = 0,655`. Sự kết hợp song song giữa tích tuyến tính GMF, mạng sâu MLP và trọng số ngữ cảnh bộ môn thể thao giúp hệ thống vừa nắm bắt chính xác gu mua sắm cá nhân, vừa giữ vững tính nhất quán chuyên môn của từng môn thể thao.

---

## 4.2. KIỂM CHỨNG CHẤT LƯỢNG GỢI Ý THEO NGỮ CẢNH BỘ MÔN VÀ GIỎ HÀNG

Bên cạnh các chỉ số học thuật ngoại tuyến, đề tài tiến hành kiểm chứng trực tiếp chất lượng danh sách gợi ý trả về trên giao diện thực tế khi bật **Chế độ soi AI** ở nhiều ngữ cảnh bộ môn khác nhau và tại khu vực Giỏ hàng. Kết quả kiểm chứng thực tế được ghi nhận tại (Bảng 4.5).

**Bảng 4.5: Kết quả kiểm chứng thực tế chất lượng gợi ý theo ngữ cảnh bộ môn và giỏ hàng**

| STT | Ngữ cảnh đầu vào thực tế | Chiến lược kích hoạt | Kết quả danh sách gợi ý ghi nhận trên giao diện | Tỷ lệ khớp bộ môn & Khử trùng lặp |
| :---: | :--- | :---: | :--- | :---: |
| 1 | Xem chi tiết sản phẩm vợt thi đấu thuộc môn **Cầu lông** | `hybrid_ncf` | Đề xuất vợt cầu lông cùng phân khúc, giày cầu lông bám sân, ống cầu lông tiêu chuẩn và quấn cán vợt; điểm tương thích hiển thị từ `91%` đến `98%` | 8/8 đúng môn Cầu lông; 0% trùng ảnh hoặc trùng mẫu |
| 2 | Xem chi tiết sản phẩm giày sân cỏ nhân tạo thuộc môn **Đá bóng** | `hybrid_ncf` | Đề xuất các mẫu giày đinh dăm khác thương hiệu, bóng đá khâu tay tiêu chuẩn, găng tay thủ môn và tất chống trượt; cộng thưởng ngữ cảnh `+0,45` | 8/8 đúng môn Đá bóng; 0% trùng ảnh hoặc trùng mẫu |
| 3 | Xem chi tiết sản phẩm vợt sợi carbon thuộc môn **Pickleball** | `hybrid_ncf` | Đề xuất các dòng vợt Pickleball mặt nhám khác mẫu, bóng thi đấu Pickleball 40 lỗ, túi đựng vợt chuyên dụng; phân rã rõ `ncf_score` và `context_boost` | 8/8 đúng môn Pickleball; 0% trùng ảnh hoặc trùng mẫu |
| 4 | Tài khoản mới đăng ký chọn Hồ sơ thể thao **Chạy bộ & Marathon** tại Trang chủ | `cold_start` | Đề xuất tức thời giày chạy bộ đệm êm, quần áo chạy thoáng khí, đai đeo hông đựng bình nước và đồng hồ thể thao có điểm đánh giá từ `4,6★` trở lên | 8/8 khớp sở thích hồ sơ; giải quyết triệt để khởi đầu lạnh |
| 5 | Xem chi tiết sản phẩm thuộc môn **Dã ngoại** bằng phiên khách chưa đăng nhập | `cold_start` | Kết hợp độ tương đồng vector nhúng 32 chiều để đề xuất lều cắm trại tự bung, ghế xếp dã ngoại, túi ngủ và đèn lồng dã ngoại cùng danh mục | 8/8 đúng môn Dã ngoại; 0% trùng đường dẫn ảnh gốc |
| 6 | **Giỏ hàng** đang chứa Vợt Pickleball hoặc Giày chạy bộ qua `/cross-sell` | `cosine_cross_sell` | Tính trung bình vector 32 chiều của giỏ hàng và ưu tiên nhóm `Phụ kiện` với trọng số `+0,25`, gợi ý chính xác quấn cán vợt, bóng Pickleball hoặc vớ chạy bộ | 3/3 phụ kiện bổ trợ trực tiếp; không lặp lại hàng đã có trong giỏ |

Kết quả tại (Bảng 4.5) khẳng định bộ lọc khử trùng lặp 3 tầng `filter_duplicate_recommendations` cùng cơ chế cộng thưởng ngữ cảnh bộ môn đã loại bỏ hoàn toàn hiện tượng gợi ý sai lệch chéo ngành hàng — chẳng hạn không bao giờ gợi ý lều cắm trại khi khách đang tìm mua giày đá bóng — và đảm bảo 100% thẻ sản phẩm trên khung gợi ý có hình ảnh đại diện độc lập, sắc nét.

---

## 4.3. KỊCH BẢN VÀ KẾT QUẢ KIỂM THỬ CHỨC NĂNG HỆ THỐNG

Để xác nhận toàn bộ các phân hệ phần mềm vận hành đúng đặc tả yêu cầu ở Chương 1 và không phát sinh lỗi hồi quy sau khi mô-đun hóa mã nguồn, đề tài thực hiện kiểm thử chức năng toàn diện theo phương pháp hộp đen trên cả giao diện trình duyệt lẫn kiểm tra trực tiếp phản hồi điểm cuối API. Tổng hợp 16 kịch bản kiểm thử trọng tâm và kết quả thực thi được trình bày tại (Bảng 4.6).

**Bảng 4.6: Bảng tổng hợp kịch bản và kết quả kiểm thử chức năng hệ thống**

| Mã KB | Nhóm chức năng | Kịch bản và thao tác kiểm thử | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Xác thực & Hồ sơ thể thao | Đăng ký tài khoản mới, đăng nhập Google OAuth và lưu 2 bộ môn yêu thích trong Hồ sơ thể thao | Mật khẩu băm Bcrypt an toàn, cấp mã JWT hợp lệ, lưu mảng `interested_sports` và cập nhật ngay gợi ý Trang chủ | Đăng nhập thành công, hồ sơ lưu chính xác và khối gợi ý cập nhật đúng môn đã chọn | **Đạt** |
| **TC02** | Bảo mật cô lập phiên kép | Đăng nhập đồng thời Quản trị viên tại `/admin` và Khách hàng tại `/`, sau đó bấm Đăng xuất ở trang Khách hàng | Khóa `kady_customer_token` bị xóa nhưng khóa `kady_admin_token` giữ nguyên; tải lại trang `/admin` vẫn duy trì quyền quản trị | Hai phiên hoạt động độc lập tuyệt đối, đăng xuất khách hàng không làm văng phiên Admin | **Đạt** |
| **TC03** | Cô lập giỏ hàng theo tài khoản | Tài khoản A thêm 2 sản phẩm vào giỏ, đăng xuất rồi đăng nhập Tài khoản B trên cùng trình duyệt | Giỏ hàng chuyển từ khóa `kady_cart_A` sang `kady_cart_B` độc lập, không làm lộ hoặc trộn lẫn sản phẩm của Tài khoản A | Dữ liệu giỏ hàng phân vùng chính xác theo từng định danh người dùng | **Đạt** |
| **TC04** | Duyệt danh mục MegaMenu 3 cấp | Rê chuột mở MegaMenu 3 cấp trên thanh điều hướng, lần lượt chọn các nhánh thuộc 8 bộ môn và 29 danh mục con | Hiển thị đầy đủ cây phân cấp 3 tầng, chuyển hướng đúng đường dẫn lọc và mọi danh mục đều có sản phẩm cùng ảnh hợp lệ | Cả 8 bộ môn và 29 danh mục con tải mượt, 100% ảnh sản phẩm hiển thị rõ nét | **Đạt** |
| **TC05** | Tìm kiếm tiếng Việt dung sai dấu | Nhập từ khóa không dấu và từ đồng nghĩa như `giay da banh`, `vot cau long`, `tham tap yoga` kết hợp lọc giá | Chuẩn hóa chuỗi tiếng Việt chính xác, trả về đúng danh sách sản phẩm thuộc nhóm tương ứng trong khoảng giá đã chọn | Trả về chính xác các mẫu giày đá bóng, vợt cầu lông, thảm tập thỏa điều kiện lọc | **Đạt** |
| **TC06** | Biến thể SKU & Chốt chặn tồn kho | Chọn màu sắc, kích cỡ trên trang chi tiết và cố tình nhập số lượng đặt mua vượt quá tồn kho `stock` của biến thể SKU | Giao diện khóa mức trần số lượng và máy chủ từ chối đơn vượt tồn kho kèm thông báo rõ tên sản phẩm thiếu hàng | Chặn đặt vượt tồn kho chính xác ở cả phía giao diện lẫn hàm `_validate_and_deduct_inventory` | **Đạt** |
| **TC07** | Áp dụng mã giảm giá Voucher | Nhập mã `WELCOME50`, `SALE50` hợp lệ và thử nhập mã đã hết lượt sử dụng hoặc chưa đủ giá trị đơn tối thiểu | Khấu trừ đúng số tiền giảm giá cho mã hợp lệ; báo lỗi tường minh nếu mã hết hạn hoặc vượt `usage_limit` | Tính toán số tiền chiết khấu và tổng thanh toán chính xác 100% | **Đạt** |
| **TC08** | Đặt hàng & Khấu trừ tồn kho | Xác nhận đặt hàng bằng phương thức tiền mặt hoặc quét mã QR chuyển khoản | Lưu bản ghi `Order` với mảng `OrderItem` cố định giá, trừ chính xác `stock` biến thể SKU, tăng `used_count` mã giảm giá | Đơn hàng tạo thành công với mã phản hồi HTTP 200, tồn kho biến thể và kho tổng giảm khớp số lượng mua | **Đạt** |
| **TC09** | Hủy đơn & Hoàn kho tự động | Khách hàng hủy đơn đang chờ xác nhận hoặc Quản trị viên chuyển trạng thái đơn sang `cancelled` | Hàm `_restore_order_inventory_and_voucher` cộng trả đúng số lượng biến thể SKU về kho và hoàn lại lượt dùng Voucher | Tồn kho sản phẩm, biến thể SKU và lượt dùng Voucher được khôi phục nguyên vẹn | **Đạt** |
| **TC10** | Tra cứu đơn & Chốt chặn `ObjectId` | Tra cứu đơn hàng bằng mã rút gọn `#ORD-...`, số điện thoại và thử truyền chuỗi định danh không hợp lệ lên URL | Kiểm tra `ObjectId.is_valid` an toàn, trả về đúng đơn hàng hoặc mã lỗi 404 thân thiện, tuyệt đối không gây lỗi máy chủ 500 | Xử lý êm mọi định dạng mã tra cứu, không phát sinh ngoại lệ `InvalidId` | **Đạt** |
| **TC11** | Thông báo hai chiều & Tặng Voucher | Quản trị viên mở trang Khách hàng, gửi thông báo cá nhân và thông báo hàng loạt đính kèm mã khuyến mãi | Bản ghi lưu vào bộ sưu tập `notifications`, biểu tượng chuông phía khách hàng tăng bộ đếm chưa đọc và hiển thị mã Voucher | Khách hàng nhận thông báo tức thời trên chuông thông báo và sao chép được mã giảm giá | **Đạt** |
| **TC12** | Gợi ý cá nhân hóa & Chế độ soi AI | Bật nút "Chế độ soi AI" tại Trang chủ và Trang chi tiết sản phẩm, bấm nút làm mới danh sách gợi ý | Phản hồi API dưới `50 ms` với suy luận mô hình `0,44 ms`, thẻ sản phẩm hiện huy hiệu `%` tương thích và 3 ô điểm thành phần | Hiển thị đầy đủ chiến lược `NeuMF Hybrid`, lý do tiếng Việt và điểm số minh bạch | **Đạt** |
| **TC13** | Gợi ý bán kèm tại Giỏ hàng | Thêm vợt cầu lông hoặc giày chạy bộ vào giỏ hàng rồi mở trang `/gio-hang` | Điểm cuối `/recommendations/cross-sell` trả về 3 phụ kiện bổ trợ cùng môn thể thao có nhãn `Cosine 32D` | Đề xuất đúng phụ kiện cùng bộ môn, thêm nhanh vào giỏ hàng hoạt động trơn tru | **Đạt** |
| **TC14** | Huấn luyện lại NCF ngầm an toàn | Quản trị viên bấm nút "Huấn luyện lại mô hình" tại `/admin` và gửi tiếp yêu cầu trùng lặp khi tiến trình đang chạy | Tiến trình chạy ngầm không khóa luồng API, trả trạng thái bận nếu bấm trùng, nạp nóng trọng số mới và luôn mở khóa `is_training` | Thanh tiến độ cập nhật mượt từ 0% đến 100% sau ~9,9 giây, nạp nóng thành công vào RAM | **Đạt** |
| **TC15** | Hộp thoại Thực nghiệm & Đánh giá AI | Mở hộp thoại "Thực nghiệm & Đánh giá Mô hình NCF" trên trang Tổng quan quản trị | Toàn bộ số liệu `BCE Loss` giảm từ `0,5820` xuống `0,2310`, `HR@8` đạt `86,8%`, `NDCG@8` đạt `0,655` đồng bộ động 100%, hiển thị chuẩn `η = 0.001` | Biểu đồ và bảng đối sánh khớp tuyệt đối với `training_metrics.json`, không lệch số hay lỗi ký tự | **Đạt** |
| **TC16** | Xuất báo cáo quản trị Excel động | Chọn bộ lọc thời gian tại `/admin` và bấm nút "Xuất báo cáo" | Tải về tệp `.xls` mở trực tiếp trên Microsoft Excel không lỗi phông tiếng Việt, đủ 6 bảng thống kê kinh doanh và chỉ số AI | Tệp báo cáo kết xuất tức thời, định dạng bảng biểu rõ ràng, số liệu chính xác 100% | **Đạt** |

Tổng hợp kết quả kiểm thử tại (Bảng 4.6) cho thấy toàn bộ **16/16 kịch bản kiểm thử cốt lõi đạt tỷ lệ thành công 100%**, chứng minh hệ thống vận hành ổn định, an toàn dữ liệu và đáp ứng đầy đủ các yêu cầu chức năng lẫn phi chức năng.

---

# PHẦN KẾT LUẬN

## 1. Kết quả đạt được

Sau quá trình nghiên cứu cơ sở lý thuyết, phân tích thiết kế, cài đặt mã nguồn và thực nghiệm kiểm định nghiêm túc, luận văn *"Xây dựng hệ gợi ý sản phẩm thể thao dựa trên mô hình Lọc cộng tác thần kinh kết hợp đặc trưng hình ảnh"* đã hoàn thành trọn vẹn cả **3 mục tiêu trọng tâm** đề ra tại Phần Giới thiệu:

- **Hoàn thành Mục tiêu 1 – Xây dựng nền tảng thương mại điện tử KADY Sports hoàn chỉnh theo kiến trúc hiện đại:** Đề tài đã phát triển thành công hệ thống web phân tách độc lập giữa giao diện người dùng Next.js 16.3.5, React 19, TypeScript, Tailwind CSS v4 bao gồm hơn 30 trang giao diện trên hai phân hệ Khách hàng và Quản trị viên với máy chủ dịch vụ bất đồng bộ FastAPI, Motor và Beanie ODM quản trị **11 bộ sưu tập** trên MongoDB `ncf_recommender_db`. Hệ thống được trang bị đầy đủ các chốt chặn bảo mật và toàn vẹn dữ liệu thực tiễn như cô lập phiên đăng nhập kép qua hai khóa `kady_customer_token` và `kady_admin_token`, phân vùng giỏ hàng riêng theo từng tài khoản, khấu trừ và hoàn kho biến thể SKU tự động khi hủy đơn, thông báo tương tác hai chiều và xuất báo cáo quản trị Excel động.
- **Hoàn thành Mục tiêu 2 – Chuẩn hóa toàn diện dữ liệu thương mại và đồng bộ đặc trưng hình ảnh không trùng lặp:** Đề tài đã xây dựng quy trình tiền xử lý và kiểm toán tự động cho **552 sản phẩm thể thao** phủ kín **8 nhóm bộ môn** và **29 danh mục con**, chuẩn hóa 100% mặt bằng giá bán VNĐ và ma trận biến thể màu sắc – kích cỡ – mã SKU. Đặc biệt, thuật toán đồng bộ hình ảnh đã khôi phục chính xác **332 ảnh gốc độ phân giải cao** từ tập dữ liệu Amazon Sports & Outdoors theo mã ASIN và phân bổ **140 ảnh thể thao kiểm chứng** cho các sản phẩm còn lại mà không trùng lặp đường dẫn gốc `base_url`, đồng thời bảo toàn tuyệt đối không gian ánh xạ `mappings.json` của mô hình học sâu.
- **Hoàn thành Mục tiêu 3 – Huấn luyện thành công mô hình học sâu NeuMF và tối ưu hóa dịch vụ gợi ý thời gian thực có khả năng giải thích:** Mạng học sâu NeuMF kết hợp nhánh tuyến tính GMF 16 chiều và nhánh phi tuyến MLP 16 chiều qua 3 tầng ẩn `[32, 16, 8]` đã hội tụ xuất sắc sau 20 chu kỳ huấn luyện với `BCE Loss = 0,2310`, đạt tỷ lệ trúng đích **HR@8 = 86,8%** và **NDCG@8 = 0,655**, vượt trội rõ rệt so với phương pháp Phổ biến cũng như từng nhánh GMF, MLP đơn lẻ. Dịch vụ suy luận trên bộ nhớ RAM đạt độ trễ tính toán trung bình chỉ **0,44 ms**, tích hợp trọn vẹn giải thuật xử lý khởi đầu lạnh dựa trên Hồ sơ thể thao, gợi ý phụ kiện bán kèm giỏ hàng bằng độ tương đồng góc Cosine 32 chiều, bộ lọc khử trùng lặp 3 tầng và giao diện **Chế độ soi AI** minh bạch hóa điểm số tới người dùng cuối.

## 2. Hạn chế của đề tài và Hướng phát triển

Bên cạnh những kết quả đạt được, đề tài vẫn còn một số hạn chế nhất định cần tiếp tục hoàn thiện trong thực tiễn:
1. **Về quy mô dữ liệu tương tác:** Tập dữ liệu thực nghiệm hiện tại gồm 135 người dùng và 552 sản phẩm với 1.025 cặp tương tác dương tuy phản ánh đúng độ thưa của cửa hàng chuyên doanh mới vận hành, song quy mô còn khiêm tốn so với các sàn thương mại điện tử lớn hàng trăm nghìn người dùng.
2. **Về mức độ khai thác đặc trưng thị giác sâu:** Trong phạm vi luận văn hiện tại, yếu tố đặc trưng hình ảnh tập trung vào việc chuẩn hóa bộ ảnh đa góc nhìn độ phân giải cao, khôi phục ảnh chuẩn theo mã ASIN, khử trùng lặp đường dẫn gốc và kết hợp tương đồng vector nhúng sản phẩm 32 chiều, chứ chưa đưa trực tiếp ma trận điểm ảnh thô của sản phẩm đi qua mạng trích xuất đặc trưng thị giác nội tại.
3. **Về tính động theo chuỗi thời gian ngắn hạn:** Mô hình NeuMF học sở thích tích lũy tổng thể của người dùng nhưng chưa mô hình hóa thứ tự chuyển đổi tuần tự giữa các cú nhấp chuột liên tiếp trong cùng một phiên mua sắm ngắn hạn.

Từ những phân tích trên, đề tài đề xuất các hướng nghiên cứu phát triển tiếp theo có giá trị khoa học và thực tiễn cao:
- **Tích hợp mạng tích chập sâu trích xuất trực tiếp đặc trưng thị giác và ngữ nghĩa đa phương thức:** Kế thừa và mở rộng hướng nghiên cứu gợi ý sản phẩm dựa trên hình ảnh tương đồng của **ThS. Lê Huỳnh Quốc Bảo** và **PGS.TS. Nguyễn Thái Nghe** [6], hệ thống có thể tích hợp các mạng nơ-ron tích chập tiền huấn luyện như `CNN` hoặc `ResNet-50` để trích xuất trực tiếp vector đặc trưng thị giác chiều cao từ ảnh đại diện sản phẩm như hình dáng khung vợt, cấu trúc đế đinh giày hay họa tiết trang phục, đồng thời kết hợp vector nhúng ngữ nghĩa tiếng Việt từ mô tả kỹ thuật sản phẩm đưa thẳng vào nhánh hợp nhất của mạng NeuMF. Hướng đi này không chỉ cho phép tìm kiếm sản phẩm thể thao bằng hình ảnh tải lên mà còn giải quyết tận gốc bài toán khởi đầu lạnh cho các mặt hàng hoàn toàn mới vừa nhập kho chưa có bất kỳ lượt tương tác nào.
- **Kết hợp mô hình gợi ý tuần tự theo phiên:** Tích hợp thêm cơ chế tự chú ý theo chuỗi hành vi phiên truy cập để nắm bắt tức thời sự dịch chuyển nhu cầu theo mùa giải thể thao.
- **Triển khai hạ tầng đám mây và thử nghiệm phân tách trực tuyến:** Đóng gói toàn bộ hệ thống bằng công nghệ ảo hóa thùng chứa, tích hợp bộ đệm phân tán và triển khai kiểm thử đối chứng trực tuyến trên lưu lượng người dùng thực tế nhằm tối ưu hóa tự động các trọng số ngữ cảnh.

---

# TÀI LIỆU THAM KHẢO

[1] Y. Koren, R. Bell, and C. Volinsky, "Matrix Factorization Techniques for Recommender Systems," *Computer*, vol. 42, no. 8, pp. 30–37, Aug. 2009, doi: 10.1109/MC.2009.263.

[2] S. Rendle, C. Freudenthaler, Z. Gantner, and L. Schmidt-Thieme, "BPR: Bayesian Personalized Ranking from Implicit Feedback," in *Proc. 25th Conf. Uncertainty in Artificial Intelligence*, Montreal, QC, Canada, Jun. 2009, pp. 452–461.

[3] X. He, L. Liao, H. Zhang, L. Nie, X. Hu, and T.-S. Chua, "Neural Collaborative Filtering," in *Proc. 26th Int. Conf. World Wide Web*, Perth, Australia, Apr. 2017, pp. 173–182, doi: 10.1145/3038912.3052569.

[4] R. He and J. McAuley, "VBPR: Visual Bayesian Personalized Ranking from Implicit Feedback," in *Proc. 30th AAAI Conf. Artificial Intelligence*, Phoenix, AZ, USA, Feb. 2016, pp. 144–150.

[5] Nguyễn Hùng Dũng và Nguyễn Thái Nghe, "Hệ thống gợi ý sản phẩm trong bán hàng trực tuyến sử dụng kỹ thuật lọc cộng tác," *Tạp chí Khoa học Trường Đại học Cần Thơ*, số 31, tr. 36–51, 2014.

[6] Lê Huỳnh Quốc Bảo và Nguyễn Thái Nghe, "Hệ thống gợi ý sản phẩm thời trang dựa trên hình ảnh tương đồng," *Tạp chí Khoa học Trường Đại học Sư phạm Kỹ thuật Vĩnh Long*, số 9, 2024.

[7] Cục Thương mại điện tử và Kinh tế số – Bộ Công Thương, *Báo cáo Thương mại điện tử Việt Nam – Sách trắng Thương mại điện tử Việt Nam*, Nhà xuất bản Công Thương, Hà Nội, 2024.

[8] Thủ tướng Chính phủ, *Quyết định số 1189/QĐ-TTg phê duyệt Chiến lược phát triển thể dục, thể thao Việt Nam đến năm 2030, tầm nhìn đến năm 2045*, ban hành ngày 15 tháng 10 năm 2024.

[9] A. Paszke *et al.*, "PyTorch: An Imperative Style, High-Performance Deep Learning Library," in *Advances in Neural Information Processing Systems*, vol. 32, Vancouver, BC, Canada, 2019, pp. 8024–8035.

[10] S. Ramírez, "FastAPI Documentation – Modern, Fast Web Framework for Building APIs with Python," 2024. [Trực tuyến]. Địa chỉ: https://fastapi.tiangolo.com/. [Truy cập: 15/10/2026].

[11] MongoDB, Inc. and Roman Right, "MongoDB 7.0 & Beanie Asynchronous Python ODM Documentation," 2025. [Trực tuyến]. Địa chỉ: https://beanie-odm.dev/. [Truy cập: 15/10/2026].

[12] Vercel, Inc., "Next.js App Router Documentation," 2026. [Trực tuyến]. Địa chỉ: https://nextjs.org/docs. [Truy cập: 15/10/2026].

---

# PHỤ LỤC: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CHƯƠNG TRÌNH

## 1. Yêu cầu phần mềm tiên quyết

Trước khi khởi chạy hệ thống KADY Sports trên máy tính cục bộ, cần đảm bảo môi trường đã cài đặt sẵn ba nền tảng cơ bản sau:
- **Hệ quản trị cơ sở dữ liệu MongoDB Community Server:** Phiên bản `7.0` trở lên, lắng nghe kết nối mặc định tại cổng `27017` với chuỗi kết nối `mongodb://localhost:27017`.
- **Môi trường thực thi Python:** Phiên bản từ `3.10` đến `3.14` tích hợp trình quản lý gói `pip` và mô-đun môi trường ảo `venv`.
- **Môi trường thực thi Node.js:** Phiên bản `20 LTS` hoặc `22 LTS` trở lên tích hợp trình quản lý gói `npm`.

## 2. Quy trình cài đặt và khởi chạy các phân hệ

### Bước 1: Khởi động dịch vụ cơ sở dữ liệu MongoDB

Mở cửa sổ dòng lệnh Windows PowerShell với quyền Quản trị và kiểm tra hoặc khởi chạy dịch vụ MongoDB:

```powershell
# Khởi chạy dịch vụ MongoDB trên Windows
Start-Service MongoDB

# Hoặc khởi chạy trực tiếp tiến trình mongod nếu dùng thư mục dữ liệu riêng
mongod --dbpath D:\MongoDB\data
```

### Bước 2: Cài đặt và khởi chạy Máy chủ nghiệp vụ FastAPI cùng mô hình NCF

Mở cửa sổ PowerShell thứ nhất tại thư mục gốc dự án `ncf-sports-recommender`, di chuyển vào thư mục `backend/`, kích hoạt môi trường ảo và khởi chạy máy chủ tại cổng `8000`:

```powershell
cd backend

# Tạo môi trường ảo Python ở lần cài đặt đầu tiên
python -m venv venv

# Kích hoạt môi trường ảo trên Windows PowerShell
.\venv\Scripts\Activate.ps1

# Cài đặt đầy đủ các thư viện phụ thuộc FastAPI, Beanie, Motor, PyTorch
pip install -r requirements.txt

# Tùy chọn: Khởi tạo tài khoản quản trị, chuẩn hóa dữ liệu và huấn luyện lại mô hình NCF
$env:PYTHONPATH = "."
python scripts/create_admin.py
python scripts/train_ncf.py

# Khởi chạy máy chủ RESTful API và dịch vụ suy luận AI tại cổng 8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Sau khi khởi chạy thành công, có thể kiểm tra tài liệu giao diện API trực quan tại địa chỉ: `http://localhost:8000/docs`.

### Bước 3: Cài đặt và khởi chạy Giao diện ứng dụng Next.js

Mở cửa sổ PowerShell thứ hai tại thư mục gốc dự án `ncf-sports-recommender`, di chuyển vào thư mục `frontend/` và khởi chạy máy chủ giao diện tại cổng `3000`:

```powershell
cd frontend

# Cài đặt các gói thư viện giao diện ở lần đầu tiên
npm install

# Khởi chạy ứng dụng giao diện phát triển tại cổng 3000
npm run dev
```

Mở trình duyệt web và truy cập cửa hàng trực tuyến tại địa chỉ `http://localhost:3000` hoặc truy cập phân hệ Quản trị viên tại `http://localhost:3000/admin`.

## 3. Tài khoản đăng nhập dùng thử và mã khuyến mãi kiểm thử

Để thuận tiện cho việc trải nghiệm luồng gợi ý cá nhân hóa, kiểm tra lịch sử mua hàng, thử nghiệm cô lập phiên kép và vận hành bảng điều khiển quản trị, hệ thống cung cấp sẵn các tài khoản dùng thử và mã giảm giá tại (Bảng P.1).

**Bảng P.1: Danh sách tài khoản đăng nhập và mã giảm giá dùng thử hệ thống**

| Phân hệ / Loại dữ liệu | Tài khoản / Mã định danh | Mật khẩu | Đường dẫn truy cập & Ghi chú đặc trưng |
| :--- | :--- | :---: | :--- |
| **Quản trị viên hệ thống** | Tên đăng nhập: `admin` hoặc Email: `admin@kady.vn` | `admin` | Truy cập tại `http://localhost:3000/admin` – Toàn quyền quản trị kho hàng, đơn hàng, khách hàng và huấn luyện mô hình AI |
| **Khách hàng thành viên 1** | Email: `an.nguyen@gmail.com` | `password123` | Truy cập tại `http://localhost:3000/dang-nhap` – Hạng Kim Cương, Hồ sơ thể thao: *Chạy bộ, Marathon* |
| **Khách hàng thành viên 2** | Email: `mai.tran@gmail.com` | `password123` | Truy cập tại `http://localhost:3000/dang-nhap` – Hạng Vàng, Hồ sơ thể thao: *Yoga, Gym* |
| **Khách hàng thành viên 3** | Email: `nam.le@gmail.com` | `password123` | Truy cập tại `http://localhost:3000/dang-nhap` – Hạng Vàng, Hồ sơ thể thao: *Dã ngoại, Cắm trại* |
| **Mã giảm giá dùng thử** | `WELCOME50`, `FREESHIP`, `SALE50` | — | Nhập tại trang Giỏ hàng `http://localhost:3000/gio-hang` hoặc trang Thanh toán để kiểm tra khấu trừ khuyến mãi |

## 4. Hướng dẫn thao tác nhanh các tính năng trọng tâm

1. **Trải nghiệm gợi ý cá nhân hóa và Chế độ soi AI:** Đăng nhập bằng một trong các tài khoản khách hàng ở (Bảng P.1) tại `http://localhost:3000/dang-nhap`, quay về Trang chủ và bật công tắc **"Chế độ soi AI"** trên thanh đầu trang. Quan sát sự thay đổi của khối sản phẩm gợi ý theo đúng bộ môn trong Hồ sơ thể thao kèm huy hiệu phần trăm tương thích và 3 thành phần điểm số trên từng thẻ sản phẩm.
2. **Kiểm tra gợi ý tương tự và gợi ý bán kèm giỏ hàng:** Nhấp vào một sản phẩm bất kỳ như vợt Pickleball hoặc giày đá bóng để xem khối sản phẩm tương tự cùng bộ môn ở cuối trang; chọn kích cỡ, màu sắc và bấm **"Thêm vào giỏ"**, sau đó mở `http://localhost:3000/gio-hang` để quan sát 3 phụ kiện bổ trợ được đề xuất bởi thuật toán tương đồng góc Cosine 32 chiều.
3. **Giám sát thực nghiệm, huấn luyện lại mô hình NCF và xuất báo cáo:** Mở thẻ trình duyệt mới tại `http://localhost:3000/admin` và đăng nhập tài khoản `admin` / `admin` — phiên khách hàng ở thẻ bên cạnh vẫn được giữ nguyên hoàn toàn độc lập. Tại trang Tổng quan, bấm nút **"Báo cáo Thực nghiệm"** để xem biểu đồ hội tụ 20 chu kỳ và bảng đối sánh 4 phương pháp; bấm **"Huấn luyện lại mô hình"** để theo dõi tiến trình huấn luyện ngầm nạp nóng vào RAM, hoặc bấm **"Xuất báo cáo"** để tải tệp thống kê Excel `.xls`.
