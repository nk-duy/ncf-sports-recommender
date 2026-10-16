from fastapi import APIRouter, HTTPException, status, Request
from typing import List
from beanie import PydanticObjectId
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.contact_service import contact_service
from app.core.limiter import limiter

router = APIRouter()

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_contact(request: Request, contact_in: ContactCreate):
    """
    Tạo mới một liên hệ (Gửi tin nhắn từ form Liên hệ - Giới hạn 5 req/phút chống spam)
    """
    contact = await contact_service.create_contact(contact_in)
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
@limiter.limit("10/minute")
async def subscribe_newsletter(request: Request, payload: dict):
    """
    Đăng ký nhận bản tin khuyến mãi từ popup hoặc footer (Giới hạn 10 req/phút)
    """
    email = payload.get("email", "").strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Email không hợp lệ")

    return await contact_service.subscribe_newsletter(email)

@router.get("/", response_model=List[ContactResponse])
async def get_contacts(skip: int = 0, limit: int = 100):
    """
    Lấy danh sách các liên hệ (Dành cho Quản trị viên)
    """
    contacts = await contact_service.get_contacts(skip=skip, limit=limit)
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
    contact = await contact_service.resolve_contact(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Không tìm thấy liên hệ")
        
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
    Xóa một liên hệ khỏi hệ thống
    """
    success = await contact_service.delete_contact(contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy liên hệ")
