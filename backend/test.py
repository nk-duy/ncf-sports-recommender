import asyncio
from app.core.database import init_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth_service import auth_service

async def test():
    await init_db()
    user_in = UserCreate(username='testx', email='testx@x.com', password='123', full_name='x')
    try:
        await auth_service.register_user(user_in)
        print('OK')
    except Exception as e:
        print('Error:', e)
        import traceback
        traceback.print_exc()

asyncio.run(test())
