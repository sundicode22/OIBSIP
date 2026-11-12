import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <AuthLayout
      title="Sign in"
      description="Order your favourite pizzas or build your own."
      footer={
        <div className="flex flex-col items-center gap-2">
          <span>
            New here?{" "}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </span>
          <Link to="/admin-login" className="text-xs underline-offset-4 hover:underline">
            Administrator sign in
          </Link>
        </div>
      }
    >
      <LoginForm mode="user" />
    </AuthLayout>
  );
}
