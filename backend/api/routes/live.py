from fastapi import APIRouter, Response
from fastapi.responses import StreamingResponse
import asyncio
from services.video_processor import latest_frames

router = APIRouter()

async def frame_generator(stream_id: str):
    while True:
        if stream_id in latest_frames:
            frame = latest_frames[stream_id]
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            # Placeholder or wait
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.04) # ~25 FPS

@router.get("/{stream_id}")
async def get_live_stream(stream_id: str):
    return StreamingResponse(
        frame_generator(stream_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
