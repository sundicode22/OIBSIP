import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormAlert } from "@/components/shared/FormAlert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { applyServerErrors } from "@/lib/api";
import { AuthLayout } from "../components/AuthLayout";
import { useResetPassword } from "../hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/auth.schema";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = ({ password }: ResetPasswordFormData) => {
    setServerError(null);
    resetPassword.mutate(
      { token, password },
      {
        onSuccess: () => navigate("/login", { replace: true }),
        onError: (error) => setServerError(applyServerErrors(form, error)),
      },
    );
  };

  return (
    <AuthLayout
      title="Choose a new password"
      description="Pick something you haven't used before."
      footer={
        <Link to="/login" className="underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      {!token ? (
        <FormAlert
          title="Invalid link"
          message="This reset link is missing its token. Request a new one from the forgot password page."
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormAlert message={serverError} title="Could not reset password" />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="At least 6 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="Repeat the password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              <KeyRound />
              {resetPassword.isPending ? "Saving..." : "Update password"}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}
