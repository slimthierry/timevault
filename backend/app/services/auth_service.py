from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    UsernameAlreadyExistsError,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user_models import User
from app.schemas.auth_schemas import AuthResponse, TokenResponse
from app.schemas.user_schemas import UserCreate, UserResponse


async def register_user(db: AsyncSession, user_data: UserCreate) -> AuthResponse:
    """Register a new user and return auth tokens."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise EmailAlreadyExistsError()

    # Check if username already exists
    result = await db.execute(
        select(User).where(User.username == user_data.username)
    )
    if result.scalar_one_or_none():
        raise UsernameAlreadyExistsError()

    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    # Generate tokens
    token_data = {"sub": str(user.id)}
    tokens = TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=tokens,
    )


async def login_user(db: AsyncSession, email: str, password: str) -> AuthResponse:
    """Authenticate a user and return auth tokens."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(password, user.hashed_password):
        raise InvalidCredentialsError()

    # Generate tokens
    token_data = {"sub": str(user.id)}
    tokens = TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=tokens,
    )
