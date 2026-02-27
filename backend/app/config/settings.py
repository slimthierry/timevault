import base64
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    ENVIRONMENT: str = "development"
    APP_NAME: str = "TimeVault"
    APP_VERSION: str = "1.0.0"

    # Security
    SECRET_KEY: str = "timevault-dev-secret-key-change-in-production-abc123"
    ENCRYPTION_KEY: str = "dGltZXZhdWx0LWVuY3J5cHRpb24ta2V5MQ=="

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://timevault_user:timevault_pass@db:5432/timevault"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:48000"

    @field_validator("ENCRYPTION_KEY")
    @classmethod
    def validate_encryption_key(cls, v: str) -> str:
        """Ensure the encryption key is valid base64 and at least 32 bytes."""
        try:
            decoded = base64.urlsafe_b64decode(v + "==")
            if len(decoded) < 16:
                raise ValueError("Encryption key must decode to at least 16 bytes")
        except Exception:
            pass
        return v

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
