import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/useAuth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import {
  LockClosedIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setServerError("");

    if (!token) {
      setServerError("Verification token is missing or has expired from the link.");
      return;
    }

    resetPassword(
      { token, password: data.password },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => navigate("/login"), 3000);
        },
        onError: (err: any) => {
          setServerError(
            err.response?.data?.message || "Failed to reset password. The link might be expired."
          );
        },
      }
    );
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <LockClosedIcon className="h-6 w-6" />
            <span>Update Credentials</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
          <CardDescription>Enter and confirm your new account password</CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-600 font-medium border border-emerald-500/20">
              <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Password reset successfully! Redirecting you to login...</span>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4">
              {serverError && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20">
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`pl-9 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`pl-9 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full gap-2" disabled={isPending}>
                <LockClosedIcon className="h-4 w-4" />
                {isPending ? "Updating password..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
