from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.capsule_models import Capsule, CapsuleRecipient
from app.models.user_models import User
from app.schemas.dashboard_schemas import (
    DashboardResponse,
    TimelineEntry,
    UpcomingCapsule,
    UserStats,
)
from app.utils.time_helpers import calculate_time_remaining


async def get_user_stats(
    db: AsyncSession,
    user: User,
) -> UserStats:
    """Get dashboard statistics for a user."""
    # Count capsules opened by this user (as creator)
    opened_result = await db.execute(
        select(func.count())
        .select_from(Capsule)
        .where(Capsule.creator_id == user.id, Capsule.is_opened == True)
    )
    capsules_opened = opened_result.scalar() or 0

    # Get next opening date
    now = datetime.now(timezone.utc)
    next_result = await db.execute(
        select(Capsule.open_date)
        .where(
            Capsule.creator_id == user.id,
            Capsule.is_opened == False,
            Capsule.open_date > now,
        )
        .order_by(Capsule.open_date.asc())
        .limit(1)
    )
    next_opening = next_result.scalar_one_or_none()

    return UserStats(
        capsules_created=user.capsules_created,
        capsules_received=user.capsules_received,
        capsules_opened=capsules_opened,
        next_opening=next_opening,
    )


async def get_upcoming_capsules(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 10,
) -> list[UpcomingCapsule]:
    """Get upcoming capsules (not yet opened) for a user."""
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(Capsule)
        .where(
            Capsule.creator_id == user_id,
            Capsule.is_opened == False,
            Capsule.open_date > now,
        )
        .order_by(Capsule.open_date.asc())
        .limit(limit)
    )
    capsules = result.scalars().all()

    return [
        UpcomingCapsule(
            id=c.id,
            title=c.title,
            category=c.category,
            open_date=c.open_date,
            time_remaining_seconds=max(0, calculate_time_remaining(c.open_date)),
            is_public=c.is_public,
        )
        for c in capsules
    ]


async def get_timeline(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 20,
) -> list[TimelineEntry]:
    """Get a timeline of capsule events for a user."""
    entries: list[TimelineEntry] = []

    # Created capsules
    created_result = await db.execute(
        select(Capsule)
        .where(Capsule.creator_id == user_id)
        .order_by(Capsule.created_at.desc())
        .limit(limit)
    )
    created_capsules = created_result.scalars().all()

    for c in created_capsules:
        entries.append(
            TimelineEntry(
                id=uuid4(),
                capsule_id=c.id,
                title=c.title,
                event_type="created",
                category=c.category,
                event_date=c.created_at,
            )
        )

        # If opened, add an opened event too
        if c.is_opened and c.opened_at:
            entries.append(
                TimelineEntry(
                    id=uuid4(),
                    capsule_id=c.id,
                    title=c.title,
                    event_type="opened",
                    category=c.category,
                    event_date=c.opened_at,
                )
            )

    # Received capsules
    received_result = await db.execute(
        select(Capsule)
        .join(CapsuleRecipient, CapsuleRecipient.capsule_id == Capsule.id)
        .where(CapsuleRecipient.recipient_user_id == user_id)
        .order_by(Capsule.created_at.desc())
        .limit(limit)
    )
    received_capsules = received_result.scalars().all()

    for c in received_capsules:
        entries.append(
            TimelineEntry(
                id=uuid4(),
                capsule_id=c.id,
                title=c.title,
                event_type="received",
                category=c.category,
                event_date=c.created_at,
            )
        )

    # Sort by date descending
    entries.sort(key=lambda e: e.event_date, reverse=True)
    return entries[:limit]
