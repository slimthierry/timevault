from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.capsule_schemas import (
    CapsuleCreate,
    CapsuleListResponse,
    CapsuleOpenResponse,
    CapsuleResponse,
)
from app.services import capsule_service
from app.utils.validators import validate_content_size, validate_open_date

router = APIRouter(prefix="/capsules", tags=["Capsules"])


@router.post("/create", response_model=CapsuleResponse, status_code=201)
async def create_capsule(
    capsule_data: CapsuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapsuleResponse:
    """Create a new time capsule with encrypted content."""
    validate_open_date(capsule_data.open_date)
    validate_content_size(capsule_data.content)

    return await capsule_service.create_capsule(db, capsule_data, current_user)


@router.get("/my-capsules", response_model=CapsuleListResponse)
async def list_my_capsules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapsuleListResponse:
    """List capsules created by the current user."""
    return await capsule_service.list_user_capsules(db, current_user.id, skip, limit)


@router.get("/received", response_model=CapsuleListResponse)
async def list_received_capsules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapsuleListResponse:
    """List capsules where the current user is a recipient."""
    return await capsule_service.list_received_capsules(db, current_user, skip, limit)


@router.get("/public", response_model=CapsuleListResponse)
async def list_public_capsules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> CapsuleListResponse:
    """List public capsules that have been opened."""
    return await capsule_service.list_public_opened_capsules(db, skip, limit)


@router.get("/{capsule_id}", response_model=CapsuleResponse)
async def get_capsule(
    capsule_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> CapsuleResponse:
    """Get a capsule by ID (without content if locked)."""
    return await capsule_service.get_capsule(db, capsule_id)


@router.post("/{capsule_id}/open", response_model=CapsuleOpenResponse)
async def open_capsule(
    capsule_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapsuleOpenResponse:
    """Open a capsule if its open date has passed. Returns decrypted content."""
    return await capsule_service.open_capsule(db, capsule_id, current_user)
