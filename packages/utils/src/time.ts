import type { CountdownParts, TimeRemaining } from "@timevault/types";

/**
 * Get the remaining time until a target date, broken into parts.
 */
export function getTimeRemaining(targetDate: string | Date): TimeRemaining {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const totalMs = target.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const isExpired = totalMs <= 0;

  const parts = getCountdownParts(totalSeconds);

  return {
    total_seconds: totalSeconds,
    parts,
    formatted: formatCountdown(parts),
    is_expired: isExpired,
  };
}

/**
 * Break total seconds into days, hours, minutes, and seconds.
 */
export function getCountdownParts(totalSeconds: number): CountdownParts {
  const total = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { days, hours, minutes, seconds };
}

/**
 * Format countdown parts into a string like "02d : 05h : 30m : 15s".
 */
export function formatCountdown(parts: CountdownParts): string {
  const pad = (n: number): string => n.toString().padStart(2, "0");

  if (parts.days > 0) {
    return `${pad(parts.days)}d : ${pad(parts.hours)}h : ${pad(parts.minutes)}m : ${pad(parts.seconds)}s`;
  }
  if (parts.hours > 0) {
    return `${pad(parts.hours)}h : ${pad(parts.minutes)}m : ${pad(parts.seconds)}s`;
  }
  return `${pad(parts.minutes)}m : ${pad(parts.seconds)}s`;
}

/**
 * Format a date string into a human-readable relative time description.
 * Examples: "2 days ago", "in 3 hours", "just now"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;

  if (seconds < 60) {
    label = "just now";
    return label;
  } else if (minutes < 60) {
    label = minutes === 1 ? "1 minute" : `${minutes} minutes`;
  } else if (hours < 24) {
    label = hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (days < 7) {
    label = days === 1 ? "1 day" : `${days} days`;
  } else if (weeks < 5) {
    label = weeks === 1 ? "1 week" : `${weeks} weeks`;
  } else if (months < 12) {
    label = months === 1 ? "1 month" : `${months} months`;
  } else {
    label = years === 1 ? "1 year" : `${years} years`;
  }

  return isFuture ? `in ${label}` : `${label} ago`;
}

/**
 * Check if a target date has passed (capsule is expired / ready to open).
 */
export function isExpired(targetDate: string | Date): boolean {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  return new Date().getTime() >= target.getTime();
}
