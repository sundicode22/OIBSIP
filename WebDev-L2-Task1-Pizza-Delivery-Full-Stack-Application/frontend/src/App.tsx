import { Route, Routes } from "react-router-dom";
import { RootLayout } from "@/components/layouts/RootLayout";
import { GuestRoute, ProtectedRoute } from "@/components/layouts/RouteGuards";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { InventoryPage } from "@/features/admin/pages/InventoryPage";
import {
  AdminLoginPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "@/features/auth";
import { BuildPizzaPage } from "@/features/builder/pages/BuildPizzaPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { IngredientsPage } from "@/features/ingredients/pages/IngredientsPage";
import { ManagePizzasPage } from "@/features/menu/pages/ManagePizzasPage";
import { MenuPage } from "@/features/menu/pages/MenuPage";
import { MyOrdersPage } from "@/features/orders/pages/MyOrdersPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route element={<ProtectedRoute role="customer" />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/build" element={<BuildPizzaPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/pizzas" element={<ManagePizzasPage />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
            <Route path="/admin/ingredients" element={<IngredientsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
