import { useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FormAlert } from "@/components/shared/FormAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api";
import { AuthLayout } from "../components/AuthLayout";
import { useVerifyEmail } from "../hooks/useAuth";

export function VerifyEmailPage() {
  const { token: paramToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const token = paramToken ?? searchParams.get("token") ?? "";
  const verify = useVerifyEmail();
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    verify.mutate(token);
  }, [token, verify]);

  return (
    <AuthLayout title="Email verification" description="Confirming your email address.">
      <div className="space-y-5">
        {!token && (
          <FormAlert title="Invalid link" message="The verification link is missing its token." />
        )}
        {token && (verify.isPending || verify.isIdle) && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        )}
        {verify.isSuccess && (
          <FormAlert
            variant="success"
            title="Email verified"
            message={verify.data.message ?? "Your email is verified. You can now sign in."}
          />
        )}
        {verify.isError && (
          <FormAlert
            title="Verification failed"
            message={getErrorMessage(verify.error, "The link is invalid or has expired.")}
          />
        )}
        <Button asChild className="w-full" variant={verify.isSuccess ? "default" : "outline"}>
          <Link to="/login">Go to sign in</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
