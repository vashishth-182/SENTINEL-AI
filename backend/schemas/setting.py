from pydantic import BaseModel
from typing import Dict, Any

class SettingUpdate(BaseModel):
    category: str
    settings: Dict[str, Any]

class SettingResponse(SettingUpdate):
    pass
