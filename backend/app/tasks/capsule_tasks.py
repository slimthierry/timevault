import asyncio
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.celery_app import celery_app
from app.config.database import async_session_factory
from app.models.capsule_models import Capsule, CapsuleRecipient
from app.models.notification_models import Notification, NotificationType


async def _check_ready_capsules_async():
    """Find capsules whose open_date has passed and mark them as ready.
    Send notifications to creators and recipients.
    """
    async with async_session_factory() as db:
        try:
            now = datetime.now(timezone.utc)

            # Find capsules that are ready to open but haven't been opened yet
            result = await db.execute(
                select(Capsule).where(
                    Capsule.open_date <= now,
                    Capsule.is_opened == False,
                )
            )
            ready_capsules = result.scalars().all()

            for capsule in ready_capsules:
                # Create notification for the creator
                creator_notification = Notification(
                    user_id=capsule.creator_id,
                    capsule_id=capsule.id,
                    type=NotificationType.CAPSULE_OPENED,
                    message=f'Your time capsule "{capsule.title}" is now ready to be opened!',
                    scheduled_for=now,
                    sent_at=now,
                )
                db.add(creator_notification)

                # Notify recipients
                recipients_result = await db.execute(
                    select(CapsuleRecipient).where(
                        CapsuleRecipient.capsule_id == capsule.id,
                        CapsuleRecipient.notified == False,
                    )
                )
                recipients = recipients_result.scalars().all()

                for recipient in recipients:
                    if recipient.recipient_user_id:
                        recipient_notification = Notification(
                            user_id=recipient.recipient_user_id,
                            capsule_id=capsule.id,
                            type=NotificationType.CAPSULE_RECEIVED,
                            message=f'A time capsule "{capsule.title}" shared with you is now ready to be opened!',
                            scheduled_for=now,
                            sent_at=now,
                        )
                        db.add(recipient_notification)

                    recipient.notified = True

            await db.commit()

            return {
                "checked_at": now.isoformat(),
                "ready_capsules_found": len(ready_capsules),
            }

        except Exception as e:
            await db.rollback()
            raise e


@celery_app.task(name="app.tasks.capsule_tasks.check_ready_capsules")
def check_ready_capsules():
    """Celery task: Check for capsules ready to be opened."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(_check_ready_capsules_async())
        return result
    finally:
        loop.close()
