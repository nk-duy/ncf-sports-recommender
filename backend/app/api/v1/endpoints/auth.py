from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.auth_service import auth_service

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
