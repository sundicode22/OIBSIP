import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "Reset token is required"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
