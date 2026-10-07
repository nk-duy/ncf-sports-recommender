import asyncio
import os
import sys

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Add current dir to path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.user import User
from app.core.security import verify_password

async def test_admin():
    client = AsyncIOMotorClient('mongodb://localhost:27017/')
    await init_beanie(database=client.ncf_sports, document_models=[User])

    admin_user = await User.find_one(User.username == "admin")
    if not admin_user:
        print("Admin user not found")
        return
        
    print("Admin found. Role:", admin_user.role)
    print("Is active:", admin_user.is_active)
    print("Hashed pw:", admin_user.hashed_password)
    
    # Try verifying password "admin"
    is_valid = verify_password("admin", admin_user.hashed_password)
    print("Password 'admin' is valid:", is_valid)

if __name__ == "__main__":
    asyncio.run(test_admin())
