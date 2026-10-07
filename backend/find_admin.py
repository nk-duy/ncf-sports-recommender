import asyncio
import motor.motor_asyncio
from pymongo import MongoClient

def find_admin():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['ncf_sports']
    admin = db.users.find_one({'role': 'admin'})
    if admin:
        print("Admin user found:")
        print("Email:", admin.get('email'))
        print("Username:", admin.get('username'))
        # Usually password is hashed, we can't see the raw password
        print("Password Hash:", admin.get('hashed_password'))
    else:
        print("No admin user found in database.")

if __name__ == "__main__":
    find_admin()
