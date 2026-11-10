import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/useAuth";
import { Link } from "react-router-dom";
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
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setServerError("");
    forgotPassword(data, {
      onSuccess: () => setSuccess(true),
      onError: (err: any) => {
        setServerError(err.response?.data?.message || "Failed to send reset link. Please try again.");
      },
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <KeyIcon className="h-6 w-6" />
            <span>Account Recovery</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot password</CardTitle>
          <CardDescription>
            Enter your registered email address and we will dispatch a password recovery link
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-600 font-medium border border-emerald-500/20">
              <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                If an account with that email exists, an email with reset instructions has been sent.
              </span>
            </div>
            <Button asChild className="w-full gap-2">
              <Link to="/login">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Sign In
              </Link>
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
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full gap-2" disabled={isPending}>
                <KeyIcon className="h-4 w-4" />
                {isPending ? "Sending link..." : "Send Reset Link"}
              </Button>
              <Link to="/login" className="text-xs text-center text-muted-foreground hover:underline">
                Return to Login
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
