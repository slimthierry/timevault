from datetime import datetime, timezone

from fastapi import HTTPException, status


MAX_CONTENT_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def validate_open_date(open_date: datetime) -> datetime:
    """Validate that the open date is in the future.

    Args:
        open_date: The proposed open date for a capsule.

    Returns:
        The validated open date (with UTC timezone if missing).

    Raises:
        HTTPException: If the open date is not in the future.
    """
    if open_date.tzinfo is None:
        open_date = open_date.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    if open_date <= now:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Open date must be in the future.",
        )

    return open_date


def validate_content_size(content: str) -> str:
    """Validate that content does not exceed the maximum size.

    Args:
        content: The capsule content string.

    Returns:
        The validated content string.

    Raises:
        HTTPException: If the content exceeds the maximum size.
    """
    content_bytes = content.encode("utf-8")
    if len(content_bytes) > MAX_CONTENT_SIZE_BYTES:
        max_mb = MAX_CONTENT_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Content size exceeds maximum of {max_mb:.0f} MB.",
        )

    return content
