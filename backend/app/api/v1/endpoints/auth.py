from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserResponse, Token, SocialLoginRequest
from app.services.auth_service import auth_service
from app.api.deps import get_current_active_user
from app.models.user import User
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    # Kiểm tra user đã tồn tại chưa
    user = await auth_service.get_user_by_username(user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = await auth_service.get_user_by_email(user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
        
    # Tạo user mới
    user_db = await auth_service.register_user(user_in)
    
    # Tạo response (Beanie trả id dạng ObjectId, cần đổi sang str)
    return UserResponse(
        id=str(user_db.id),
        username=user_db.username,
        email=user_db.email,
        full_name=user_db.full_name,
        is_active=user_db.is_active,
        role=user_db.role,
        created_at=user_db.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await auth_service.authenticate_user(form_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = auth_service.create_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return UserResponse(
        id=str(current_user.id),
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        role=current_user.role,
        created_at=current_user.created_at
    )

@router.post("/social-login", response_model=Token)
async def social_login(req: SocialLoginRequest):
    # This is a mocked social login that skips real Firebase Token validation for demo purposes.
    # In a real app, you would use firebase_admin.auth.verify_id_token(req.token) here.
    
    # Check if user with this email exists
    user = await auth_service.get_user_by_email(req.email)
    
    if not user:
        # If user doesn't exist, create a new one automatically
        # Generate a random password since they use social login
        random_password = str(uuid.uuid4())
        # Use email prefix as username if possible, or a random one
        base_username = req.email.split('@')[0]
        
        # Check if username exists, if so append random str
        existing_user = await auth_service.get_user_by_username(base_username)
        username = base_username if not existing_user else f"{base_username}_{str(uuid.uuid4())[:8]}"
        
        user_in = UserCreate(
            username=username,
            email=req.email,
            password=random_password,
            full_name=req.full_name or base_username
        )
        user = await auth_service.register_user(user_in)
        
    access_token = auth_service.create_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}
