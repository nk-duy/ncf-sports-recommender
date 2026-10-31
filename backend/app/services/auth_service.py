import uuid
from typing import Optional, Dict, Any
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    @staticmethod
    async def get_user_by_username(username: str) -> Optional[User]:
        return await User.find_one(User.username == username)

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    @staticmethod
    async def register_user(user_in: UserCreate) -> User:
        user_db = User(
            username=user_in.username,
            email=user_in.email,
            full_name=user_in.full_name,
            phone=user_in.phone.strip() if user_in.phone else None,
            hashed_password=get_password_hash(user_in.password),
            interested_sports=getattr(user_in, 'interested_sports', None) or [],
        )
        await user_db.insert()
        return user_db

    @staticmethod
    async def authenticate_user(form_data: OAuth2PasswordRequestForm) -> Optional[User]:
        identifier = (form_data.username or "").strip()
        if not identifier:
            return None
        # Cho phép đăng nhập bằng cả tên tài khoản (username) hoặc địa chỉ email
        user = await User.find_one({
            "$or": [
                {"username": identifier},
                {"email": identifier.lower()},
                {"email": identifier}
            ]
        })
        if not user or not verify_password(form_data.password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_token(username: str) -> str:
        return create_access_token(data={"username": username})

    @staticmethod
    async def handle_social_login(
        email: str, 
        full_name: Optional[str] = None,
        interested_sports: Optional[list[str]] = None
    ) -> User:
        user = await AuthService.get_user_by_email(email)
        if not user:
            random_password = str(uuid.uuid4())
            base_username = email.split('@')[0]
            existing_user = await AuthService.get_user_by_username(base_username)
            username = base_username if not existing_user else f"{base_username}_{str(uuid.uuid4())[:8]}"
            
            user_in = UserCreate(
                username=username,
                email=email,
                password=random_password,
                full_name=full_name or base_username,
                interested_sports=interested_sports or []
            )
            user = await AuthService.register_user(user_in)
        else:
            if interested_sports and not user.interested_sports:
                user.interested_sports = interested_sports
                await user.save()
        return user

    @staticmethod
    async def update_user_profile(user: User, user_update: UserUpdate) -> User:
        if user_update.full_name is not None:
            user.full_name = user_update.full_name
        if user_update.phone is not None:
            user.phone = user_update.phone
        if user_update.address is not None:
            user.address = user_update.address
        if user_update.interested_sports is not None:
            user.interested_sports = user_update.interested_sports
        if user_update.shoe_size is not None:
            user.shoe_size = user_update.shoe_size
        if user_update.apparel_size is not None:
            user.apparel_size = user_update.apparel_size
        if user_update.preferred_colors is not None:
            user.preferred_colors = user_update.preferred_colors
        if user_update.wishlist is not None:
            user.wishlist = user_update.wishlist
        if user_update.is_2fa_enabled is not None:
            user.is_2fa_enabled = user_update.is_2fa_enabled
        if user_update.email_notifications is not None:
            user.email_notifications = user_update.email_notifications
        
        await user.save()
        return user

    @staticmethod
    async def get_user_stats(user: User):
        from app.models.order import Order
        from app.services.customer_service import calculate_tier, CANCELLED_STATUSES
        uid_str = str(user.id)
        conds = [{"user_id": uid_str}]
        if user.phone:
            conds.append({"customer_phone": user.phone})
        if user.email:
            conds.append({"customer_email": user.email})
        
        try:
            orders = await Order.find({"$or": conds}).to_list()
            valid_orders = [o for o in orders if (o.status or "").lower() not in CANCELLED_STATUSES]
            total_spent = sum(o.total_amount for o in valid_orders)
            loyalty_points = int(total_spent // 10000)
            tier = calculate_tier(total_spent)
            
            if user.tier != tier:
                user.tier = tier
                await user.save()
            return total_spent, loyalty_points, tier
        except Exception:
            return 0.0, 0, user.tier or "Đồng"

    @staticmethod
    async def to_user_response(user: User, total_spent: Optional[float] = None, loyalty_points: Optional[int] = None) -> UserResponse:
        tier = user.tier or "Đồng"
        if total_spent is None or loyalty_points is None:
            total_spent, loyalty_points, tier = await AuthService.get_user_stats(user)

        return UserResponse(
            id=str(user.id),
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            address=user.address,
            tier=tier,
            total_spent=total_spent,
            loyalty_points=loyalty_points,
            interested_sports=user.interested_sports or [],
            shoe_size=user.shoe_size,
            apparel_size=user.apparel_size,
            preferred_colors=user.preferred_colors or [],
            wishlist=getattr(user, "wishlist", []) or [],
            is_2fa_enabled=getattr(user, "is_2fa_enabled", False),
            email_notifications=getattr(user, "email_notifications", True),
            is_active=user.is_active,
            role=user.role,
            created_at=user.created_at
        )

    @staticmethod
    async def reset_password_by_email(email: str, new_password: str) -> None:
        """Khôi phục và đặt lại mật khẩu mới cho người dùng qua email đăng ký"""
        clean_email = email.strip().lower()
        user = await User.find_one({"email": {"$regex": f"^{clean_email}$", "$options": "i"}})
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Địa chỉ email này chưa được đăng ký trong hệ thống KADY Sports."
            )
        if len(new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Mật khẩu mới phải có tối thiểu 6 ký tự."
            )
        from app.core.security import get_password_hash
        user.hashed_password = get_password_hash(new_password)
        await user.save()

    @staticmethod
    async def change_user_password(user: User, old_password: str, new_password: str) -> None:
        """Đổi mật khẩu tài khoản đang đăng nhập"""
        from app.core.security import get_password_hash, verify_password
        if not verify_password(old_password, user.hashed_password):
            raise HTTPException(
                status_code=400,
                detail="Mật khẩu hiện tại không chính xác."
            )
        if len(new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Mật khẩu mới phải có tối thiểu 6 ký tự."
            )
        user.hashed_password = get_password_hash(new_password)
        await user.save()

auth_service = AuthService()
