from fastapi import APIRouter
from app.api.v1.endpoints import products, health, auth, interactions, orders, admin, recommendations, vouchers, reviews, uploads, banners, stores, contacts, menu, customers

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(vouchers.router, prefix="/vouchers", tags=["Vouchers"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
api_router.include_router(banners.router, prefix="/banners", tags=["Banners"])
api_router.include_router(stores.router, prefix="/stores", tags=["Stores"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(menu.router, prefix="/menu", tags=["Menu"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
