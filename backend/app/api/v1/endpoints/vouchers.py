from fastapi import APIRouter, HTTPException, Depends
from typing import List
from beanie import PydanticObjectId
from app.models.voucher import Voucher
from app.schemas.voucher import VoucherCreate, VoucherUpdate, VoucherResponse

router = APIRouter()

@router.get("/", response_model=List[VoucherResponse])
async def get_vouchers():
    """Lấy danh sách tất cả các voucher"""
    vouchers = await Voucher.find_all().to_list()
    # Beanie ObjectId is an Object, we return them, Pydantic should handle serialization if configured,
    # but manually converting if needed. Pydantic 1.x vs 2.x handles it differently.
    # We defined id: str = Field(alias="_id") in response schema, let's just return documents
    return vouchers

@router.post("/", response_model=VoucherResponse)
async def create_voucher(voucher_in: VoucherCreate):
    """Tạo voucher mới"""
    existing_voucher = await Voucher.find_one(Voucher.code == voucher_in.code.upper())
    if existing_voucher:
        raise HTTPException(status_code=400, detail="Mã voucher này đã tồn tại.")
    
    voucher = Voucher(
        code=voucher_in.code.upper(),
        discount_type=voucher_in.discount_type,
        discount_value=voucher_in.discount_value,
        max_discount=voucher_in.max_discount,
        min_order_value=voucher_in.min_order_value,
        usage_limit=voucher_in.usage_limit,
        valid_from=voucher_in.valid_from,
        valid_until=voucher_in.valid_until,
        is_active=voucher_in.is_active,
    )
    await voucher.insert()
    return voucher

@router.get("/{voucher_id}", response_model=VoucherResponse)
async def get_voucher(voucher_id: PydanticObjectId):
    """Lấy chi tiết một voucher"""
    voucher = await Voucher.get(voucher_id)
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")
    return voucher

@router.put("/{voucher_id}", response_model=VoucherResponse)
async def update_voucher(voucher_id: PydanticObjectId, voucher_in: VoucherUpdate):
    """Cập nhật voucher"""
    voucher = await Voucher.get(voucher_id)
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")
    
    update_data = voucher_in.dict(exclude_unset=True)
    if "code" in update_data:
        update_data["code"] = update_data["code"].upper()
        # Check if the new code exists on another voucher
        existing = await Voucher.find_one(Voucher.code == update_data["code"])
        if existing and existing.id != voucher.id:
            raise HTTPException(status_code=400, detail="Mã voucher đã tồn tại.")

    for key, value in update_data.items():
        setattr(voucher, key, value)
    
    await voucher.save()
    return voucher

@router.delete("/{voucher_id}")
async def delete_voucher(voucher_id: PydanticObjectId):
    """Xóa voucher"""
    voucher = await Voucher.get(voucher_id)
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")
    await voucher.delete()
    return {"message": "Đã xóa voucher thành công."}

@router.get("/code/{code}", response_model=VoucherResponse)
async def get_voucher_by_code(code: str):
    """Lấy thông tin voucher bằng mã code (dùng lúc apply ở Frontend)"""
    voucher = await Voucher.find_one(Voucher.code == code.upper())
    if not voucher:
        raise HTTPException(status_code=404, detail="Mã voucher không hợp lệ.")
    return voucher
