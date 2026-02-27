import type {
  DashboardResponse,
  TimelineEntry,
  UpcomingCapsule,
  UserStats,
} from "@timevault/types";
import { apiClient } from "../client";

export const dashboardApi = {
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>("/dashboard/stats");
    return response.data;
  },

  getTimeline: async (limit: number = 20): Promise<TimelineEntry[]> => {
    const response = await apiClient.get<TimelineEntry[]>(
      "/dashboard/timeline",
      { params: { limit } }
    );
    return response.data;
  },

  getUpcoming: async (limit: number = 10): Promise<UpcomingCapsule[]> => {
    const response = await apiClient.get<UpcomingCapsule[]>(
      "/dashboard/upcoming",
      { params: { limit } }
    );
    return response.data;
  },

  getAll: async (): Promise<DashboardResponse> => {
    const [stats, upcoming, timeline] = await Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getUpcoming(),
      dashboardApi.getTimeline(),
    ]);
    return { stats, upcoming, timeline };
  },
};
