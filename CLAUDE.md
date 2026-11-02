# CLAUDE.md - AI Project Operating System (Claude Code)

> **Repository:** `ncf-sports-recommender` (KADY Sports Store & NCF Recommendation Engine)  
> **Architecture:** Decoupled Monorepo (Next.js 16 App Router Frontend + FastAPI MongoDB PyTorch Backend)  
> **Last Verified:** October 2026

---

## 1. Project Overview & Business Goals

**KADY Sports** là nền tảng thương mại điện tử chuyên đồ thể thao đa bộ môn (Bóng đá, Cầu lông, Bóng chuyền, Pickleball, Chạy bộ, Dã ngoại, Gym & Đa dụng), tích hợp hệ thống gợi ý thông minh lai (Hybrid Recommendation System):
- **Deep Learning Recommendation**: Mô hình **NCF (Neural Collaborative Filtering)** kết hợp **GMF (Generalized Matrix Factorization)** và **MLP (Multi-Layer Perceptron)** trên PyTorch.
- **Context-Aware Recommendations**: Gợi ý theo thời gian thực dựa trên giỏ hàng (Cross-sell), danh mục sản phẩm đang xem, hành vi tương tác và giải quyết bài toán Cold-Start cho khách vãng lai.
- **Storefront & Admin Management**: Quản lý toàn diện sản phẩm, biến thể, đơn hàng, khách hàng, voucher khuyến mãi, banner và huấn luyện lại (retrain) mô hình NCF.

> [!CRITICAL]
> **CẢNH BÁO KIẾN TRÚC - TRÁNH NHẦM LẪN:**  
> Các tệp cũ như `HUONG_DAN_API_NEXTJS_DRIZZLE.md` và `README1.md` là tài liệu tham khảo giáo trình ban đầu nhắc đến Drizzle/MySQL.  
> **Hệ thống thực tế 100% sử dụng:**  
> - **Backend:** **Python FastAPI** + **MongoDB (Motor / Beanie ODM)** + **PyTorch (NCF)**.  
> - **Frontend:** **Next.js 16.3+ (App Router)** + **Mantine UI v9** + **Tailwind CSS v4** + **Zustand v5**.  
> **TUYỆT ĐỐI KHÔNG** tạo bảng SQL, migration Drizzle hay code route handler Prisma/MySQL trong dự án này!

---

## 2. Technology Stack & Key Versions

| Layer | Công nghệ chính | Ghi chú & Phiên bản |
|---|---|---|
| **Frontend** | Next.js 16.3.5, React 19.2.8 | App Router (`frontend/src/app`), Server/Client Components |
| **UI System** | Tailwind CSS v4, Mantine UI v9 | `@mantine/core`, `@mantine/hooks`, `@mantine/notifications` |
| **Client State** | Zustand v5 | `cartStore.ts`, `authStore.ts`, `wishlistStore.ts` |
| **Icons & Charts** | Lucide React, React Icons, Recharts v3 | Biểu đồ doanh thu Admin, Icon điều hướng |
| **Backend API** | FastAPI 0.112+, Uvicorn 0.30+ | ASGI, Pydantic v2 Settings, Async endpoints |
| **Database** | MongoDB 7+ (Port 27017, db: `ncf_recommender_db`) | Motor 3.5+ (Async Driver), Beanie 1.26+ (Document ODM) |
| **ML Engine** | PyTorch (`torch.nn`), NumPy, Pandas | NeuMF Model (GMF 16D + MLP 16D -> 32D, MLP layers [32, 16, 8], saved_models/ncf_weights.pth) |
| **Rate Limit** | SlowAPI 0.1.10 | Bảo vệ endpoints thanh toán & đăng ký |

---

## 3. Directory Layout

```text
ncf-sports-recommender/
│
├── CLAUDE.md                   # Chỉ dẫn hoạt động chính cho Claude Code
├── AGENTS.md                   # Chỉ dẫn đồng bộ cho ChatGPT/Codex/Cursor/Antigravity
│
├── .claude/                    # AI Project Operating System configs
│   ├── settings.json           # Permissions, environment conventions
│   ├── commands/               # Custom commands (/analyze, /plan, /review, /document)
│   ├── skills/                 # Reusable workflow skills
│   ├── hooks/                  # Quality & validation hooks
│   ├── plans/                  # Implementation plans & templates
│   ├── reference/              # Technical reference docs (Architecture, API, Schema)
│   └── rules/                  # Mandatory system rules (Code style, Security, etc.)
│
├── backend/                    # FastAPI Backend Service
│   ├── app/
│   │   ├── api/v1/             # Endpoints: products, recommendations, orders, auth...
│   │   ├── core/               # config, database connection, limiter
│   │   ├── ml/                 # ncf_model.py, saved_models/ncf_weights.pth, training_metrics.json
│   │   ├── models/             # Beanie Document Models (Product, User, Order, Review...)
│   │   ├── schemas/            # Pydantic Schemas (Request/Response)
│   │   └── services/           # RecommendationService, OrderService, AuthService...
│   ├── scripts/                # train_ncf.py, seed_master.py, verify_catalog_quality.py
│   ├── venv/                   # Python Virtual Environment
│   └── requirements.txt        # Backend dependencies
│
├── frontend/                   # Next.js 16 Frontend Service
│   ├── src/
│   │   ├── app/                # Next.js App Router ((public), admin, layout, page)
│   │   ├── modules/            # Clean Modular Domain code
│   │   │   ├── public/         # trang-chu, san-pham, gio-hang, thanh-toan, goi-y...
│   │   │   ├── admin/          # tong-quan, san-pham, don-hang, khach-hang, banner...
│   │   │   └── user/           # dashboard, orders, wishlist, recommendations...
│   │   └── shared/             # Shared stores, components, lib, types
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.ts      # Tailwind configuration
│
└── docs/                       # Project documentation & thesis specifications
    ├── architecture/           # System design & component interaction
    ├── design/                 # UI/UX design tokens & wireframes
    ├── requirements/           # Functional specifications & thesis scope
    └── guides/                 # Development setup & maintenance guides
```

