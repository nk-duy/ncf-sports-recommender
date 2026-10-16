from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserResponse, UserUpdate, Token, SocialLoginRequest
from app.services.auth_service import auth_service
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.limiter import limiter

router = APIRouter()

@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
async def register(request: Request, user_in: UserCreate):
    """Đăng ký tài khoản người dùng mới (Giới hạn 5 req/phút chống bot spam)"""
    user = await auth_service.get_user_by_username(user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Tên người dùng đã tồn tại trên hệ thống.",
        )
    user = await auth_service.get_user_by_email(user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Địa chỉ email đã được đăng ký trên hệ thống.",
        )
        
    user_db = await auth_service.register_user(user_in)
    return auth_service.to_user_response(user_db)

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    """Đăng nhập bằng tài khoản và mật khẩu (Giới hạn 10 req/phút chống dò mật khẩu brute-force)"""
    user = await auth_service.authenticate_user(form_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = auth_service.create_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Lấy thông tin cá nhân của người dùng hiện tại"""
    return auth_service.to_user_response(current_user)

@router.put("/me", response_model=UserResponse)
async def update_users_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Cập nhật thông tin hồ sơ và sở thích thể thao của người dùng hiện tại"""
    updated_user = await auth_service.update_user_profile(current_user, user_update)
    return auth_service.to_user_response(updated_user)

@router.post("/social-login", response_model=Token)
@limiter.limit("10/minute")
async def social_login(request: Request, req: SocialLoginRequest):
    """Đăng nhập bằng tài khoản mạng xã hội (Google / Facebook / Firebase)"""
    user = await auth_service.handle_social_login(req.email, req.full_name)
    access_token = auth_service.create_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}
