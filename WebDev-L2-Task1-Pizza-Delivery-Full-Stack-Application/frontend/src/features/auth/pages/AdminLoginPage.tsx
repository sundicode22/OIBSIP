import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginFormData } from "../schemas/auth.schema";
import { useAdminLogin } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
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
  ShieldCheckIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export function AdminLoginPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { mutate: adminLogin, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    setServerError("");
    adminLogin(data, {
      onSuccess: () => navigate("/"),
      onError: (err: any) => {
        setServerError(
          err.response?.data?.message || "Invalid administrative credentials or insufficient permissions."
        );
      },
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/30">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>
            Restricted access for authorized operators and administrators
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {serverError && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20">
                <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin Email Address</Label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@pizzaportal.com"
                  {...register("email")}
                  className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
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
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              <ShieldCheckIcon className="h-4 w-4" />
              {isPending ? "Authenticating..." : "Authorize Login"}
            </Button>
            <Link to="/login" className="text-xs text-center text-muted-foreground hover:underline">
              Switch to Standard User Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
