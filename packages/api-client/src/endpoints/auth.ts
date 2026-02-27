import type {
  AuthResponse,
  LoginRequest,
  User,
  UserCreate,
} from "@timevault/types";
import { apiClient } from "../client";

export const authApi = {
  register: async (data: UserCreate): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
