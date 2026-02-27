import React from "react";
import type { Chain, Capsule } from "@timevault/types";
import { colors, getTimeRemaining, formatRelativeTime } from "@timevault/utils";

export interface CapsuleChainViewProps {
  chain: Chain;
  onCapsuleClick?: (capsule: Capsule) => void;
  className?: string;
}

interface ChainNodeProps {
  capsule: Capsule;
  index: number;
  total: number;
  onClick?: (capsule: Capsule) => void;
}

function ChainNode({ capsule, index, total, onClick }: ChainNodeProps) {
  const timeRemaining = getTimeRemaining(capsule.open_date);
  const isLocked = !capsule.is_opened && !timeRemaining.is_expired;
  const isReady = !capsule.is_opened && timeRemaining.is_expired;
  const isLast = index === total - 1;

  const nodeColor = capsule.is_opened
    ? colors.status.unlocked
    : isReady
      ? colors.status.pending
      : colors.status.locked;

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      {/* Timeline line and dot */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "16px",
          minWidth: "32px",
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: nodeColor,
            border: `3px solid ${colors.primary[800]}`,
            boxShadow: `0 0 8px ${nodeColor}66`,
            zIndex: 1,
            flexShrink: 0,
          }}
        />
        {/* Line */}
        {!isLast && (
          <div
            style={{
              width: "2px",
              flex: 1,
              background: `linear-gradient(to bottom, ${nodeColor}, ${colors.primary[700]})`,
              minHeight: "40px",
            }}
          />
        )}
      </div>

      {/* Content card */}
      <div
        onClick={() => onClick?.(capsule)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick?.(capsule);
          }
        }}
        style={{
          flex: 1,
          background: `${colors.primary[900]}cc`,
          border: `1px solid ${colors.primary[700]}`,
          borderRadius: "8px",
          padding: "14px 16px",
          marginBottom: isLast ? 0 : "12px",
          cursor: onClick ? "pointer" : "default",
          transition: "border-color 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: colors.neutral[500],
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Capsule {index + 1} of {total}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: nodeColor,
              fontWeight: 600,
            }}
          >
            {capsule.is_opened ? "Opened" : isReady ? "Ready" : "Locked"}
          </span>
        </div>

        <h4
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: colors.neutral[100],
            margin: "0 0 8px 0",
          }}
        >
          {capsule.title}
        </h4>

        {isLocked && (
          <div
            style={{
              fontSize: "13px",
              fontFamily: "monospace",
              color: colors.accent[400],
            }}
          >
            {timeRemaining.formatted}
          </div>
        )}

        {capsule.is_opened && (
          <div style={{ fontSize: "12px", color: colors.neutral[500] }}>
            Opened {formatRelativeTime(capsule.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}

export function CapsuleChainView({
  chain,
  onCapsuleClick,
  className,
}: CapsuleChainViewProps) {
  const openedCount = chain.capsules.filter((c) => c.is_opened).length;
  const progressPercent =
    chain.total_capsules > 0
      ? Math.round((openedCount / chain.total_capsules) * 100)
      : 0;

  return (
    <div
      className={className}
      style={{
        background: colors.gradients.cardBg,
        border: `1px solid ${colors.primary[700]}`,
        borderRadius: "12px",
        padding: "24px",
        color: colors.neutral[100],
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            margin: "0 0 4px 0",
            color: colors.neutral[50],
          }}
        >
          {chain.title}
        </h3>
        {chain.description && (
          <p
            style={{
              fontSize: "14px",
              color: colors.neutral[400],
              margin: "0 0 12px 0",
            }}
          >
            {chain.description}
          </p>
        )}

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              flex: 1,
              height: "6px",
              background: colors.primary[800],
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: colors.gradients.accentGlow,
                borderRadius: "3px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", color: colors.neutral[400] }}>
            {openedCount}/{chain.total_capsules} opened ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Chain nodes */}
      <div>
        {chain.capsules.map((capsule, index) => (
          <ChainNode
            key={capsule.id}
            capsule={capsule}
            index={index}
            total={chain.capsules.length}
            onClick={onCapsuleClick}
          />
        ))}
      </div>

      {chain.capsules.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            color: colors.neutral[500],
            fontSize: "14px",
          }}
        >
          No capsules in this chain yet.
        </div>
      )}
    </div>
  );
}
