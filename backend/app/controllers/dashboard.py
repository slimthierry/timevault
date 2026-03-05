from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.dashboard_schemas import (
    DashboardResponse,
    TimelineEntry,
    UpcomingCapsule,
    UserStats,
)
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=UserStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserStats:
    """Get dashboard statistics for the current user."""
    return await dashboard_service.get_user_stats(db, current_user)


@router.get("/timeline", response_model=list[TimelineEntry])
async def get_timeline(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TimelineEntry]:
    """Get a timeline of capsule events for the current user."""
    return await dashboard_service.get_timeline(db, current_user.id, limit)


@router.get("/upcoming", response_model=list[UpcomingCapsule])
async def get_upcoming(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UpcomingCapsule]:
    """Get upcoming capsules for the current user."""
    return await dashboard_service.get_upcoming_capsules(db, current_user.id, limit)
