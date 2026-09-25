from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional, Dict, Any

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

auth_service = AuthService()
