import React from "react";
import type { UserStats } from "@timevault/types";
import { colors, formatRelativeTime } from "@timevault/utils";

export interface StatsOverviewProps {
  stats: UserStats;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  iconPath: string;
  accentColor: string;
}

function StatCard({ label, value, subtitle, iconPath, accentColor }: StatCardProps) {
  return (
    <div
      style={{
        background: `${colors.primary[900]}cc`,
        border: `1px solid ${colors.primary[700]}`,
        borderRadius: "12px",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `${accentColor}15`,
          filter: "blur(20px)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: `${accentColor}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPath} />
          </svg>
        </div>
        <span
          style={{
            fontSize: "12px",
            color: colors.neutral[400],
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: colors.neutral[50],
          lineHeight: 1,
          marginBottom: subtitle ? "6px" : 0,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: "12px",
            color: colors.neutral[500],
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function StatsOverview({ stats, className }: StatsOverviewProps) {
  const nextOpeningText = stats.next_opening
    ? formatRelativeTime(stats.next_opening)
    : "None scheduled";

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
      }}
    >
      <StatCard
        label="Capsules Created"
        value={stats.capsules_created}
        iconPath="M12 4v16m8-8H4"
        accentColor={colors.primary[400]}
      />
      <StatCard
        label="Capsules Received"
        value={stats.capsules_received}
        iconPath="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        accentColor={colors.accent[400]}
      />
      <StatCard
        label="Capsules Opened"
        value={stats.capsules_opened}
        iconPath="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        accentColor={colors.status.unlocked}
      />
      <StatCard
        label="Next Opening"
        value={nextOpeningText}
        subtitle={stats.next_opening ? new Date(stats.next_opening).toLocaleDateString() : undefined}
        iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        accentColor={colors.gold[400]}
      />
    </div>
  );
}
