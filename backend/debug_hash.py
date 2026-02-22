from passlib.context import CryptContext
import traceback

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("Hashing password...")
    h = pwd_context.hash("admin123")
    print(f"Hash: {h}")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
