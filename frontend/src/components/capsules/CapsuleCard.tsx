import React from "react";
import type { Capsule, CapsuleCategory } from "@timevault/types";
import { formatRelativeTime, getTimeRemaining, colors, cn } from "@timevault/utils";

const categoryIcons: Record<CapsuleCategory, string> = {
  personal: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  family: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  professional: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  community: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
};

const categoryLabels: Record<CapsuleCategory, string> = {
  personal: "Personal",
  family: "Family",
  professional: "Professional",
  community: "Community",
};

export interface CapsuleCardProps {
  capsule: Capsule;
  onClick?: (capsule: Capsule) => void;
  className?: string;
}

export function CapsuleCard({ capsule, onClick, className }: CapsuleCardProps) {
  const timeRemaining = getTimeRemaining(capsule.open_date);
  const isLocked = !capsule.is_opened && !timeRemaining.is_expired;
  const isReady = !capsule.is_opened && timeRemaining.is_expired;

  const statusColor = capsule.is_opened
    ? colors.status.unlocked
    : isReady
      ? colors.status.pending
      : colors.status.locked;

  const statusLabel = capsule.is_opened
    ? "Opened"
    : isReady
      ? "Ready to Open"
      : "Locked";

  return (
    <div
      className={cn("timevault-capsule-card", className)}
      onClick={() => onClick?.(capsule)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.(capsule);
        }
      }}
      style={{
        background: colors.gradients.cardBg,
        border: `1px solid ${colors.primary[700]}`,
        borderRadius: "12px",
        padding: "20px",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        color: colors.neutral[100],
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Status indicator */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: "12px", color: colors.neutral[400] }}>
          {statusLabel}
        </span>
      </div>

      {/* Category icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.secondary[400]}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={categoryIcons[capsule.category]} />
        </svg>
        <span style={{ fontSize: "12px", color: colors.secondary[400] }}>
          {categoryLabels[capsule.category]}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          margin: "0 0 8px 0",
          color: colors.neutral[50],
          lineHeight: 1.3,
        }}
      >
        {capsule.title}
      </h3>

      {/* Lock icon or open indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isLocked ? colors.primary[400] : colors.status.unlocked}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLocked ? (
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          ) : (
            <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          )}
        </svg>
      </div>

      {/* Countdown or opened info */}
      {isLocked && (
        <div
          style={{
            background: `${colors.primary[900]}88`,
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: colors.neutral[400],
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Opens in
          </span>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "monospace",
              color: colors.accent[400],
              marginTop: "4px",
            }}
          >
            {timeRemaining.formatted}
          </div>
        </div>
      )}

      {isReady && (
        <div
          style={{
            background: `${colors.status.pending}22`,
            border: `1px solid ${colors.status.pending}44`,
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "12px",
            textAlign: "center",
            color: colors.gold[400],
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Ready to Open!
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: colors.neutral[500],
          marginTop: "8px",
        }}
      >
        <span>by {capsule.creator.username}</span>
        <span>{formatRelativeTime(capsule.created_at)}</span>
      </div>

      {/* Public badge */}
      {capsule.is_public && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: `${colors.accent[600]}33`,
            border: `1px solid ${colors.accent[600]}66`,
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "10px",
            color: colors.accent[300],
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Public
        </div>
      )}
    </div>
  );
}
