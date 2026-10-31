"""
Business Logic & Service Layer for KADY Sports Recommender System.
Exports centralized service instances for API endpoints and background tasks.
"""

from app.services.admin_service import AdminService, admin_service
from app.services.analytics_service import AnalyticsService
from app.services.attribute_service import AttributeService, attribute_service
from app.services.auth_service import AuthService, auth_service
from app.services.banner_service import BannerService, banner_service
from app.services.customer_service import CustomerService, customer_service
from app.services.interaction_service import InteractionService, interaction_service
from app.services.order_service import OrderService, order_service
from app.services.product_service import ProductService, product_service
from app.services.recommendation_service import RecommendationService, recommendation_service
from app.services.review_service import ReviewService, review_service

__all__ = [
    "AdminService",
    "admin_service",
    "AnalyticsService",
    "AttributeService",
    "attribute_service",
    "AuthService",
    "auth_service",
    "BannerService",
    "banner_service",
    "CustomerService",
    "customer_service",
    "InteractionService",
    "interaction_service",
    "OrderService",
    "order_service",
    "ProductService",
    "product_service",
    "RecommendationService",
    "recommendation_service",
    "ReviewService",
    "review_service",
]
