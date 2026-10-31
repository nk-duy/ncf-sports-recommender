from typing import List
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from beanie import PydanticObjectId

from app.models.voucher import Voucher
from app.models.user import User
from app.api.deps import get_current_admin_user
from app.schemas.voucher import VoucherCreate, VoucherUpdate

router = APIRouter()


@router.get("")
async def get_vouchers():
    """Lấy danh sách tất cả các voucher"""
    vouchers = await Voucher.find_all().to_list()
    return vouchers


@router.post("")
async def create_voucher(
    voucher_in: VoucherCreate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Tạo voucher mới (Dành cho Quản trị viên)"""
    code_clean = voucher_in.code.strip().upper()
    existing_voucher = await Voucher.find_one(Voucher.code == code_clean)
    if existing_voucher:
        raise HTTPException(status_code=400, detail="Mã voucher này đã tồn tại.")

    voucher = Voucher(
        code=code_clean,
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


@router.get("/{voucher_id}")
async def get_voucher(voucher_id: str):
    """Lấy chi tiết một voucher an toàn"""
    clean_id = voucher_id.strip()
    if not ObjectId.is_valid(clean_id):
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher hoặc ID không hợp lệ.")

    voucher = await Voucher.get(PydanticObjectId(clean_id))
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")
    return voucher


@router.put("/{voucher_id}")
async def update_voucher(
    voucher_id: str,
    voucher_in: VoucherUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật voucher (Dành cho Quản trị viên)"""
    clean_id = voucher_id.strip()
    if not ObjectId.is_valid(clean_id):
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher hoặc ID không hợp lệ.")

    voucher = await Voucher.get(PydanticObjectId(clean_id))
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")

    update_data = voucher_in.dict(exclude_unset=True)
    if "code" in update_data and update_data["code"]:
        update_data["code"] = update_data["code"].strip().upper()
        existing = await Voucher.find_one(Voucher.code == update_data["code"])
        if existing and existing.id != voucher.id:
            raise HTTPException(status_code=400, detail="Mã voucher đã tồn tại.")

    for key, value in update_data.items():
        setattr(voucher, key, value)

    await voucher.save()
    return voucher


@router.delete("/{voucher_id}")
async def delete_voucher(
    voucher_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Xóa voucher (Dành cho Quản trị viên)"""
    clean_id = voucher_id.strip()
    if not ObjectId.is_valid(clean_id):
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher hoặc ID không hợp lệ.")

    voucher = await Voucher.get(PydanticObjectId(clean_id))
    if not voucher:
        raise HTTPException(status_code=404, detail="Không tìm thấy voucher.")
    await voucher.delete()
    return {"message": "Đã xóa voucher thành công."}


@router.get("/code/{code}")
async def get_voucher_by_code(code: str):
    """Lấy thông tin voucher bằng mã code (dùng lúc apply ở Frontend)"""
    clean_code = code.strip().upper()
    voucher = await Voucher.find_one(Voucher.code == clean_code)
    if not voucher:
        raise HTTPException(status_code=404, detail="Mã voucher không hợp lệ.")
    return voucher
