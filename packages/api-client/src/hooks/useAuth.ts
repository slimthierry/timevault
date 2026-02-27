import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, LoginRequest, User, UserCreate } from "@timevault/types";

import { authApi } from "../endpoints/auth";
import { setAccessToken, clearTokens } from "../client";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useMe() {
  return useQuery<User>({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAccessToken(data.tokens.access_token);
      localStorage.setItem("timevault_refresh_token", data.tokens.refresh_token);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, UserCreate>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAccessToken(data.tokens.access_token);
      localStorage.setItem("timevault_refresh_token", data.tokens.refresh_token);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearTokens();
    queryClient.clear();
    window.location.href = "/login";
  };
}
