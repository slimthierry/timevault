import type {
  Capsule,
  CapsuleCreate,
  CapsuleListResponse,
  CapsuleOpenResponse,
} from "@timevault/types";
import { apiClient } from "../client";

export interface CapsuleListParams {
  skip?: number;
  limit?: number;
}

export const capsulesApi = {
  create: async (data: CapsuleCreate): Promise<Capsule> => {
    const response = await apiClient.post<Capsule>("/capsules/create", data);
    return response.data;
  },

  listMyCapsules: async (
    params: CapsuleListParams = {}
  ): Promise<CapsuleListResponse> => {
    const response = await apiClient.get<CapsuleListResponse>(
      "/capsules/my-capsules",
      { params }
    );
    return response.data;
  },

  listReceived: async (
    params: CapsuleListParams = {}
  ): Promise<CapsuleListResponse> => {
    const response = await apiClient.get<CapsuleListResponse>(
      "/capsules/received",
      { params }
    );
    return response.data;
  },

  listPublic: async (
    params: CapsuleListParams = {}
  ): Promise<CapsuleListResponse> => {
    const response = await apiClient.get<CapsuleListResponse>(
      "/capsules/public",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Capsule> => {
    const response = await apiClient.get<Capsule>(`/capsules/${id}`);
    return response.data;
  },

  open: async (id: string): Promise<CapsuleOpenResponse> => {
    const response = await apiClient.post<CapsuleOpenResponse>(
      `/capsules/${id}/open`
    );
    return response.data;
  },
};
