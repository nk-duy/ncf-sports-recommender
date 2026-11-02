# Development Workflow & Operations Guide

Hướng dẫn chi tiết dành cho nhà phát triển để cài đặt, vận hành và đóng góp vào dự án KADY Sports Recommender.

---

## 1. Yêu cầu Môi trường (Prerequisites)
- **Node.js:** Phiên bản 20.x hoặc 22.x LTS.
- **Python:** Phiên bản 3.10, 3.11 hoặc 3.12/3.14 (Khuyến nghị dùng virtual environment `backend/venv`).
- **MongoDB:** Phiên bản 7.0+ đang chạy cục bộ tại `mongodb://localhost:27017` hoặc qua MongoDB Atlas.
- **Hệ điều hành:** Windows 10/11 (PowerShell) hoặc macOS/Linux.

---

## 2. Thiết lập Môi trường Ban đầu (First-Time Setup)

### Bước 1: Khởi động MongoDB
Đảm bảo MongoDB service đã được bật:
```powershell
# Kiểm tra dịch vụ MongoDB trên Windows
Get-Service -Name MongoDB
```

### Bước 2: Cấu hình và Chạy Backend
```powershell
cd d:\Projects\ncf-sports-recommender\backend

# Tạo và kích hoạt virtual environment nếu chưa có
python -m venv venv
.\venv\Scripts\Activate.ps1

# Cài đặt thư viện
pip install -r requirements.txt

# Khởi chạy server FastAPI ở chế độ auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Kiểm tra Swagger API Docs tại: `http://localhost:8000/docs`.*

### Bước 3: Cấu hình và Chạy Frontend
```powershell
cd d:\Projects\ncf-sports-recommender\frontend

# Cài đặt packages
npm install

# Khởi chạy dev server Next.js 16
npm run dev
```
*Truy cập ứng dụng tại: `http://localhost:3000`.*

---

## 3. Huấn luyện lại Mô hình Gợi ý NCF (Model Retraining)

Khi có tập tương tác mới trong collection `interactions` hoặc sau khi cập nhật danh mục:
```powershell
cd d:\Projects\ncf-sports-recommender\backend
.\venv\Scripts\Activate.ps1

# Chạy kịch bản huấn luyện NCF
python scripts/train_ncf.py
```
Kịch bản sẽ:
1. Đọc toàn bộ tương tác người dùng - sản phẩm từ MongoDB.
2. Xây dựng ma trận tương tác và đánh chỉ số (user_to_index, item_to_index).
3. Khởi tạo mô hình NCF và huấn luyện qua các epoch với hàm mất mát Binary Cross-Entropy.
4. Xuất trọng số mô hình vào `app/ml/saved_models/ncf_weights.pth`, ánh xạ `mappings.json` và lưu trữ chỉ số huấn luyện vào `app/ml/training_metrics.json`.
5. Tự động đánh giá mô hình bằng giao thức Leave-One-Out (với 99 mẫu âm) cập nhật metric Hit Ratio (HR@8) và NDCG@8.

---

## 4. Quy trình Đóng góp & Kiểm soát Chất lượng (Quality Control)

Mọi thay đổi trước khi commit hoặc merge cần tuân thủ quy trình kiểm tra:

```bash
# 1. Kiểm tra tính hợp lệ của tài liệu và links
python .claude/hooks/verify-links.py

# 2. Kiểm tra cú pháp và compilation
python .claude/hooks/format-check.py

# 3. Kiểm tra linter phía frontend
cd frontend
npm run lint
```
