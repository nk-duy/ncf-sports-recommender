from typing import List
from app.models.interaction import Interaction
from app.models.user import User
from app.schemas.interaction import InteractionCreate

class InteractionService:
    @staticmethod
    async def create_interaction(interaction_in: InteractionCreate, current_user: User) -> Interaction:
        interaction_db = Interaction(
            user_id=str(current_user.id),
            product_id=interaction_in.product_id,
            interaction_type=interaction_in.interaction_type,
            rating=interaction_in.rating
        )
        await interaction_db.insert()
        return interaction_db

    @staticmethod
    async def get_user_interactions(current_user: User) -> List[Interaction]:
        interactions = await Interaction.find(Interaction.user_id == str(current_user.id)).to_list()
        return interactions

interaction_service = InteractionService()
