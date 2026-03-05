from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.chain_schemas import (
    ChainAddCapsule,
    ChainCreate,
    ChainListResponse,
    ChainProgressResponse,
    ChainResponse,
)
from app.services import chain_service

router = APIRouter(prefix="/chains", tags=["Capsule Chains"])


@router.post("/create", response_model=ChainResponse, status_code=201)
async def create_chain(
    chain_data: ChainCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChainResponse:
    """Create a new capsule chain."""
    return await chain_service.create_chain(db, chain_data, current_user)


@router.get("/my-chains", response_model=ChainListResponse)
async def list_my_chains(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChainListResponse:
    """List chains created by the current user."""
    return await chain_service.list_user_chains(db, current_user.id, skip, limit)


@router.get("/{chain_id}", response_model=ChainResponse)
async def get_chain(
    chain_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ChainResponse:
    """Get a chain by ID with its capsules."""
    return await chain_service.get_chain(db, chain_id)


@router.get("/{chain_id}/progress", response_model=ChainProgressResponse)
async def get_chain_progress(
    chain_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ChainProgressResponse:
    """Get progress information for a chain."""
    return await chain_service.get_chain_progress(db, chain_id)


@router.post("/{chain_id}/add", response_model=ChainResponse)
async def add_capsule_to_chain(
    chain_id: UUID,
    data: ChainAddCapsule,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChainResponse:
    """Add a capsule to a chain."""
    return await chain_service.add_to_chain(db, chain_id, data.capsule_id, current_user)
