import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from beanie import PydanticObjectId
from app.models.contact import Contact
from app.models.user import User
from app.core.security import get_password_hash
from app.schemas.contact import ContactCreate

class ContactService:
    @staticmethod
    async def create_contact(contact_in: ContactCreate) -> Contact:
        contact = Contact(**contact_in.model_dump())
        await contact.insert()
        return contact

    @staticmethod
    async def subscribe_newsletter(email: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        existing = await Contact.find_one({"email": email_clean, "message": "Đăng ký nhận bản tin khuyến mãi (Newsletter)"})
        if not existing:
            newsletter_contact = Contact(
                name=email_clean.split("@")[0],
                email=email_clean,
                phone=None,
                message="Đăng ký nhận bản tin khuyến mãi (Newsletter)",
                is_resolved=False
            )
            await newsletter_contact.insert()

        # Tự động đồng bộ vào danh sách Khách hàng (User) để quản lý tập trung
        existing_user = await User.find_one(User.email == email_clean)
        if not existing_user:
            raw_username = email_clean.split("@")[0].replace(".", "_")
            check_u = await User.find_one(User.username == raw_username)
            final_username = raw_username if not check_u else f"{raw_username}_{str(uuid.uuid4())[:4]}"

            new_user = User(
                username=final_username,
                email=email_clean,
                full_name=email_clean.split("@")[0].capitalize(),
                hashed_password=get_password_hash("kady@123"),
                tier="Đồng (Mới)",
                role="user",
                interested_sports=["Bản tin Khuyến mãi"],
                ai_profile="Khách đăng ký nhận bản tin khuyến mãi qua website",
                created_at=datetime.utcnow()
            )
            await new_user.insert()

        return {
            "status": "success",
            "message": "Đăng ký nhận bản tin thành công!",
            "voucher_code": "KADY10",
            "discount_description": "Giảm ngay 10% cho đơn hàng đầu tiên"
        }

    @staticmethod
    async def get_contacts(skip: int = 0, limit: int = 100) -> List[Contact]:
        return await Contact.find_all().sort("-created_at").skip(skip).limit(limit).to_list()

    @staticmethod
    async def resolve_contact(contact_id: PydanticObjectId) -> Optional[Contact]:
        contact = await Contact.get(contact_id)
        if not contact:
            return None
        contact.is_resolved = True
        await contact.save()
        return contact

    @staticmethod
    async def delete_contact(contact_id: PydanticObjectId) -> bool:
        contact = await Contact.get(contact_id)
        if not contact:
            return False
        await contact.delete()
        return True

contact_service = ContactService()
