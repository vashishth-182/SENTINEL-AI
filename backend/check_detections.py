from core.database import SessionLocal
from models.detection import Detection
from sqlalchemy import desc

db = SessionLocal()
dets = db.query(Detection).order_by(desc(Detection.timestamp)).limit(5).all()
print("-" * 30)
if not dets:
    print("No detections found in DB.")
else:
    for d in dets:
        print(f"[{d.timestamp}] {d.object_class} ({d.confidence:.2f})")
print("-" * 30)
db.close()
