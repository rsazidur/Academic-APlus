from passlib.context import CryptContext
try:
    ctx = CryptContext(schemes=["argon2"], deprecated="auto")
    h = ctx.hash("test")
    print(f"Hashing Success: {h[:20]}...")
except Exception as e:
    print(f"Hashing Error: {e}")
