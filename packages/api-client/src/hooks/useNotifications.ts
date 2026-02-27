import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Notification, NotificationListResponse } from "@timevault/types";

import {
  notificationsApi,
  type NotificationListParams,
} from "../endpoints/notifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationListParams) =>
    [...notificationKeys.all, "list", params] as const,
  upcoming: (limit?: number) =>
    [...notificationKeys.all, "upcoming", limit] as const,
};

export function useNotifications(params?: NotificationListParams) {
  return useQuery<NotificationListResponse>({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsApi.list(params),
    refetchInterval: 30_000,
  });
}

export function useUpcomingNotifications(limit?: number) {
  return useQuery({
    queryKey: notificationKeys.upcoming(limit),
    queryFn: () => notificationsApi.getUpcoming(limit),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, string>({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
