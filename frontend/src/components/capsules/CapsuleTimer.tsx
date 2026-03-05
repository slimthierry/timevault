import React, { useEffect, useState } from "react";
import { getTimeRemaining, colors } from "@timevault/utils";
import type { CountdownParts } from "@timevault/types";

export interface CapsuleTimerProps {
  targetDate: string;
  onExpire?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { fontSize: "14px", padding: "4px 8px", gap: "4px", labelSize: "9px" },
  md: { fontSize: "24px", padding: "8px 12px", gap: "8px", labelSize: "10px" },
  lg: { fontSize: "36px", padding: "12px 16px", gap: "12px", labelSize: "12px" },
};

interface TimeUnitProps {
  value: number;
  label: string;
  size: "sm" | "md" | "lg";
}

function TimeUnit({ value, label, size }: TimeUnitProps) {
  const styles = sizeStyles[size];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <div
        style={{
          background: `${colors.primary[800]}cc`,
          border: `1px solid ${colors.primary[600]}`,
          borderRadius: "8px",
          padding: styles.padding,
          fontFamily: "monospace",
          fontSize: styles.fontSize,
          fontWeight: 700,
          color: colors.neutral[50],
          minWidth: size === "lg" ? "80px" : size === "md" ? "56px" : "36px",
          textAlign: "center",
        }}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <span
        style={{
          fontSize: styles.labelSize,
          color: colors.neutral[400],
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ size }: { size: "sm" | "md" | "lg" }) {
  const fontSize = sizeStyles[size].fontSize;
  return (
    <span
      style={{
        fontSize,
        fontWeight: 700,
        color: colors.primary[400],
        alignSelf: "flex-start",
        paddingTop: sizeStyles[size].padding.split(" ")[0],
      }}
    >
      :
    </span>
  );
}

export function CapsuleTimer({
  targetDate,
  onExpire,
  size = "md",
  className,
}: CapsuleTimerProps) {
  const [parts, setParts] = useState<CountdownParts>(() => {
    const remaining = getTimeRemaining(targetDate);
    return remaining.parts;
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);

      if (remaining.is_expired) {
        setExpired(true);
        clearInterval(interval);
        onExpire?.();
        return;
      }

      setParts(remaining.parts);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (expired) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 24px",
          background: `${colors.status.unlocked}22`,
          border: `2px solid ${colors.status.unlocked}`,
          borderRadius: "12px",
          color: colors.status.unlocked,
          fontSize: sizeStyles[size].fontSize,
          fontWeight: 700,
        }}
      >
        Time Capsule Unlocked!
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: sizeStyles[size].gap,
      }}
    >
      <TimeUnit value={parts.days} label="Days" size={size} />
      <Separator size={size} />
      <TimeUnit value={parts.hours} label="Hours" size={size} />
      <Separator size={size} />
      <TimeUnit value={parts.minutes} label="Min" size={size} />
      <Separator size={size} />
      <TimeUnit value={parts.seconds} label="Sec" size={size} />
    </div>
  );
}
