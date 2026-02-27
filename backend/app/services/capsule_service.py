from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.encryption import decrypt_content, encrypt_content
from app.core.exceptions import (
    CapsuleAlreadyOpenedError,
    CapsuleLockedError,
    CapsuleNotFoundError,
)
from app.models.capsule_models import Capsule, CapsuleRecipient
from app.models.user_models import User
from app.schemas.capsule_schemas import (
    CapsuleCreate,
    CapsuleListResponse,
    CapsuleOpenResponse,
    CapsuleResponse,
)
from app.schemas.user_schemas import UserSummary
from app.utils.time_helpers import calculate_time_remaining, is_ready_to_open


def _capsule_to_response(capsule: Capsule) -> CapsuleResponse:
    """Convert a Capsule model to a CapsuleResponse schema."""
    remaining = calculate_time_remaining(capsule.open_date)
    return CapsuleResponse(
        id=capsule.id,
        title=capsule.title,
        category=capsule.category,
        is_public=capsule.is_public,
        open_date=capsule.open_date,
        is_opened=capsule.is_opened,
        time_remaining_seconds=remaining if remaining > 0 else 0,
        creator=UserSummary(id=capsule.creator_id, username=capsule.creator.username),
        created_at=capsule.created_at,
    )


async def create_capsule(
    db: AsyncSession,
    capsule_data: CapsuleCreate,
    creator: User,
) -> CapsuleResponse:
    """Create a new time capsule with encrypted content."""
    # Encrypt the content
    encrypted = encrypt_content(capsule_data.content)

    capsule = Capsule(
        creator_id=creator.id,
        title=capsule_data.title,
        encrypted_content=encrypted,
        category=capsule_data.category,
        is_public=capsule_data.is_public,
        open_date=capsule_data.open_date,
    )
    db.add(capsule)
    await db.flush()

    # Update creator stats
    creator.capsules_created += 1

    # Add recipients if provided
    if capsule_data.recipient_emails:
        for email in capsule_data.recipient_emails:
            # Look up if recipient is an existing user
            result = await db.execute(select(User).where(User.email == email))
            recipient_user = result.scalar_one_or_none()

            recipient = CapsuleRecipient(
                capsule_id=capsule.id,
                recipient_email=email,
                recipient_user_id=recipient_user.id if recipient_user else None,
            )
            db.add(recipient)

            # Update recipient stats if they exist
            if recipient_user:
                recipient_user.capsules_received += 1

    await db.flush()
    await db.refresh(capsule, attribute_names=["creator", "recipients"])

    return _capsule_to_response(capsule)


async def get_capsule(
    db: AsyncSession,
    capsule_id: UUID,
) -> CapsuleResponse:
    """Get a capsule by ID (without content)."""
    result = await db.execute(
        select(Capsule)
        .options(selectinload(Capsule.creator))
        .where(Capsule.id == capsule_id)
    )
    capsule = result.scalar_one_or_none()

    if capsule is None:
        raise CapsuleNotFoundError(str(capsule_id))

    return _capsule_to_response(capsule)


async def open_capsule(
    db: AsyncSession,
    capsule_id: UUID,
    user: User,
) -> CapsuleOpenResponse:
    """Open a capsule if its open date has passed, decrypt and return content."""
    result = await db.execute(
        select(Capsule)
        .options(selectinload(Capsule.creator))
        .where(Capsule.id == capsule_id)
    )
    capsule = result.scalar_one_or_none()

    if capsule is None:
        raise CapsuleNotFoundError(str(capsule_id))

    if capsule.is_opened:
        # Already opened, just return the decrypted content
        decrypted = decrypt_content(capsule.encrypted_content)
        return CapsuleOpenResponse(
            id=capsule.id,
            title=capsule.title,
            content=decrypted,
            category=capsule.category,
            is_public=capsule.is_public,
            open_date=capsule.open_date,
            is_opened=capsule.is_opened,
            opened_at=capsule.opened_at,
            creator=UserSummary(
                id=capsule.creator_id, username=capsule.creator.username
            ),
            created_at=capsule.created_at,
        )

    if not is_ready_to_open(capsule.open_date):
        raise CapsuleLockedError(capsule.open_date.isoformat())

    # Mark as opened
    capsule.is_opened = True
    capsule.opened_at = datetime.now(timezone.utc)
    await db.flush()

    # Decrypt content
    decrypted = decrypt_content(capsule.encrypted_content)

    return CapsuleOpenResponse(
        id=capsule.id,
        title=capsule.title,
        content=decrypted,
        category=capsule.category,
        is_public=capsule.is_public,
        open_date=capsule.open_date,
        is_opened=capsule.is_opened,
        opened_at=capsule.opened_at,
        creator=UserSummary(
            id=capsule.creator_id, username=capsule.creator.username
        ),
        created_at=capsule.created_at,
    )


async def list_user_capsules(
    db: AsyncSession,
    user_id: UUID,
    skip: int = 0,
    limit: int = 20,
) -> CapsuleListResponse:
    """List capsules created by a user."""
    # Get total count
    count_result = await db.execute(
        select(func.count()).select_from(Capsule).where(Capsule.creator_id == user_id)
    )
    total = count_result.scalar() or 0

    # Get capsules
    result = await db.execute(
        select(Capsule)
        .options(selectinload(Capsule.creator))
        .where(Capsule.creator_id == user_id)
        .order_by(Capsule.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    capsules = result.scalars().all()

    return CapsuleListResponse(
        capsules=[_capsule_to_response(c) for c in capsules],
        total=total,
    )


async def list_received_capsules(
    db: AsyncSession,
    user: User,
    skip: int = 0,
    limit: int = 20,
) -> CapsuleListResponse:
    """List capsules where the user is a recipient."""
    count_result = await db.execute(
        select(func.count())
        .select_from(CapsuleRecipient)
        .where(
            (CapsuleRecipient.recipient_user_id == user.id)
            | (CapsuleRecipient.recipient_email == user.email)
        )
    )
    total = count_result.scalar() or 0

    result = await db.execute(
        select(Capsule)
        .options(selectinload(Capsule.creator))
        .join(CapsuleRecipient, CapsuleRecipient.capsule_id == Capsule.id)
        .where(
            (CapsuleRecipient.recipient_user_id == user.id)
            | (CapsuleRecipient.recipient_email == user.email)
        )
        .order_by(Capsule.open_date.asc())
        .offset(skip)
        .limit(limit)
    )
    capsules = result.scalars().all()

    return CapsuleListResponse(
        capsules=[_capsule_to_response(c) for c in capsules],
        total=total,
    )


async def list_public_opened_capsules(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 20,
) -> CapsuleListResponse:
    """List public capsules that have been opened."""
    count_result = await db.execute(
        select(func.count())
        .select_from(Capsule)
        .where(Capsule.is_public == True, Capsule.is_opened == True)
    )
    total = count_result.scalar() or 0

    result = await db.execute(
        select(Capsule)
        .options(selectinload(Capsule.creator))
        .where(Capsule.is_public == True, Capsule.is_opened == True)
        .order_by(Capsule.opened_at.desc())
        .offset(skip)
        .limit(limit)
    )
    capsules = result.scalars().all()

    return CapsuleListResponse(
        capsules=[_capsule_to_response(c) for c in capsules],
        total=total,
    )
