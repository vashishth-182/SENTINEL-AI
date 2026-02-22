from core.database import SessionLocal
from models.stream import Stream

db = SessionLocal()
# Activate all inactive or error streams for testing
to_activate = db.query(Stream).filter(Stream.status.in_(["inactive", "error"])).all()
if to_activate:
    print(f"Activating {len(to_activate)} streams...")
    for s in to_activate:
        s.status = "active"
    db.commit()
    print("Done.")
else:
    print("No inactive streams found.")
db.close()
