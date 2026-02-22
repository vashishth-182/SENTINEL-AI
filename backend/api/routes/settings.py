from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from core import dependencies
from core.database import get_db
from models.setting import SystemSetting
from schemas.setting import SettingUpdate, SettingResponse
from models.user import User

router = APIRouter()

@router.get("/", response_model=List[SettingResponse])
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    return db.query(SystemSetting).all()

@router.post("/", response_model=SettingResponse)
def update_settings(
    *,
    db: Session = Depends(get_db),
    setting_in: SettingUpdate,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    db_setting = db.query(SystemSetting).filter(SystemSetting.category == setting_in.category).first()
    if db_setting:
        db_setting.settings = setting_in.settings
    else:
        db_setting = SystemSetting(category=setting_in.category, settings=setting_in.settings)
        db.add(db_setting)
    
    db.commit()
    db.refresh(db_setting)
    return db_setting
