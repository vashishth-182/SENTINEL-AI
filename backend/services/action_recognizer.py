import torch
import numpy as np
import cv2
from pytorchvideo.transforms import (
    ApplyTransformToKey,
    ShortSideScale,
    UniformTemporalSubsample,
    UniformCrop
)
from torchvision.transforms import Compose, Lambda
from torchvision.transforms._transforms_video import (
    CenterCropVideo,
    NormalizeVideo,
)

class ActionRecognizer:
    def __init__(self, model_name='slowfast_r50', device='cpu'):
        # Use CPU by default for stability if GPU mem is tight with YOLO
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Loading SlowFast model on {self.device}...")
        
        # Load pre-trained model from torch hub
        self.model = torch.hub.load('facebookresearch/pytorchvideo', model_name, pretrained=True)
        self.model = self.model.to(self.device)
        self.model.eval()
        
        # Standard SlowFast transforms
        self.transforms = Compose([
            ApplyTransformToKey(
                key="video",
                transform=Compose([
                    UniformTemporalSubsample(8),
                    Lambda(lambda x: x / 255.0),
                    NormalizeVideo(
                        mean=[0.45, 0.45, 0.45], 
                        std=[0.225, 0.225, 0.225]
                    ),
                    ShortSideScale(
                        size=256
                    ),
                    CenterCropVideo(256),
                ]),
            ),
        ])
        
        # Kinetics-400 class names (simplified subset for demo)
        # In a real app we would load the full json map
        self.classes = {
            # Map kinetics indices to our relevant classes if possible
            # For now, we stub this or use a generic mapping
            # This is a placeholder. Real implementation needs kinetics_classnames.json
        }
        
    def preprocess(self, frames):
        """
        Input: list of 32 frames (numpy arrays BGR)
        Output: list of inputs for SlowFast [slow_pathway, fast_pathway]
        """
        # Convert frames to tensor [T, H, W, C] -> [C, T, H, W]
        # and convert BGR (OpenCV) to RGB
        tensor_frames = [cv2.cvtColor(f, cv2.COLOR_BGR2RGB) for f in frames]
        tensor = torch.from_numpy(np.stack(tensor_frames))
        tensor = tensor.permute(3, 0, 1, 2) # C, T, H, W
        tensor = tensor.float()
        
        # Apply transforms
        input_data = self.transforms({"video": tensor})
        video_data = input_data["video"]
        
        # Prepare pathways
        # SlowFast requires a list: [slow_pathway, fast_pathway]
        # param alpha=4 (fast pathway has 4x frames of slow)
        fast_pathway = video_data
        # Subsample for slow pathway (every 4th frame)
        slow_pathway = torch.index_select(
            video_data,
            1,
            torch.linspace(0, video_data.shape[1] - 1, video_data.shape[1] // 4).long(),
        )
        
        inputs = [slow_pathway, fast_pathway]
        # Move to device and add batch dim
        return [i.to(self.device)[None, ...] for i in inputs]

    def predict(self, frame_buffer):
        """
        Run inference on a buffer of frames
        """
        if len(frame_buffer) < 32:
            return None
            
        inputs = self.preprocess(frame_buffer)
        
        with torch.no_grad():
            preds = self.model(inputs)
        
        # Get top prediction
        post_act = torch.nn.Softmax(dim=1)
        preds = post_act(preds)
        pred_classes = preds.topk(k=1)
        
        # Map to class name (stub)
        # pred_class_id = pred_classes.indices[0]
        # confidence = pred_classes.values[0]
        
        return {
            "action": "unknown", # placeholder
            "confidence": 0.0
        }
