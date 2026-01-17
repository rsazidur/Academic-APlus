from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import User
from auth import hash_password

def create_admin_user():
    db = SessionLocal()
    try:
        email = "admin@example.com"
        password = "admin123"
        
        # Check if exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists. Updating role to admin.")
            user.role = "admin"
            # Optional: reset password if needed, but let's keep it simple or update it
            user.password_hash = hash_password(password)
        else:
            print(f"Creating new admin user: {email}")
            user = User(
                email=email,
                password_hash=hash_password(password),
                role="admin"
            )
            db.add(user)
        
        db.commit()
        print(f"Admin user ready.")
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
