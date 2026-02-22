from services.yolo_detector import YoloDetector
import cv2
import time
import asyncio
from core.database import SessionLocal
from models.stream import Stream
from models.detection import Detection
from models.alert import Alert
from datetime import datetime, timedelta
from uuid import UUID

# Global instances to avoid reloading models on every call
yolo = YoloDetector()

# Buffer for live frames {stream_id: frame_bytes}
latest_frames = {}

async def process_stream(stream_id: str):
    """
    Main loop for processing a single video stream.
    """
    db = SessionLocal()
    try:
        # Initial fetch of stream
        stream = db.query(Stream).filter(Stream.id == stream_id).first()
        if not stream or not stream.url:
            print(f"[-] Stream {stream_id} not found or no URL")
            return

        print(f"[*] AI attempting to connect to: {stream.name} (Source: {stream.url})")

        # Initialize video capture
        video_source = stream.url
        if video_source.isdigit():
            video_source = int(video_source)
            
        print(f"[*] Attempting connection to device {video_source}...")
        
        # Use a separate thread for blocking OpenCV calls
        loop = asyncio.get_event_loop()
        
        # Try different backends on Windows for better compatibility with index 0
        cap = await loop.run_in_executor(None, lambda: cv2.VideoCapture(video_source, cv2.CAP_DSHOW))
        if not cap.isOpened():
            cap = await loop.run_in_executor(None, lambda: cv2.VideoCapture(video_source, cv2.CAP_MSMF))
        if not cap.isOpened():
            cap = await loop.run_in_executor(None, lambda: cv2.VideoCapture(video_source))
        
        if not cap.isOpened():
            print(f"[!] FAILED to open stream: {stream.name}. Check source availability.")
            stream.status = "error"
            db.commit()
            return

        # Fetch threshold
        from models.setting import SystemSetting
        setting = db.query(SystemSetting).filter(SystemSetting.category == 'neural_engine').first()
        threshold = 0.5
        if setting and "threshold" in setting.settings:
            threshold = float(setting.settings["threshold"])

        print(f"[+] CONNECTION ESTABLISHED: {stream.name}. Neural Engine Online.")
        
        stream.status = "active"
        db.commit()
        
        frame_count = 0
        
        while True:
            # Check for stop signal or settings update every 60 frames
            if frame_count % 60 == 0:
                db.refresh(stream)
                if stream.status != "active":
                    print(f"[*] STOP SIGNAL RECEIVED: {stream.name}")
                    break
                
                setting = db.query(SystemSetting).filter(SystemSetting.category == 'neural_engine').first()
                if setting and "threshold" in setting.settings:
                    threshold = float(setting.settings["threshold"])
            
            # Non-blocking read (wrapped in executor)
            ret, frame = await loop.run_in_executor(None, cap.read)
            if not ret:
                print(f"[!] CONNECTION LOST: {stream.name}")
                stream.status = "error"
                db.commit()
                break
            
            # Encode for live preview
            _, buffer = cv2.imencode('.jpg', frame)
            latest_frames[stream_id] = buffer.tobytes()
                
            frame_count += 1
            
            # AI Inference
            if frame_count % 5 == 0: # Every 5th frame for stability
                detections = yolo.detect(frame)
                h, w = frame.shape[:2]
                for det in detections:
                    if det["confidence"] > threshold:
                        # Normalize coordinates for frontend
                        normalized_bbox = {
                            "x1": det["bbox"]["x1"] / w,
                            "y1": det["bbox"]["y1"] / h,
                            "x2": det["bbox"]["x2"] / w,
                            "y2": det["bbox"]["y2"] / h
                        }
                        
                        new_det = Detection(
                            stream_id=UUID(stream_id),
                            timestamp=datetime.now(),
                            object_class=det["class"],
                            confidence=det["confidence"],
                            bbox_json=normalized_bbox
                        )
                        db.add(new_det)
                        print(f"  [BRAIN] Identified {det['class']} ({det['confidence']:.2f}) on {stream.name}")
                        
                        if det["class"] == "person" and det["confidence"] > 0.7:
                            last_alert = db.query(Alert).filter(
                                Alert.stream_id == UUID(stream_id),
                                Alert.alert_type == "Unauthorized Person",
                                Alert.created_at >= datetime.now() - timedelta(seconds=30)
                            ).first()
                            
                            if not last_alert:
                                new_alert = Alert(
                                    stream_id=UUID(stream_id),
                                    alert_type="Unauthorized Person",
                                    severity="high",
                                    description=f"Neural pattern match: Human presence on {stream.name}.",
                                    resolved=False
                                )
                                db.add(new_alert)
                                print(f"  [ALERT] Security breach logged for {stream.name}")
                
                db.commit()
                
            await asyncio.sleep(0.001)
            
    except Exception as e:
        import traceback
        print(f"[EX] CRITICAL FAILURE for {stream_id}:")
        traceback.print_exc()
    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        latest_frames.pop(stream_id, None)
        db.close()
