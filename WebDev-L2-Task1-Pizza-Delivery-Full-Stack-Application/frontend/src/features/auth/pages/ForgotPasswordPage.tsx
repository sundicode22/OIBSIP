import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
import { useForgotPassword } from "../hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";

export function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    setServerError(null);
    forgotPassword.mutate(values, {
      onSuccess: () => setSentTo(values.email),
      onError: (error) => setServerError(applyServerErrors(form, error)),
    });
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      }
    >
      {sentTo ? (
        <FormAlert
          variant="success"
          title="Check your inbox"
          message={`If ${sentTo} has an account, a password reset link is on its way.`}
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormAlert message={serverError} title="Could not send the link" />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
              <Mail />
              {forgotPassword.isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}
