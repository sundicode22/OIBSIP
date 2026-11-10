export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
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

export interface ApiResponse<T = unknown> {
  status: boolean | string;
  statusCode: number;
  message?: string;
  data?: T;
}
