from celery import Celery
from celery.schedules import crontab

from app.config.settings import settings

celery_app = Celery(
    "timevault",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.capsule_tasks",
        "app.tasks.notification_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# Beat schedule: check for ready capsules every 60 seconds
celery_app.conf.beat_schedule = {
    "check-ready-capsules": {
        "task": "app.tasks.capsule_tasks.check_ready_capsules",
        "schedule": 60.0,  # Every 60 seconds
    },
    "send-scheduled-notifications": {
        "task": "app.tasks.notification_tasks.send_scheduled_notifications",
        "schedule": 60.0,  # Every 60 seconds
    },
    "cleanup-old-notifications": {
        "task": "app.tasks.notification_tasks.cleanup_old_notifications",
        "schedule": crontab(hour=3, minute=0),  # Daily at 3 AM UTC
    },
}