---

## 4. Development Commands

### Backend Commands (chạy trong thư mục `backend/`)
```bash
# Kích hoạt venv (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server FastAPI (Port 8000)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Huấn luyện lại mô hình NCF
python scripts/train_ncf.py

# Kiểm tra chất lượng dữ liệu & catalog
python scripts/verify_catalog_quality.py
```

### Frontend Commands (chạy trong thư mục `frontend/`)
```bash
# Cài đặt dependencies
npm install

# Chạy dev server (Port 3000)
npm run dev

# Kiểm tra lỗi TypeScript & Linter
npm run lint

# Build production bundle
npm run build
```

---

## 5. Core Architectural Rules & Conventions

1. **Next.js 16 Compliance**:
   - `params` và `searchParams` trong Page/Layout là **Async Promises**. Luôn `await props.params` hoặc dùng `React.use()`.
   - Giữ Server Component làm mặc định. Chỉ thêm `'use client'` khi có tương tác (state, effects, browser APIs).
   - Tuyệt đối không xóa block `<!-- BEGIN:nextjs-agent-rules -->` trong `AGENTS.md`.

2. **Backend Clean Architecture**:
   - Tách biệt rõ 3 lớp: `Endpoint (Route)` $\rightarrow$ `Service (Business Logic)` $\rightarrow$ `Model (Database Interaction)`.
   - Mọi truy vấn MongoDB phải đi qua Beanie Documents (`Product`, `User`, `Order`, `Review`, `Voucher`).
   - Mọi endpoint mới phải được đăng ký vào [`app/api/v1/router.py`](file:///d:/Projects/ncf-sports-recommender/backend/app/api/v1/router.py).

3. **Recommendation Pipeline Integrity**:
   - Mô hình NCF tính toán tương đồng Cosine trên vector nhúng kết hợp (32 chiều = 16 GMF + 16 MLP).
   - Mọi danh sách trả về (`recommendations/`, `cross-sell/`) **BẮT BUỘC** phải đi qua bộ lọc `_filter_duplicate_recs` để không trùng ảnh và không trùng tên sản phẩm gốc.

4. **UI/UX & Image Safety**:
   - Tất cả thẻ `<img>` phải có fallback `onError` về ảnh thể thao hợp lệ, không để xuất hiện icon ảnh vỡ trên giao diện.
   - Giữ phong cách hiện đại, chỉn chu, phù hợp với tiêu chuẩn đồ án tốt nghiệp cử nhân CNTT.

---

## 6. How AI Agents Must Execute Work

Mọi thao tác sửa đổi tính năng phức tạp cần tuân theo quy trình chuẩn:
1. **Phân tích (Analyze)**: Tra cứu quy chuẩn tại `.claude/rules/` và tài liệu tại `.claude/reference/`.
2. **Lập kế hoạch (Plan)**: Với thay đổi lớn, tạo bản nháp kế hoạch theo mẫu tại `.claude/plans/templates/feature-plan.md`.
3. **Thực thi (Implement)**: Chỉ sửa đúng phạm vi yêu cầu, không tự ý refactor code không liên quan.
4. **Kiểm thử (Verify)**: Kiểm tra thực tế bằng lệnh test/scripts hoặc curl endpoint trước khi hoàn tất.
5. **Cập nhật tài liệu (Document)**: Giữ `CLAUDE.md`, `AGENTS.md` và `docs/` đồng bộ với code thực tế.

---

## 7. AI Operating System Directory Links

- **Commands:** [Commands Index](file:///d:/Projects/ncf-sports-recommender/.claude/commands/README.md) (`/analyze`, `/plan`, `/review`, `/document`)
- **Skills:** [Skills Index](file:///d:/Projects/ncf-sports-recommender/.claude/skills/README.md)
- **Rules:** [Architecture Rules](file:///d:/Projects/ncf-sports-recommender/.claude/rules/architecture.md) | [Code Style](file:///d:/Projects/ncf-sports-recommender/.claude/rules/code-style.md) | [Security](file:///d:/Projects/ncf-sports-recommender/.claude/rules/security.md)
- **References:** [API Contracts](file:///d:/Projects/ncf-sports-recommender/.claude/reference/api-contracts.md) | [DB Schema](file:///d:/Projects/ncf-sports-recommender/.claude/reference/database-schema.md) | [NCF Pipeline](file:///d:/Projects/ncf-sports-recommender/.claude/reference/recommendation-pipeline.md)
