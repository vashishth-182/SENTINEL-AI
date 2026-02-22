from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from typing import Dict
from core import dependencies
from models.user import User
from jose import jwt, JWTError
from core.config import settings
from core.security import ALGORITHM
from core.database import get_db

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {} # stream_id -> [ws]

    async def connect(self, websocket: WebSocket, stream_id: str):
        await websocket.accept()
        if stream_id not in self.active_connections:
            self.active_connections[stream_id] = []
        self.active_connections[stream_id].append(websocket)

    def disconnect(self, websocket: WebSocket, stream_id: str):
        if stream_id in self.active_connections:
            self.active_connections[stream_id].remove(websocket)

    async def broadcast(self, message: dict, stream_id: str):
        if stream_id in self.active_connections:
            for connection in self.active_connections[stream_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/stream/{stream_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    stream_id: str,
    token: str = Query(...)
):
    # Verify token
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        # Verify user...
    except JWTError:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, stream_id)
    try:
        while True:
            # Wait for messages (maybe pings), real data is pushed from backend tasks
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, stream_id)
