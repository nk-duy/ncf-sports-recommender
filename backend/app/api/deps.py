from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from app.core.config import settings
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
        
    user = await User.find_one(User.username == username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

async def get_current_user_optional(token: str = Depends(oauth2_scheme_optional)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            return None
    except InvalidTokenError:
        return None
        
    user = await User.find_one(User.username == username)
    return user
