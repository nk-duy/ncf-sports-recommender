import hashlib
import hmac
import re
import secrets
import time
import uuid
from typing import Optional, Dict, Any, Tuple
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.cache import fast_cache
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.email_service import email_service

OTP_TTL_SECONDS = 300
OTP_MAX_ATTEMPTS = 5


class AuthService:
    @staticmethod
    def _otp_cache_key(email: str) -> str:
        return f"auth_otp:{email.strip().lower()}"

    @staticmethod
    def _hash_otp(email: str, otp: str) -> str:
        payload = f"{email.strip().lower()}:{otp.strip()}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    @staticmethod
    async def get_user_by_username(username: str) -> Optional[User]:
        return await User.find_one(User.username == username)

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    @staticmethod
    async def get_user_by_email_insensitive(email: str) -> Optional[User]:
        clean_email = email.strip().lower()
        return await User.find_one({"email": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"}})

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
    async def _upsert_customer_by_email(
        email: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[list[str]] = None,
        overwrite_sports: bool = False,
    ) -> User:
        clean_email = email.strip().lower()
        user = await AuthService.get_user_by_email_insensitive(clean_email)
        if user and getattr(user, "role", "user") == "admin":
            raise HTTPException(
                status_code=403,
                detail="Tài khoản Quản trị viên bắt buộc đăng nhập bằng tên đăng nhập và mật khẩu.",
            )

        clean_name = (full_name or "").strip() or None
        clean_sports = [s.strip() for s in (interested_sports or []) if s and s.strip()]

        if not user:
            random_password = str(uuid.uuid4())
            base_username = clean_email.split('@')[0]
            existing_user = await AuthService.get_user_by_username(base_username)
            username = base_username if not existing_user else f"{base_username}_{str(uuid.uuid4())[:8]}"

            user_in = UserCreate(
                username=username,
                email=clean_email,
                password=random_password,
                full_name=clean_name or base_username,
                interested_sports=clean_sports,
            )
            user = await AuthService.register_user(user_in)
        else:
            changed = False
            if clean_name and not user.full_name:
                user.full_name = clean_name
                changed = True
            if clean_sports and (overwrite_sports or not user.interested_sports):
                user.interested_sports = clean_sports
                changed = True
            if changed:
                await user.save()
        return user

    @staticmethod
    async def handle_social_login(
        email: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[list[str]] = None
    ) -> User:
        return await AuthService._upsert_customer_by_email(
            email=email,
            full_name=full_name,
            interested_sports=interested_sports,
            overwrite_sports=False,
        )

    @staticmethod
    async def request_email_otp(
        email: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[list[str]] = None,
    ) -> Dict[str, Any]:
        """Sinh mã OTP 6 chữ số (hết hạn sau 5 phút) và gửi qua Email SMTP"""
        clean_email = email.strip().lower()
        existing = await AuthService.get_user_by_email_insensitive(clean_email)
        if existing and getattr(existing, "role", "user") == "admin":
            raise HTTPException(
                status_code=403,
                detail="Tài khoản Quản trị viên bắt buộc đăng nhập bằng tên đăng nhập và mật khẩu.",
            )

        otp_code = f"{secrets.randbelow(1000000):06d}"
        cache_key = AuthService._otp_cache_key(clean_email)
        clean_name = (full_name or "").strip() or None
        clean_sports = [s.strip() for s in (interested_sports or []) if s and s.strip()]

        await fast_cache.set(
            cache_key,
            {
                "otp_hash": AuthService._hash_otp(clean_email, otp_code),
                "email": clean_email,
                "full_name": clean_name,
                "interested_sports": clean_sports,
                "attempts": 0,
                "expires_at": time.time() + OTP_TTL_SECONDS,
            },
            ttl=OTP_TTL_SECONDS,
        )

        email_sent, smtp_error = await email_service.send_otp_email(
            recipient_email=clean_email,
            otp_code=otp_code,
            full_name=clean_name,
        )

        if smtp_error:
            await fast_cache.delete(cache_key)
            raise HTTPException(
                status_code=502,
                detail="Không thể gửi email xác thực qua Gmail SMTP. Vui lòng kiểm tra cấu hình SMTP_EMAIL / SMTP_APP_PASSWORD hoặc kết nối mạng.",
            )

        if not email_sent:
            print(f"[AuthService][OFFLINE OTP] Email: {clean_email} | OTP: {otp_code} (Hết hạn sau 5 phút)")
            return {
                "status": "success",
                "message": f"Chế độ demo offline: Đã tạo mã xác nhận cho hộp thư {clean_email} (hết hạn sau 5 phút).",
                "email": clean_email,
                "expires_in_seconds": OTP_TTL_SECONDS,
                "email_sent": False,
                "dev_otp": otp_code,
            }

        return {
            "status": "success",
            "message": f"Đã gửi mã xác nhận đến hộp thư {clean_email}. Mã có hiệu lực trong 5 phút.",
            "email": clean_email,
            "expires_in_seconds": OTP_TTL_SECONDS,
            "email_sent": True,
            "dev_otp": None,
        }

    @staticmethod
    async def verify_email_otp(
        email: str,
        otp: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[list[str]] = None,
    ) -> Tuple[User, str]:
        """Xác thực mã OTP 6 chữ số, tạo/cập nhật user MongoDB và cấp JWT access_token"""
        clean_email = email.strip().lower()
        clean_otp = (otp or "").strip()
        if len(clean_otp) != 6 or not clean_otp.isdigit():
            raise HTTPException(
                status_code=400,
                detail="Mã xác nhận OTP phải gồm đúng 6 chữ số.",
            )

        cache_key = AuthService._otp_cache_key(clean_email)
        otp_record = await fast_cache.get(cache_key)
        if not otp_record:
            raise HTTPException(
                status_code=400,
                detail="Mã OTP không tồn tại hoặc đã hết hạn sau 5 phút. Vui lòng yêu cầu gửi lại mã mới.",
            )

        provided_hash = AuthService._hash_otp(clean_email, clean_otp)
        if not hmac.compare_digest(otp_record["otp_hash"], provided_hash):
            attempts = int(otp_record.get("attempts", 0)) + 1
            if attempts >= OTP_MAX_ATTEMPTS:
                await fast_cache.delete(cache_key)
                raise HTTPException(
                    status_code=400,
                    detail="Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng yêu cầu gửi lại mã mới.",
                )

            remaining_ttl = max(1, int(otp_record.get("expires_at", time.time() + 60) - time.time()))
            otp_record["attempts"] = attempts
            await fast_cache.set(cache_key, otp_record, ttl=remaining_ttl)
            raise HTTPException(
                status_code=400,
                detail=f"Mã xác nhận OTP không chính xác (còn {OTP_MAX_ATTEMPTS - attempts} lần thử).",
            )

        await fast_cache.delete(cache_key)

        resolved_name = (full_name or "").strip() or otp_record.get("full_name")
        resolved_sports = (
            interested_sports
            if interested_sports is not None and len(interested_sports) > 0
            else otp_record.get("interested_sports", [])
        )

        user = await AuthService._upsert_customer_by_email(
            email=clean_email,
            full_name=resolved_name,
            interested_sports=resolved_sports,
            overwrite_sports=True,
        )
        access_token = AuthService.create_token(user.username)
        return user, access_token

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
