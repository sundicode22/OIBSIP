import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useAuth";
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
  UserPlusIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError("");
    setSuccessMessage("");

    register(data, {
      onSuccess: (res) => {
        setSuccessMessage(
          res.message || "Registration successful! Please check your email to verify your account."
        );
        setTimeout(() => navigate("/login"), 3000);
      },
      onError: (err: any) => {
        setServerError(
          err.response?.data?.message || "Registration could not be completed. Please try again."
        );
      },
    });
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <UserPlusIcon className="h-6 w-6" />
            <span>New Account</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Register</CardTitle>
          <CardDescription>
            Join PizzaPortal to manage orders, inventory, and operations
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

            {successMessage && (
              <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 font-medium border border-emerald-500/20">
                <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  {...formRegister("name")}
                  className={`pl-9 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  {...formRegister("email")}
                  className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...formRegister("phone")}
                  className={`pl-9 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...formRegister("password")}
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
              <UserPlusIcon className="h-4 w-4" />
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
