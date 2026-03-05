// --- Client ---
export { apiClient, setAccessToken, getAccessToken, clearTokens } from "./client";

// --- Endpoint APIs ---
export { authApi } from "./endpoints/auth";
export { capsulesApi } from "./endpoints/capsules";
export { chainsApi } from "./endpoints/chains";
export { notificationsApi } from "./endpoints/notifications";
export { dashboardApi } from "./endpoints/dashboard";

// --- Endpoint Types ---
export type { CapsuleListParams } from "./endpoints/capsules";
export type { ChainListParams } from "./endpoints/chains";
export type { NotificationListParams } from "./endpoints/notifications";

// --- Auth Hooks ---
export { useMe, useLogin, useRegister, useLogout, authKeys } from "./hooks/useAuth";

// --- Capsule Hooks ---
export {
  useMyCapsules,
  useReceivedCapsules,
  usePublicCapsules,
  useCapsule,
  useCreateCapsule,
  useOpenCapsule,
  capsuleKeys,
} from "./hooks/useCapsules";

// --- Chain Hooks ---
export {
  useMyChains,
  useChain,
  useChainProgress,
  useCreateChain,
  useAddCapsuleToChain,
  chainKeys,
} from "./hooks/useChains";

// --- Notification Hooks ---
export {
  useNotifications,
  useUpcomingNotifications,
  useMarkNotificationRead,
  notificationKeys,
} from "./hooks/useNotifications";

// --- Dashboard Hooks ---
export {
  useDashboardStats,
  useDashboardTimeline,
  useDashboardUpcoming,
  useDashboard,
  dashboardKeys,
} from "./hooks/useDashboard";
