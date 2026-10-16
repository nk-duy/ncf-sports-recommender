import uuid
from typing import Optional, Dict, Any
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
            hashed_password=get_password_hash(user_in.password),
        )
        await user_db.insert()
        return user_db

    @staticmethod
    async def authenticate_user(form_data: OAuth2PasswordRequestForm) -> Optional[User]:
        user = await User.find_one(User.username == form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_token(username: str) -> str:
        return create_access_token(data={"username": username})

    @staticmethod
    async def handle_social_login(email: str, full_name: Optional[str] = None) -> User:
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
                full_name=full_name or base_username
            )
            user = await AuthService.register_user(user_in)
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
        if user_update.preferred_colors is not None:
            user.preferred_colors = user_update.preferred_colors
        
        await user.save()
        return user

    @staticmethod
    def to_user_response(user: User) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            address=user.address,
            tier=user.tier or "Đồng",
            interested_sports=user.interested_sports or [],
            shoe_size=user.shoe_size,
            preferred_colors=user.preferred_colors or [],
            is_active=user.is_active,
            role=user.role,
            created_at=user.created_at
        )

auth_service = AuthService()
