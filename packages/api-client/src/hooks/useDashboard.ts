import { useQuery } from "@tanstack/react-query";
import type {
  DashboardResponse,
  TimelineEntry,
  UpcomingCapsule,
  UserStats,
} from "@timevault/types";

import { dashboardApi } from "../endpoints/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  timeline: (limit?: number) =>
    [...dashboardKeys.all, "timeline", limit] as const,
  upcoming: (limit?: number) =>
    [...dashboardKeys.all, "upcoming", limit] as const,
  full: () => [...dashboardKeys.all, "full"] as const,
};

export function useDashboardStats() {
  return useQuery<UserStats>({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardApi.getStats,
  });
}

export function useDashboardTimeline(limit?: number) {
  return useQuery<TimelineEntry[]>({
    queryKey: dashboardKeys.timeline(limit),
    queryFn: () => dashboardApi.getTimeline(limit),
  });
}

export function useDashboardUpcoming(limit?: number) {
  return useQuery<UpcomingCapsule[]>({
    queryKey: dashboardKeys.upcoming(limit),
    queryFn: () => dashboardApi.getUpcoming(limit),
  });
}

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: dashboardKeys.full(),
    queryFn: dashboardApi.getAll,
    staleTime: 60_000,
  });
}
