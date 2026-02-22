from ultralytics import YOLO
import torch
import numpy as np

class YoloDetector:
    def __init__(self, model_path='yolov8n.pt'):
        # Check for GPU
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Loading YOLOv8 model on {self.device}...")
        self.model = YOLO(model_path)
        self.names = self.model.names

    def detect(self, frame):
        """
        Run YOLOv8 inference on a single frame.
        Returns: List of detection dicts
        """
        results = self.model(frame, verbose=False, device=self.device)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf)
                cls = int(box.cls)
                class_name = self.names[cls]
                
                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": {
                        "x1": int(x1),
                        "y1": int(y1),
                        "x2": int(x2),
                        "y2": int(y2)
                    }
                })
        return detections
