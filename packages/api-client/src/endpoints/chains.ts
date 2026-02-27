import type {
  Chain,
  ChainCreate,
  ChainListResponse,
  ChainProgress,
} from "@timevault/types";
import { apiClient } from "../client";

export interface ChainListParams {
  skip?: number;
  limit?: number;
}

export const chainsApi = {
  create: async (data: ChainCreate): Promise<Chain> => {
    const response = await apiClient.post<Chain>("/chains/create", data);
    return response.data;
  },

  listMyChains: async (
    params: ChainListParams = {}
  ): Promise<ChainListResponse> => {
    const response = await apiClient.get<ChainListResponse>(
      "/chains/my-chains",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Chain> => {
    const response = await apiClient.get<Chain>(`/chains/${id}`);
    return response.data;
  },

  getProgress: async (id: string): Promise<ChainProgress> => {
    const response = await apiClient.get<ChainProgress>(
      `/chains/${id}/progress`
    );
    return response.data;
  },

  addCapsule: async (chainId: string, capsuleId: string): Promise<Chain> => {
    const response = await apiClient.post<Chain>(`/chains/${chainId}/add`, {
      capsule_id: capsuleId,
    });
    return response.data;
  },
};
