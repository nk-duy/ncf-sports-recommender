from typing import List
from app.models.interaction import Interaction
from app.models.user import User
from app.schemas.interaction import InteractionCreate

DEFAULT_WEIGHTS = {
    "view": 1.0,
    "click": 2.0,
    "add_to_cart": 3.5,
    "wishlist": 4.0,
    "purchase": 5.0,
    "review": 5.0
}

class InteractionService:
    @staticmethod
    async def create_interaction(interaction_in: InteractionCreate, current_user: User) -> Interaction:
        rating_val = interaction_in.rating
        if rating_val is None or rating_val <= 0:
            rating_val = DEFAULT_WEIGHTS.get(interaction_in.interaction_type, 1.0)
            
        interaction_db = Interaction(
            user_id=str(current_user.id),
            product_id=interaction_in.product_id,
            interaction_type=interaction_in.interaction_type,
            rating=rating_val
        )
        await interaction_db.insert()
        return interaction_db

    @staticmethod
    async def get_user_interactions(current_user: User) -> List[Interaction]:
        interactions = await Interaction.find(Interaction.user_id == str(current_user.id)).to_list()
        return interactions

interaction_service = InteractionService()
