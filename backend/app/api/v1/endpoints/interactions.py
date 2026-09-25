from fastapi import APIRouter, Depends
from typing import List
from app.models.user import User
from app.schemas.interaction import InteractionCreate, InteractionResponse
from app.api.deps import get_current_user
from app.services.interaction_service import interaction_service

router = APIRouter()

@router.post("/", response_model=InteractionResponse)
async def create_interaction(
    interaction_in: InteractionCreate,
    current_user: User = Depends(get_current_user)
):
    interaction_db = await interaction_service.create_interaction(interaction_in, current_user)
    
    return InteractionResponse(
        id=str(interaction_db.id),
        user_id=interaction_db.user_id,
        product_id=interaction_db.product_id,
        interaction_type=interaction_db.interaction_type,
        rating=interaction_db.rating,
        timestamp=interaction_db.timestamp
    )

@router.get("/my-interactions", response_model=List[InteractionResponse])
async def get_my_interactions(current_user: User = Depends(get_current_user)):
    interactions = await interaction_service.get_user_interactions(current_user)
    
    return [
        InteractionResponse(
            id=str(i.id),
            user_id=i.user_id,
            product_id=i.product_id,
            interaction_type=i.interaction_type,
            rating=i.rating,
            timestamp=i.timestamp
        )
        for i in interactions
    ]
