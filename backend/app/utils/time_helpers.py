from datetime import datetime, timezone


def calculate_time_remaining(open_date: datetime) -> float:
    """Calculate seconds remaining until the open date.

    Args:
        open_date: The datetime when the capsule can be opened.

    Returns:
        Number of seconds remaining. Negative if already past.
    """
    now = datetime.now(timezone.utc)
    if open_date.tzinfo is None:
        open_date = open_date.replace(tzinfo=timezone.utc)
    delta = open_date - now
    return delta.total_seconds()


def format_duration(seconds: float) -> str:
    """Format seconds into a human-readable duration string.

    Args:
        seconds: Total seconds to format.

    Returns:
        Formatted string like "2d 5h 30m 15s" or "Ready to open!"
    """
    if seconds <= 0:
        return "Ready to open!"

    parts = get_countdown_parts(seconds)
    components = []
    if parts["days"] > 0:
        components.append(f"{parts['days']}d")
    if parts["hours"] > 0:
        components.append(f"{parts['hours']}h")
    if parts["minutes"] > 0:
        components.append(f"{parts['minutes']}m")
    if parts["seconds"] > 0 or not components:
        components.append(f"{parts['seconds']}s")

    return " ".join(components)


def is_ready_to_open(open_date: datetime) -> bool:
    """Check if a capsule's open date has been reached.

    Args:
        open_date: The datetime when the capsule can be opened.

    Returns:
        True if current time is at or past the open date.
    """
    return calculate_time_remaining(open_date) <= 0


def get_countdown_parts(total_seconds: float) -> dict[str, int]:
    """Break total seconds into days, hours, minutes, and seconds.

    Args:
        total_seconds: Total seconds to break down.

    Returns:
        Dictionary with keys: days, hours, minutes, seconds.
    """
    total = max(0, int(total_seconds))
    days = total // 86400
    remaining = total % 86400
    hours = remaining // 3600
    remaining = remaining % 3600
    minutes = remaining // 60
    seconds = remaining % 60

    return {
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
    }
