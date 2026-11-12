import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/lib/session";

/** Requires a signed-in user; optionally restricts to admins or to customers. */
export function ProtectedRoute({ role }: { role?: "admin" | "customer" }) {
  const { isAuthenticated, isAdmin } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = role === "admin" ? "/admin-login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  if (role === "admin" && !isAdmin) return <Navigate to="/" replace />;
  if (role === "customer" && isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}

/** Keeps signed-in users away from the sign-in and registration screens. */
export function GuestRoute() {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
