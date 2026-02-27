import React from "react";
import type { TimelineEntry, CapsuleCategory } from "@timevault/types";
import { colors, formatRelativeTime } from "@timevault/utils";

export interface TimelineProps {
  entries: TimelineEntry[];
  onEntryClick?: (entry: TimelineEntry) => void;
  className?: string;
}

const eventTypeConfig: Record<
  string,
  { label: string; color: string; iconPath: string }
> = {
  created: {
    label: "Created",
    color: colors.primary[400],
    iconPath: "M12 4v16m8-8H4",
  },
  opened: {
    label: "Opened",
    color: colors.status.unlocked,
    iconPath:
      "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
  },
  received: {
    label: "Received",
    color: colors.accent[400],
    iconPath:
      "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  },
};

const categoryColors: Record<CapsuleCategory, string> = {
  personal: colors.secondary[400],
  family: colors.gold[400],
  professional: colors.accent[400],
  community: colors.primary[300],
};

interface TimelineNodeProps {
  entry: TimelineEntry;
  isLast: boolean;
  onClick?: (entry: TimelineEntry) => void;
}

function TimelineNode({ entry, isLast, onClick }: TimelineNodeProps) {
  const config = eventTypeConfig[entry.event_type] || eventTypeConfig.created;

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      {/* Timeline connector */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "16px",
          minWidth: "40px",
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: `${config.color}22`,
            border: `2px solid ${config.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={config.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={config.iconPath} />
          </svg>
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div
            style={{
              width: "2px",
              flex: 1,
              background: colors.primary[700],
              minHeight: "20px",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        onClick={() => onClick?.(entry)}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            onClick(entry);
          }
        }}
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : "20px",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: config.color,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {config.label}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: categoryColors[entry.category],
              background: `${categoryColors[entry.category]}15`,
              padding: "1px 6px",
              borderRadius: "4px",
              textTransform: "capitalize",
            }}
          >
            {entry.category}
          </span>
        </div>

        <h4
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: colors.neutral[100],
            margin: "0 0 4px 0",
            lineHeight: 1.3,
          }}
        >
          {entry.title}
        </h4>

        <span
          style={{
            fontSize: "12px",
            color: colors.neutral[500],
          }}
        >
          {formatRelativeTime(entry.event_date)}
        </span>
      </div>
    </div>
  );
}

export function Timeline({ entries, onEntryClick, className }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div
        className={className}
        style={{
          background: `${colors.primary[900]}cc`,
          border: `1px solid ${colors.primary[700]}`,
          borderRadius: "12px",
          padding: "40px 24px",
          textAlign: "center",
          color: colors.neutral[500],
          fontSize: "14px",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.neutral[600]}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: "0 auto 12px" }}
        >
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ margin: 0 }}>No timeline events yet.</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
          Create your first time capsule to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: `${colors.primary[900]}cc`,
        border: `1px solid ${colors.primary[700]}`,
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: colors.neutral[200],
          margin: "0 0 20px 0",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Activity Timeline
      </h3>

      {entries.map((entry, index) => (
        <TimelineNode
          key={entry.id}
          entry={entry}
          isLast={index === entries.length - 1}
          onClick={onEntryClick}
        />
      ))}
    </div>
  );
}
