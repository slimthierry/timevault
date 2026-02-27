from fastapi import HTTPException, status


class CapsuleLockedError(HTTPException):
    """Raised when trying to access content of a capsule that hasn't reached its open date."""

    def __init__(self, open_date: str | None = None):
        detail = "This capsule is still locked and cannot be opened yet."
        if open_date:
            detail += f" It will be available on {open_date}."
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class CapsuleNotFoundError(HTTPException):
    """Raised when a requested capsule does not exist."""

    def __init__(self, capsule_id: str | None = None):
        detail = "Capsule not found."
        if capsule_id:
            detail = f"Capsule with ID '{capsule_id}' not found."
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class CapsuleAlreadyOpenedError(HTTPException):
    """Raised when trying to open a capsule that has already been opened."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="This capsule has already been opened.",
        )


class ChainNotFoundError(HTTPException):
    """Raised when a requested chain does not exist."""

    def __init__(self, chain_id: str | None = None):
        detail = "Capsule chain not found."
        if chain_id:
            detail = f"Capsule chain with ID '{chain_id}' not found."
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UserNotFoundError(HTTPException):
    """Raised when a requested user does not exist."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )


class InvalidCredentialsError(HTTPException):
    """Raised when login credentials are invalid."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )


class EmailAlreadyExistsError(HTTPException):
    """Raised when attempting to register with an existing email."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )


class UsernameAlreadyExistsError(HTTPException):
    """Raised when attempting to register with an existing username."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this username already exists.",
        )
