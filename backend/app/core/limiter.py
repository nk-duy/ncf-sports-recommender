from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

# Khởi tạo bộ giới hạn tốc độ (Rate Limiter) dựa trên IP của client
# Đặt headers_enabled=False để tương thích linh hoạt với mọi FastAPI endpoints
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["120/minute"],
    headers_enabled=False
)

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Xử lý phản hồi lỗi chuẩn khi client gửi quá số lượng request cho phép trong khoảng thời gian nhất định (HTTP 429).
    """
    return JSONResponse(
        status_code=429,
        content={
            "detail": f"Bạn đã gửi quá nhiều yêu cầu ({exc.detail}). Vui lòng đợi và thử lại sau ít phút.",
            "error": "rate_limit_exceeded"
        }
    )
