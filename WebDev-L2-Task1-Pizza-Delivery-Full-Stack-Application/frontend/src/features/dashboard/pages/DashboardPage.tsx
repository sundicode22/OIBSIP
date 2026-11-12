import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  ChefHat,
  ClipboardList,
  CookingPot,
  Pizza,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/session";
import { useAdminOrders, useInventory } from "@/features/admin/hooks/useAdmin";
import { usePizzas } from "@/features/menu/hooks/usePizzas";
import { OrderDetailsModal } from "@/features/orders/components/OrderDetailsModal";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { useMyOrders } from "@/features/orders/hooks/useOrders";

function StatCard({
  title,
  value,
  icon: Icon,
  to,
}: {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  to: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <Link to={to} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          {value === undefined ? <Skeleton className="h-9 w-16" /> : <div className="text-3xl font-semibold">{value}</div>}
        </CardContent>
      </Link>
    </Card>
  );
}

function AdminDashboard({ name }: { name: string }) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const recent = useAdminOrders({ page: 1, limit: 5 });
  const awaitingKitchen = useAdminOrders({ status: "CONFIRMED", page: 1, limit: 1 });
  const inventory = useInventory();
  const pizzas = usePizzas();

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${name}`} description="Here's what's happening in the kitchen today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total orders" value={recent.data?.pagination.total} icon={ClipboardList} to="/admin/orders" />
        <StatCard
          title="New paid orders"
          value={awaitingKitchen.data?.pagination.total}
          icon={CookingPot}
          to="/admin/orders"
        />
        <StatCard title="Low-stock ingredients" value={inventory.data?.lowStockCount} icon={AlertTriangle} to="/admin/inventory" />
        <StatCard title="Menu pizzas" value={pizzas.data?.length} icon={Pizza} to="/admin/pizzas" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Latest orders</CardTitle>
            <CardDescription>The five most recent orders.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/orders">
              All orders
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.isLoading && <LoadingRows rows={3} />}
          {recent.isError && <ErrorState error={recent.error} onRetry={() => recent.refetch()} />}
          {recent.data && recent.data.orders.length === 0 && (
            <EmptyState icon={ClipboardList} title="No orders yet" />
          )}
          {recent.data && recent.data.orders.length > 0 && (
            <OrdersTable orders={recent.data.orders} showCustomer onView={(order) => setViewingId(order.id)} />
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal orderId={viewingId} onClose={() => setViewingId(null)} />
    </div>
  );
}

function CustomerDashboard({ name }: { name: string }) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const orders = useMyOrders();

  return (
    <div className="space-y-6">
      <PageHeader title={`Hi ${name.split(" ")[0]}, hungry?`} description="Order from the menu or build your own pizza." />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            to: "/menu",
            icon: Pizza,
            title: "Order from the menu",
            description: "Our chef's favourite combinations, ready to go.",
          },
          {
            to: "/build",
            icon: ChefHat,
            title: "Build your own",
            description: "Choose a base, sauce, cheese and up to six vegetables.",
          },
        ].map((action) => (
          <Card key={action.to} className="transition-shadow hover:shadow-md">
            <Link to={action.to} className="flex items-center gap-4 p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <action.icon className="size-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground" />
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Your latest orders and their status.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/orders">
              All orders
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.isLoading && <LoadingRows rows={3} />}
          {orders.isError && <ErrorState error={orders.error} onRetry={() => orders.refetch()} />}
          {orders.data && orders.data.length === 0 && (
            <EmptyState icon={ShoppingBag} title="No orders yet" description="Your first pizza is a click away." />
          )}
          {orders.data && orders.data.length > 0 && (
            <OrdersTable orders={orders.data.slice(0, 5)} onView={(order) => setViewingId(order.id)} />
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal orderId={viewingId} onClose={() => setViewingId(null)} />
    </div>
  );
}

export function DashboardPage() {
  const { user, isAdmin } = useSession();
  const name = user?.name ?? "there";
  return isAdmin ? <AdminDashboard name={name} /> : <CustomerDashboard name={name} />;
}
