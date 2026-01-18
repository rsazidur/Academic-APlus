from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import User
from auth import hash_password

def reset_users():
    db = SessionLocal()
    try:
        # Reset Admin
        admin_email = "admin@example.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if admin:
            print(f"Resetting password for {admin_email}...")
            admin.password_hash = hash_password("admin123")
            admin.role = "admin" # Ensure admin
        else:
            print(f"Creating {admin_email}...")
            admin = User(email=admin_email, password_hash=hash_password("admin123"), role="admin")
            db.add(admin)

        # Reset Student
        student_email = "student@example.com"
        student = db.query(User).filter(User.email == student_email).first()
        if student:
            print(f"Resetting password for {student_email}...")
            student.password_hash = hash_password("student123")
        else:
            print(f"Creating {student_email}...")
            student = User(email=student_email, password_hash=hash_password("student123"), role="student")
            db.add(student)
        
        db.commit()
        print("Users updated successfully.")
        print("------------------------------------------------")
        print(f"Admin:   {admin_email}   / admin123")
        print(f"Student: {student_email} / student123")
        print("------------------------------------------------")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_users()
