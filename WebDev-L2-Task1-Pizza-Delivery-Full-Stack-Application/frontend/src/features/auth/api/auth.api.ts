import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/api";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  RegisteredUser,
  ResetPasswordPayload,
} from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data;
  },

  adminLogin: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/admin-login", payload);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<RegisteredUser>>("/auth/register", payload);
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
      `/auth/verify-email/${encodeURIComponent(token)}`,
    );
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<unknown>>("/auth/reset-password", payload);
    return data;
  },
};
