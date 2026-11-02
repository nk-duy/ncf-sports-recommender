# Quality & Automation Hooks

Thư mục chứa các kịch bản kiểm tra tự động (Automated Verification Scripts) được kích hoạt trước hoặc sau các thao tác triển khai mã nguồn.

| Hook Script | Ngôn ngữ | Mục đích | Cách gọi |
|---|---|---|---|
| `verify-links.py` | Python 3 | Quét toàn bộ file markdown để phát hiện link file bị vỡ hoặc không tồn tại | `python .claude/hooks/verify-links.py` |
| `format-check.py` | Python 3 | Kiểm tra nhanh cú pháp JSON, Python compilation và cấu trúc Next.js 16 | `python .claude/hooks/format-check.py` |

---

## Nguyên tắc An toàn của Hooks (Safety Principles)

1. **Không tự động triển khai production:** Hooks chỉ chạy kiểm tra cục bộ (local validation).
2. **Không tự động xóa dữ liệu:** Tuyệt đối không chứa lệnh `drop_database`, `delete_many({})` hoặc `rm -rf`.
3. **Không tạo vòng lặp vô hạn:** Hooks là các script chạy một lần (run-to-completion) với timeout rõ ràng.
4. **Nhẹ và nhanh:** Không tự động chạy toàn bộ test suite hoặc re-train mô hình NCF sau mỗi sửa đổi nhỏ.
5. **Tương thích hệ điều hành:** Hoạt động ổn định trên cả Windows PowerShell và Linux/macOS.
