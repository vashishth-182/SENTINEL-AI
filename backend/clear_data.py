from core.database import SessionLocal
from models.detection import Detection
from models.alert import Alert

db = SessionLocal()
try:
    num_det = db.query(Detection).delete()
    num_alert = db.query(Alert).delete()
    db.commit()
    print(f"[+] Cleared {num_det} detections and {num_alert} alerts.")
except Exception as e:
    db.rollback()
    print(f"[-] Error: {e}")
finally:
    db.close()
