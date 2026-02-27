from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.capsule_models import CapsuleCategory


class UserStats(BaseModel):
    capsules_created: int
    capsules_received: int
    capsules_opened: int
    next_opening: datetime | None


class UpcomingCapsule(BaseModel):
    id: UUID
    title: str
    category: CapsuleCategory
    open_date: datetime
    time_remaining_seconds: float
    is_public: bool

    model_config = {"from_attributes": True}


class TimelineEntry(BaseModel):
    id: UUID
    capsule_id: UUID
    title: str
    event_type: str  # "created", "opened", "received"
    category: CapsuleCategory
    event_date: datetime

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    stats: UserStats
    upcoming: list[UpcomingCapsule]
    timeline: list[TimelineEntry]
