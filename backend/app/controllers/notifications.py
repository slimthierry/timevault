from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.notification_schemas import (
    NotificationListResponse,
    NotificationResponse,
    UpcomingNotificationResponse,
)
from app.services import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationListResponse:
    """Get notifications for the current user."""
    return await notification_service.get_unread_notifications(
        db, current_user.id, skip, limit
    )


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    """Mark a notification as read."""
    result = await notification_service.mark_notification_read(
        db, notification_id, current_user.id
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )
    return result


@router.get("/upcoming", response_model=UpcomingNotificationResponse)
async def get_upcoming(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UpcomingNotificationResponse:
    """Get upcoming scheduled notifications."""
    return await notification_service.get_upcoming_notifications(
        db, current_user.id, limit
    )
