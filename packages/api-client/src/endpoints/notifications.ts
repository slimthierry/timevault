import type {
  Notification,
  NotificationListResponse,
} from "@timevault/types";
import { apiClient } from "../client";

export interface NotificationListParams {
  skip?: number;
  limit?: number;
}

export const notificationsApi = {
  list: async (
    params: NotificationListParams = {}
  ): Promise<NotificationListResponse> => {
    const response = await apiClient.get<NotificationListResponse>(
      "/notifications/",
      { params }
    );
    return response.data;
  },

  markRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.put<Notification>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  getUpcoming: async (
    limit: number = 20
  ): Promise<{ notifications: Notification[]; total: number }> => {
    const response = await apiClient.get<{
      notifications: Notification[];
      total: number;
    }>("/notifications/upcoming", { params: { limit } });
    return response.data;
  },
};
