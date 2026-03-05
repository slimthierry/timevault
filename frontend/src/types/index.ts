// ============================================================
// TimeVault Shared Types
// ============================================================

// --- Enums ---

export enum CapsuleCategory {
  PERSONAL = "personal",
  FAMILY = "family",
  PROFESSIONAL = "professional",
  COMMUNITY = "community",
}

export enum NotificationType {
  REMINDER_WEEK = "reminder_week",
  REMINDER_DAY = "reminder_day",
  CAPSULE_OPENED = "capsule_opened",
  CAPSULE_RECEIVED = "capsule_received",
}

// --- User Types ---

export interface User {
  id: string;
  email: string;
  username: string;
  capsules_created: number;
  capsules_received: number;
  created_at: string;
}

export interface UserSummary {
  id: string;
  username: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

// --- Capsule Types ---

export interface Capsule {
  id: string;
  title: string;
  category: CapsuleCategory;
  is_public: boolean;
  open_date: string;
  is_opened: boolean;
  time_remaining_seconds: number | null;
  creator: UserSummary;
  created_at: string;
}

export interface CapsuleCreate {
  title: string;
  content: string;
  category: CapsuleCategory;
  is_public: boolean;
  open_date: string;
  recipient_emails?: string[];
}

export interface CapsuleOpenResponse {
  id: string;
  title: string;
  content: string;
  category: CapsuleCategory;
  is_public: boolean;
  open_date: string;
  is_opened: boolean;
  opened_at: string | null;
  creator: UserSummary;
  created_at: string;
}

export interface CapsuleListResponse {
  capsules: Capsule[];
  total: number;
}

// --- Chain Types ---

export interface Chain {
  id: string;
  title: string;
  description: string | null;
  total_capsules: number;
  creator: UserSummary;
  capsules: Capsule[];
  created_at: string;
}

export interface ChainCreate {
  title: string;
  description?: string;
}

export interface ChainProgress {
  id: string;
  title: string;
  total_capsules: number;
  opened_capsules: number;
  next_open_date: string | null;
  progress_percentage: number;
}

export interface ChainListResponse {
  chains: Chain[];
  total: number;
}

// --- Notification Types ---

export interface Notification {
  id: string;
  capsule_id: string;
  type: NotificationType;
  message: string;
  is_read: boolean;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
}

// --- Dashboard / Stats Types ---

export interface UserStats {
  capsules_created: number;
  capsules_received: number;
  capsules_opened: number;
  next_opening: string | null;
}

export interface UpcomingCapsule {
  id: string;
  title: string;
  category: CapsuleCategory;
  open_date: string;
  time_remaining_seconds: number;
  is_public: boolean;
}

export interface TimelineEntry {
  id: string;
  capsule_id: string;
  title: string;
  event_type: "created" | "opened" | "received";
  category: CapsuleCategory;
  event_date: string;
}

export interface DashboardResponse {
  stats: UserStats;
  upcoming: UpcomingCapsule[];
  timeline: TimelineEntry[];
}

// --- Time / Countdown Types ---

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeRemaining {
  total_seconds: number;
  parts: CountdownParts;
  formatted: string;
  is_expired: boolean;
}
