import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { session } from "@/lib/session";
import { authApi } from "../api/auth.api";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ data }) => {
      queryClient.clear();
      session.set(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.adminLogin(payload),
    onSuccess: ({ data }) => {
      queryClient.clear();
      session.set(data.token, data.user);
      toast.success(`Signed in as administrator ${data.user.name}`);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onSuccess: () => toast.success("Password updated. Please sign in."),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return () => {
    const wasAdmin = session.getUser()?.role === "ADMIN";
    session.clear();
    queryClient.clear();
    toast.info("You have been signed out.");
    navigate(wasAdmin ? "/admin-login" : "/login", { replace: true });
  };
}
