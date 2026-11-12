import type { SessionUser } from "@/types/domain";

export interface AuthResponse {
  token: string;
  user: SessionUser;
}

export interface RegisteredUser extends SessionUser {
  isEmailVerified: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
