from pydantic_settings import BaseSettings
from typing import Optional
from urllib.parse import quote_plus

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    POSTGRES_USER: str = "sentinel"
    POSTGRES_PASSWORD: str = "7*aef@QY3C"
    POSTGRES_DB: str = "sentineldb"
    DATABASE_URL: Optional[str] = None
    
    REDIS_URL: str = "redis://localhost:6379"
    CLOUDINARY_URL: Optional[str] = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        # URL-encode the password to handle special characters
        encoded_password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{encoded_password}@localhost:5432/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
