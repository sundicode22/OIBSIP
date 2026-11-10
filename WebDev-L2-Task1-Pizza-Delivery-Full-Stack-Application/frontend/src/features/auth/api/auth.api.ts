import { apiClient } from "@/lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
} from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data;
  },

  adminLogin: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/admin-login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.get<ApiResponse<unknown>>(`/auth/verify-email/${token}`);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>("/auth/reset-password", payload);
    return data;
  },
};
