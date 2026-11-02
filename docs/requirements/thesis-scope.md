# Thesis Scope & Functional Specifications

> **Tên đề tài:** Xây dựng hệ thống gợi ý sản phẩm thể thao thông minh ứng dụng mạng nơ-ron lọc cộng tác (Neural Collaborative Filtering)  
> **Sinh viên thực hiện:** Thạch Lý Na (MSSV: B2205891)  
> **Nền tảng thương mại:** KADY Sports

---

## 1. Mục tiêu Nghiên cứu & Phạm vi Đề tài

### A. Mục tiêu Nghiên cứu
1. Nghiên cứu lý thuyết về các hệ thống gợi ý truyền thống (Content-based, Matrix Factorization) và các hạn chế liên quan đến tính phi tuyến.
2. Ứng dụng mô hình **Neural Collaborative Filtering (NCF)** kết hợp **Generalized Matrix Factorization (GMF)** và **Multi-Layer Perceptron (MLP)** để học tương tác phức tạp giữa người dùng và sản phẩm thể thao.
3. Thiết kế giải pháp gợi ý lai (Hybrid Recommender) nhằm khắc phục bài toán khởi đầu lạnh (Cold-Start Problem) khi khách hàng chưa đăng nhập hoặc chưa có dữ liệu tương tác.
4. Xây dựng một ứng dụng web thương mại điện tử hoàn chỉnh, trực quan, hỗ trợ khách hàng mua sắm và quản trị viên quản lý kho, đơn hàng và huấn luyện lại mô hình.

### B. Phạm vi Hệ thống (System Scope)
- **Các môn thể thao hỗ trợ:** 7 bộ môn chính (Bóng đá, Cầu lông, Bóng chuyền, Pickleball, Chạy bộ, Dã ngoại, Gym & Đa dụng).
- **Phân loại sản phẩm:** Giày, Trang phục, Dụng cụ, Thiết bị, Phụ kiện thi đấu.
- **Tập tương tác huấn luyện:** Lịch sử xem sản phẩm, lượt đánh giá (Rating 1-5 sao), lượt thêm vào giỏ hàng và đơn hàng đã hoàn tất.

---

## 2. Tiêu chuẩn Đánh giá Mô hình Gợi ý (Evaluation Metrics)

Hệ thống đánh giá hiệu năng mô hình NCF dựa trên hai độ đo tiêu chuẩn trong nghiên cứu Recommender Systems:

1. **Hit Rate @ K (HR@K):**  
   Tỷ lệ phần trăm các trường hợp mà sản phẩm thực tế khách hàng quan tâm xuất hiện trong danh sách Top-K sản phẩm được hệ thống gợi ý.
   $$\text{HR@K} = \frac{\text{Số lượt gợi ý thành công}}{\text{Tổng số lượt kiểm thử}}$$

2. **Normalized Discounted Cumulative Gain @ K (NDCG@K):**  
   Độ đo đánh giá chất lượng xếp hạng của danh sách gợi ý, gán trọng số cao hơn cho các sản phẩm phù hợp xuất hiện ở những vị trí đầu tiên của danh sách.

Các chỉ số này được tính toán tự động trong quá trình huấn luyện tại [`backend/scripts/train_ncf.py`](file:///d:/Projects/ncf-sports-recommender/backend/scripts/train_ncf.py) và hiển thị trực tiếp trên Dashboard của quản trị viên.
