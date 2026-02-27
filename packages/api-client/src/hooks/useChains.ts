import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Chain,
  ChainCreate,
  ChainListResponse,
  ChainProgress,
} from "@timevault/types";

import { chainsApi, type ChainListParams } from "../endpoints/chains";
import { capsuleKeys } from "./useCapsules";

export const chainKeys = {
  all: ["chains"] as const,
  lists: () => [...chainKeys.all, "list"] as const,
  myChains: (params?: ChainListParams) =>
    [...chainKeys.lists(), "mine", params] as const,
  detail: (id: string) => [...chainKeys.all, "detail", id] as const,
  progress: (id: string) => [...chainKeys.all, "progress", id] as const,
};

export function useMyChains(params?: ChainListParams) {
  return useQuery<ChainListResponse>({
    queryKey: chainKeys.myChains(params),
    queryFn: () => chainsApi.listMyChains(params),
  });
}

export function useChain(id: string) {
  return useQuery<Chain>({
    queryKey: chainKeys.detail(id),
    queryFn: () => chainsApi.getById(id),
    enabled: !!id,
  });
}

export function useChainProgress(id: string) {
  return useQuery<ChainProgress>({
    queryKey: chainKeys.progress(id),
    queryFn: () => chainsApi.getProgress(id),
    enabled: !!id,
  });
}

export function useCreateChain() {
  const queryClient = useQueryClient();

  return useMutation<Chain, Error, ChainCreate>({
    mutationFn: chainsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chainKeys.lists() });
    },
  });
}

export function useAddCapsuleToChain() {
  const queryClient = useQueryClient();

  return useMutation<Chain, Error, { chainId: string; capsuleId: string }>({
    mutationFn: ({ chainId, capsuleId }) =>
      chainsApi.addCapsule(chainId, capsuleId),
    onSuccess: (_data, { chainId }) => {
      queryClient.invalidateQueries({ queryKey: chainKeys.detail(chainId) });
      queryClient.invalidateQueries({ queryKey: chainKeys.lists() });
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
    },
  });
}
