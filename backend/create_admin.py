import asyncio
import os
import sys

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Add current dir to path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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
            email="admin@example.com",
            hashed_password=hashed_pw,
            full_name="Adminstrator",
            role="admin",
            is_active=True
        )
        await admin.insert()
        print("Created admin user: username=admin, password=admin")
    else:
        # Update to make sure it's admin role and password is admin
        hashed_pw = get_password_hash("admin")
        admin_user.hashed_password = hashed_pw
        admin_user.role = "admin"
        await admin_user.save()
        print("Admin user already existed, updated role to admin and password to 'admin'")

if __name__ == "__main__":
    asyncio.run(create_admin())
