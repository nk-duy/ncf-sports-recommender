import asyncio
import os
import sys

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Add backend dir to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.user import User
from app.core.security import get_password_hash
from app.schemas.user import UserCreate

async def create_admin():
    client = AsyncIOMotorClient('mongodb://localhost:27017/')
    await init_beanie(database=client.ncf_recommender_db, document_models=[User])

    admin_user = await User.find_one(User.username == "admin")
    if not admin_user:
        hashed_pw = get_password_hash("admin")
        admin = User(
            username="admin",
            email="admin@kady.vn",
            hashed_password=hashed_pw,
            full_name="Nguyễn Khánh Duy (Admin)",
            role="admin",
            is_active=True
        )
        await admin.insert()
        print("Created admin user: username=admin, full_name='Nguyễn Khánh Duy (Admin)', email='admin@kady.vn'")
    else:
        # Update to make sure it's admin role, name and email
        hashed_pw = get_password_hash("admin")
        admin_user.hashed_password = hashed_pw
        admin_user.full_name = "Nguyễn Khánh Duy (Admin)"
        admin_user.email = "admin@kady.vn"
        admin_user.role = "admin"
        await admin_user.save()
        print("Updated existing admin user: full_name='Nguyễn Khánh Duy (Admin)', email='admin@kady.vn'")

if __name__ == "__main__":
    asyncio.run(create_admin())
