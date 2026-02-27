from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.capsule_models import CapsuleCategory
from app.schemas.user_schemas import UserSummary


class CapsuleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    content: str = Field(min_length=1)
    category: CapsuleCategory = CapsuleCategory.PERSONAL
    is_public: bool = False
    open_date: datetime
    recipient_emails: list[str] | None = None


class CapsuleResponse(BaseModel):
    """Response schema for capsules. Does NOT include content if the capsule is locked."""

    id: UUID
    title: str
    category: CapsuleCategory
    is_public: bool
    open_date: datetime
    is_opened: bool
    time_remaining_seconds: float | None = None
    creator: UserSummary
    created_at: datetime

    model_config = {"from_attributes": True}


class CapsuleOpenResponse(BaseModel):
    """Response schema when a capsule is opened, includes decrypted content."""

    id: UUID
    title: str
    content: str
    category: CapsuleCategory
    is_public: bool
    open_date: datetime
    is_opened: bool
    opened_at: datetime | None
    creator: UserSummary
    created_at: datetime

    model_config = {"from_attributes": True}


class CapsuleListResponse(BaseModel):
    capsules: list[CapsuleResponse]
    total: int
