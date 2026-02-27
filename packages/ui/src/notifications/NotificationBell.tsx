import React from "react";
import { colors } from "@timevault/utils";

export interface NotificationBellProps {
  unreadCount: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({
  unreadCount,
  onClick,
  className,
}: NotificationBellProps) {
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount.toString();

  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
      style={{
        position: "relative",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "8px",
        transition: "background-color 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Bell SVG icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={hasUnread ? colors.gold[400] : colors.neutral[400]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
        {hasUnread && (
          <circle cx="18" cy="5" r="0" fill="none" />
        )}
      </svg>

      {/* Animated ring effect for unread */}
      {hasUnread && (
        <span
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            animation: "timevault-bell-ring 2s ease-in-out infinite",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle
              cx="6"
              cy="6"
              r="5"
              fill="none"
              stroke={colors.gold[400]}
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </span>
      )}

      {/* Unread count badge */}
      {hasUnread && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "0px",
            backgroundColor: colors.secondary[600],
            color: colors.neutral[50],
            fontSize: "10px",
            fontWeight: 700,
            lineHeight: 1,
            minWidth: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            padding: "0 4px",
            border: `2px solid ${colors.primary[950]}`,
            boxShadow: `0 0 6px ${colors.secondary[600]}88`,
          }}
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}
