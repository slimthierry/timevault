from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.capsule_schemas import CapsuleResponse
from app.schemas.user_schemas import UserSummary


class ChainCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str | None = None


class ChainAddCapsule(BaseModel):
    capsule_id: UUID


class ChainResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    total_capsules: int
    creator: UserSummary
    capsules: list[CapsuleResponse]
    created_at: datetime

    model_config = {"from_attributes": True}


class ChainListResponse(BaseModel):
    chains: list[ChainResponse]
    total: int


class ChainProgressResponse(BaseModel):
    id: UUID
    title: str
    total_capsules: int
    opened_capsules: int
    next_open_date: datetime | None
    progress_percentage: float
