import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../hooks/useAuth";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";

export function VerifyEmailPage() {
  const { token: paramToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const token = paramToken || searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const { mutate: verify } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL request.");
      return;
    }

    verify(token, {
      onSuccess: (res: any) => {
        setStatus("success");
        setMessage(res?.message || "Email verified successfully! You can now access your account.");
      },
      onError: (err: any) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed or token has expired.");
      },
    });
  }, [token, verify]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <EnvelopeOpenIcon className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>Confirming your email address registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Verifying security token...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-600 font-medium border border-emerald-500/20 text-left">
                <CheckBadgeIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 text-left">
                <ExclamationTriangleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
