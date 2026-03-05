/**
 * TimeVault Color Theme - Deep blue/purple mystical palette
 */

export const colors = {
  // Primary - Deep Indigo
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },

  // Secondary - Deep Purple
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // Accent - Cosmic Blue
  accent: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Vault Gold - For special elements
  gold: {
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
  },

  // Status Colors
  status: {
    locked: "#6366f1",    // Indigo - capsule is sealed
    unlocked: "#10b981",  // Emerald - capsule is open
    pending: "#f59e0b",   // Amber - capsule is almost ready
    expired: "#6b7280",   // Gray - old opened capsule
  },

  // Background Gradients
  gradients: {
    vaultBg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3b0764 100%)",
    cardBg: "linear-gradient(145deg, #1e1b4b 0%, #1e3a8a 100%)",
    accentGlow: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #3b82f6 100%)",
    goldShimmer: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
  },

  // Neutrals
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
} as const;

export type ColorScale = typeof colors.primary;
export type ThemeColors = typeof colors;
