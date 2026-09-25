from fastapi import APIRouter
from app.api.v1.endpoints import products, health, auth, interactions, orders, admin, recommendations, vouchers

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(vouchers.router, prefix="/vouchers", tags=["Vouchers"])
