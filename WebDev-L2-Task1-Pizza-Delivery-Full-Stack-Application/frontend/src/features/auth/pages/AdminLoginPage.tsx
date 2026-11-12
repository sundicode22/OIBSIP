import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function AdminLoginPage() {
  return (
    <AuthLayout
      title="Admin sign in"
      description="Manage orders, the menu and ingredient stock."
      footer={
        <Link to="/login" className="underline-offset-4 hover:underline">
          Back to customer sign in
        </Link>
      }
    >
      <LoginForm mode="admin" />
    </AuthLayout>
  );
}
