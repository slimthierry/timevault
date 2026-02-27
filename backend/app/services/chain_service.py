from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import CapsuleNotFoundError, ChainNotFoundError
from app.models.capsule_models import Capsule
from app.models.chain_models import CapsuleChain
from app.models.user_models import User
from app.schemas.capsule_schemas import CapsuleResponse
from app.schemas.chain_schemas import (
    ChainCreate,
    ChainListResponse,
    ChainProgressResponse,
    ChainResponse,
)
from app.schemas.user_schemas import UserSummary
from app.utils.time_helpers import calculate_time_remaining


def _chain_to_response(chain: CapsuleChain) -> ChainResponse:
    """Convert a CapsuleChain model to a ChainResponse schema."""
    capsule_responses = []
    for capsule in chain.capsules:
        remaining = calculate_time_remaining(capsule.open_date)
        capsule_responses.append(
            CapsuleResponse(
                id=capsule.id,
                title=capsule.title,
                category=capsule.category,
                is_public=capsule.is_public,
                open_date=capsule.open_date,
                is_opened=capsule.is_opened,
                time_remaining_seconds=remaining if remaining > 0 else 0,
                creator=UserSummary(
                    id=capsule.creator_id, username=capsule.creator.username
                ),
                created_at=capsule.created_at,
            )
        )

    return ChainResponse(
        id=chain.id,
        title=chain.title,
        description=chain.description,
        total_capsules=chain.total_capsules,
        creator=UserSummary(id=chain.creator_id, username=chain.creator.username),
        capsules=capsule_responses,
        created_at=chain.created_at,
    )


async def create_chain(
    db: AsyncSession,
    chain_data: ChainCreate,
    creator: User,
) -> ChainResponse:
    """Create a new capsule chain."""
    chain = CapsuleChain(
        creator_id=creator.id,
        title=chain_data.title,
        description=chain_data.description,
        total_capsules=0,
    )
    db.add(chain)
    await db.flush()
    await db.refresh(chain, attribute_names=["creator", "capsules"])

    return _chain_to_response(chain)


async def add_to_chain(
    db: AsyncSession,
    chain_id: UUID,
    capsule_id: UUID,
    user: User,
) -> ChainResponse:
    """Add a capsule to a chain."""
    # Get the chain
    result = await db.execute(
        select(CapsuleChain)
        .options(
            selectinload(CapsuleChain.creator),
            selectinload(CapsuleChain.capsules).selectinload(Capsule.creator),
        )
        .where(CapsuleChain.id == chain_id, CapsuleChain.creator_id == user.id)
    )
    chain = result.scalar_one_or_none()

    if chain is None:
        raise ChainNotFoundError(str(chain_id))

    # Get the capsule
    capsule_result = await db.execute(
        select(Capsule).where(Capsule.id == capsule_id, Capsule.creator_id == user.id)
    )
    capsule = capsule_result.scalar_one_or_none()

    if capsule is None:
        raise CapsuleNotFoundError(str(capsule_id))

    # Assign capsule to chain
    capsule.chain_id = chain.id
    capsule.chain_order = chain.total_capsules + 1
    chain.total_capsules += 1

    await db.flush()
    await db.refresh(chain, attribute_names=["creator", "capsules"])

    return _chain_to_response(chain)


async def get_chain(
    db: AsyncSession,
    chain_id: UUID,
) -> ChainResponse:
    """Get a chain by ID with its capsules."""
    result = await db.execute(
        select(CapsuleChain)
        .options(
            selectinload(CapsuleChain.creator),
            selectinload(CapsuleChain.capsules).selectinload(Capsule.creator),
        )
        .where(CapsuleChain.id == chain_id)
    )
    chain = result.scalar_one_or_none()

    if chain is None:
        raise ChainNotFoundError(str(chain_id))

    return _chain_to_response(chain)


async def get_chain_progress(
    db: AsyncSession,
    chain_id: UUID,
) -> ChainProgressResponse:
    """Get progress info for a chain."""
    result = await db.execute(
        select(CapsuleChain)
        .options(selectinload(CapsuleChain.capsules))
        .where(CapsuleChain.id == chain_id)
    )
    chain = result.scalar_one_or_none()

    if chain is None:
        raise ChainNotFoundError(str(chain_id))

    opened_count = sum(1 for c in chain.capsules if c.is_opened)
    unopened = [c for c in chain.capsules if not c.is_opened]
    next_open = min((c.open_date for c in unopened), default=None) if unopened else None

    progress = (opened_count / chain.total_capsules * 100) if chain.total_capsules > 0 else 0

    return ChainProgressResponse(
        id=chain.id,
        title=chain.title,
        total_capsules=chain.total_capsules,
        opened_capsules=opened_count,
        next_open_date=next_open,
        progress_percentage=round(progress, 1),
    )


async def list_user_chains(
    db: AsyncSession,
    user_id: UUID,
    skip: int = 0,
    limit: int = 20,
) -> ChainListResponse:
    """List chains created by a user."""
    count_result = await db.execute(
        select(func.count())
        .select_from(CapsuleChain)
        .where(CapsuleChain.creator_id == user_id)
    )
    total = count_result.scalar() or 0

    result = await db.execute(
        select(CapsuleChain)
        .options(
            selectinload(CapsuleChain.creator),
            selectinload(CapsuleChain.capsules).selectinload(Capsule.creator),
        )
        .where(CapsuleChain.creator_id == user_id)
        .order_by(CapsuleChain.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    chains = result.scalars().all()

    return ChainListResponse(
        chains=[_chain_to_response(c) for c in chains],
        total=total,
    )
