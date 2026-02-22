from core.database import SessionLocal
from models.stream import Stream

db = SessionLocal()
streams = db.query(Stream).all()
print("-" * 60)
for s in streams:
    print(f"ID: {s.id} | Name: {s.name} | Status: {s.status} | URL: {s.url}")
print("-" * 60)
db.close()
