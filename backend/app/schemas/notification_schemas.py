from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.notification_models import NotificationType


class NotificationResponse(BaseModel):
    id: UUID
    capsule_id: UUID
    type: NotificationType
    message: str
    is_read: bool
    scheduled_for: datetime | None
    sent_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    notifications: list[NotificationResponse]
    unread_count: int


class UpcomingNotificationResponse(BaseModel):
    notifications: list[NotificationResponse]
    total: int
