from fastapi import APIRouter, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(contact_in: ContactCreate):
    """
    Tạo mới một liên hệ (Gửi tin nhắn từ form Liên hệ)
    """
    contact = Contact(**contact_in.model_dump())
    await contact.insert()
    
    # Return response mapped from beanie Document
    return ContactResponse(
        id=str(contact.id),
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        message=contact.message,
        is_resolved=contact.is_resolved,
        created_at=contact.created_at
    )

@router.post("/newsletter", status_code=status.HTTP_201_CREATED)
async def subscribe_newsletter(payload: dict):
    """
    Đăng ký nhận bản tin khuyến mãi từ popup hoặc footer
    """
    email = payload.get("email", "").strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Email không hợp lệ")

    existing = await Contact.find_one({"email": email, "message": "Đăng ký nhận bản tin khuyến mãi (Newsletter)"})
    if not existing:
        newsletter_contact = Contact(
            name=email.split("@")[0],
            email=email,
            phone=None,
            message="Đăng ký nhận bản tin khuyến mãi (Newsletter)",
            is_resolved=False
        )
        await newsletter_contact.insert()

    return {
        "status": "success",
        "message": "Đăng ký nhận bản tin thành công!",
        "voucher_code": "KADY10",
        "discount_description": "Giảm ngay 10% cho đơn hàng đầu tiên"
    }

@router.get("/", response_model=List[ContactResponse])
async def get_contacts(skip: int = 0, limit: int = 100):
    """
    Lấy danh sách các liên hệ (Dành cho Admin)
    """
    contacts = await Contact.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
    
    return [
        ContactResponse(
            id=str(c.id),
            name=c.name,
            email=c.email,
            phone=c.phone,
            message=c.message,
            is_resolved=c.is_resolved,
            created_at=c.created_at
        ) for c in contacts
    ]

@router.patch("/{contact_id}/resolve", response_model=ContactResponse)
async def resolve_contact(contact_id: PydanticObjectId):
    """
    Đánh dấu liên hệ đã được xử lý
    """
    contact = await Contact.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Không tìm thấy liên hệ")
        
    contact.is_resolved = True
    await contact.save()
    
    return ContactResponse(
        id=str(contact.id),
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        message=contact.message,
        is_resolved=contact.is_resolved,
        created_at=contact.created_at
    )

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(contact_id: PydanticObjectId):
    """
    Xóa một liên hệ
    """
    contact = await Contact.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Không tìm thấy liên hệ")
        
    await contact.delete()
