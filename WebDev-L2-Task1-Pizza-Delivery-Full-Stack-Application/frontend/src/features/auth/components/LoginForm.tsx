import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useAdminLogin, useLogin } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export function LoginForm({ mode }: { mode: "user" | "admin" }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userLogin = useLogin();
  const adminLogin = useAdminLogin();
  const mutation = mode === "admin" ? adminLogin : userLogin;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormData) => {
    setServerError(null);
    mutation.mutate(values, {
      onSuccess: () => {
        const from = (location.state as { from?: string } | null)?.from;
        navigate(from ?? "/", { replace: true });
      },
      onError: (error) => setServerError(applyServerErrors(form, error)),
    });
  };

  const Icon = mode === "admin" ? ShieldCheck : LogIn;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormAlert message={serverError} title="Sign in failed" />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={mode === "admin" ? "admin@pizza.local" : "you@example.com"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                {mode === "user" && (
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <FormControl>
                <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          <Icon />
          {mutation.isPending ? "Signing in..." : mode === "admin" ? "Sign in as admin" : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
