import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { toast } from "sonner";
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success(`Welcome back, ${res.data.user.name || "User"}!`);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    },
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.adminLogin(payload),
    onSuccess: (res) => {
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Admin authorized successfully!");
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Admin authorization rejected.");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Registration successful! Please verify your email.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Email verified successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Verification failed or token expired.");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
    onSuccess: () => {
      toast.info("Password reset instructions dispatched to your email.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Unable to send password reset link.");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onSuccess: () => {
      toast.success("Password updated successfully! Redirecting...");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
    toast.info("You have been signed out.");
    window.location.href = "/login";
  };
}
