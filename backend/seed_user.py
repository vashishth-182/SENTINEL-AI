"""
Seed an admin user for Sentinel AI
"""
from core.database import SessionLocal
from core import security
from models.user import User

def seed_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@sentinel.ai"
        user = db.query(User).filter(User.email == admin_email).first()
        
        if not user:
            print(f"Creating admin user: {admin_email}...")
            admin_user = User(
                email=admin_email,
                hashed_password=security.get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print("✓ Admin user created successfully!")
            print(f"Login details:")
            print(f"  Email: {admin_email}")
            print(f"  Password: admin123")
        else:
            print(f"Admin user '{admin_email}' already exists.")
            
    except Exception as e:
        print(f"Error seeding admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
