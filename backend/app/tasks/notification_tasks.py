import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, select, update

from app.celery_app import celery_app
from app.config.database import async_session_factory
from app.models.notification_models import Notification


async def _send_scheduled_notifications_async():
    """Find notifications that are scheduled and mark them as sent."""
    async with async_session_factory() as db:
        try:
            now = datetime.now(timezone.utc)

            # Find notifications that should have been sent by now
            result = await db.execute(
                select(Notification).where(
                    Notification.scheduled_for <= now,
                    Notification.sent_at == None,
                )
            )
            pending_notifications = result.scalars().all()

            sent_count = 0
            for notification in pending_notifications:
                notification.sent_at = now
                sent_count += 1

            await db.commit()

            return {
                "processed_at": now.isoformat(),
                "notifications_sent": sent_count,
            }

        except Exception as e:
            await db.rollback()
            raise e


async def _cleanup_old_notifications_async():
    """Delete read notifications older than 90 days."""
    async with async_session_factory() as db:
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(days=90)

            result = await db.execute(
                delete(Notification).where(
                    Notification.is_read == True,
                    Notification.created_at < cutoff,
                )
            )

            deleted_count = result.rowcount
            await db.commit()

            return {
                "cleaned_at": datetime.now(timezone.utc).isoformat(),
                "notifications_deleted": deleted_count,
            }

        except Exception as e:
            await db.rollback()
            raise e


@celery_app.task(name="app.tasks.notification_tasks.send_scheduled_notifications")
def send_scheduled_notifications():
    """Celery task: Process and send scheduled notifications."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(_send_scheduled_notifications_async())
        return result
    finally:
        loop.close()


@celery_app.task(name="app.tasks.notification_tasks.cleanup_old_notifications")
def cleanup_old_notifications():
    """Celery task: Clean up old read notifications."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(_cleanup_old_notifications_async())
        return result
    finally:
        loop.close()
