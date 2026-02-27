import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Capsule,
  CapsuleCreate,
  CapsuleListResponse,
  CapsuleOpenResponse,
} from "@timevault/types";

import { capsulesApi, type CapsuleListParams } from "../endpoints/capsules";

export const capsuleKeys = {
  all: ["capsules"] as const,
  lists: () => [...capsuleKeys.all, "list"] as const,
  myCapsules: (params?: CapsuleListParams) =>
    [...capsuleKeys.lists(), "mine", params] as const,
  received: (params?: CapsuleListParams) =>
    [...capsuleKeys.lists(), "received", params] as const,
  public: (params?: CapsuleListParams) =>
    [...capsuleKeys.lists(), "public", params] as const,
  detail: (id: string) => [...capsuleKeys.all, "detail", id] as const,
};

export function useMyCapsules(params?: CapsuleListParams) {
  return useQuery<CapsuleListResponse>({
    queryKey: capsuleKeys.myCapsules(params),
    queryFn: () => capsulesApi.listMyCapsules(params),
  });
}

export function useReceivedCapsules(params?: CapsuleListParams) {
  return useQuery<CapsuleListResponse>({
    queryKey: capsuleKeys.received(params),
    queryFn: () => capsulesApi.listReceived(params),
  });
}

export function usePublicCapsules(params?: CapsuleListParams) {
  return useQuery<CapsuleListResponse>({
    queryKey: capsuleKeys.public(params),
    queryFn: () => capsulesApi.listPublic(params),
  });
}

export function useCapsule(id: string) {
  return useQuery<Capsule>({
    queryKey: capsuleKeys.detail(id),
    queryFn: () => capsulesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCapsule() {
  const queryClient = useQueryClient();

  return useMutation<Capsule, Error, CapsuleCreate>({
    mutationFn: capsulesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
    },
  });
}

export function useOpenCapsule() {
  const queryClient = useQueryClient();

  return useMutation<CapsuleOpenResponse, Error, string>({
    mutationFn: capsulesApi.open,
    onSuccess: (_data, capsuleId) => {
      queryClient.invalidateQueries({
        queryKey: capsuleKeys.detail(capsuleId),
      });
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
    },
  });
}
