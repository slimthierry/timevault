from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.capsule_models import Capsule
from app.models.notification_models import Notification, NotificationType
from app.models.user_models import User
from app.schemas.notification_schemas import (
    NotificationListResponse,
    NotificationResponse,
    UpcomingNotificationResponse,
)


async def schedule_notifications(
    db: AsyncSession,
    capsule: Capsule,
    user_id: UUID,
) -> list[Notification]:
    """Schedule notifications for a capsule: 1 week before, 1 day before, and on open."""
    notifications = []
    now = datetime.now(timezone.utc)

    # 1 week before opening
    week_before = capsule.open_date - timedelta(weeks=1)
    if week_before > now:
        notif_week = Notification(
            user_id=user_id,
            capsule_id=capsule.id,
            type=NotificationType.REMINDER_WEEK,
            message=f'Your time capsule "{capsule.title}" will open in 1 week!',
            scheduled_for=week_before,
        )
        db.add(notif_week)
        notifications.append(notif_week)

    # 1 day before opening
    day_before = capsule.open_date - timedelta(days=1)
    if day_before > now:
        notif_day = Notification(
            user_id=user_id,
            capsule_id=capsule.id,
            type=NotificationType.REMINDER_DAY,
            message=f'Your time capsule "{capsule.title}" will open tomorrow!',
            scheduled_for=day_before,
        )
        db.add(notif_day)
        notifications.append(notif_day)

    # On open date
    notif_open = Notification(
        user_id=user_id,
        capsule_id=capsule.id,
        type=NotificationType.CAPSULE_OPENED,
        message=f'Your time capsule "{capsule.title}" is now ready to be opened!',
        scheduled_for=capsule.open_date,
    )
    db.add(notif_open)
    notifications.append(notif_open)

    await db.flush()
    return notifications


async def schedule_recipient_notification(
    db: AsyncSession,
    capsule: Capsule,
    recipient_user_id: UUID,
) -> Notification:
    """Schedule a notification for a capsule recipient."""
    notification = Notification(
        user_id=recipient_user_id,
        capsule_id=capsule.id,
        type=NotificationType.CAPSULE_RECEIVED,
        message=f'You have received a time capsule: "{capsule.title}"',
        scheduled_for=datetime.now(timezone.utc),
    )
    db.add(notification)
    await db.flush()
    return notification


async def get_unread_notifications(
    db: AsyncSession,
    user_id: UUID,
    skip: int = 0,
    limit: int = 50,
) -> NotificationListResponse:
    """Get unread notifications for a user."""
    # Count unread
    count_result = await db.execute(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == user_id, Notification.is_read == False)
    )
    unread_count = count_result.scalar() or 0

    # Get notifications (both read and unread, ordered by recency)
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    notifications = result.scalars().all()

    return NotificationListResponse(
        notifications=[
            NotificationResponse.model_validate(n) for n in notifications
        ],
        unread_count=unread_count,
    )


async def mark_notification_read(
    db: AsyncSession,
    notification_id: UUID,
    user_id: UUID,
) -> NotificationResponse | None:
    """Mark a notification as read."""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        return None

    notification.is_read = True
    await db.flush()
    await db.refresh(notification)

    return NotificationResponse.model_validate(notification)


async def get_upcoming_notifications(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 20,
) -> UpcomingNotificationResponse:
    """Get upcoming scheduled notifications for a user."""
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(Notification)
        .where(
            Notification.user_id == user_id,
            Notification.scheduled_for > now,
            Notification.sent_at == None,
        )
        .order_by(Notification.scheduled_for.asc())
        .limit(limit)
    )
    notifications = result.scalars().all()

    return UpcomingNotificationResponse(
        notifications=[
            NotificationResponse.model_validate(n) for n in notifications
        ],
        total=len(notifications),
    )
