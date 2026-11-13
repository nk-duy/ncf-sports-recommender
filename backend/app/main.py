import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.database import init_db
from app.core.limiter import limiter, rate_limit_exceeded_handler
from app.api.v1.router import api_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kady_sports")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to database
    await init_db()
    logger.info("Successfully connected to MongoDB.")

    # Warm load mô hình NCF, Vector nhúng Item 32D và Đặc trưng Hình ảnh 48D vào bộ nhớ RAM ngay khi khởi động
    try:
        from app.services.recommendation_service import recommendation_service
        from app.services.visual_search_service import visual_search_service
        is_loaded = recommendation_service._load_model()
        if is_loaded:
            logger.info("Mô hình NCF và Pre-computed Item Embeddings 32D đã được nạp nóng (Warm Load) vào RAM thành công.")
        else:
            logger.warning("Không tìm thấy trọng số ncf_weights.pth hoặc mappings.json khi nạp nóng mô hình NCF.")

        vis_count = visual_search_service.load_visual_features()
        recommendation_service._load_visual_features()
        logger.info(f"Đã nạp nóng {vis_count} vector đặc trưng hình ảnh 48D từ visual_features.json vào RAM.")
    except Exception as e:
        logger.error(f"Lỗi khi nạp nóng mô hình NCF / Visual Features trong lifespan startup: {e}", exc_info=True)

    yield
    # Shutdown: cleanup resources if needed
    logger.info("Shutting down and cleaning up resources.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Register SlowAPI Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount static files directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
