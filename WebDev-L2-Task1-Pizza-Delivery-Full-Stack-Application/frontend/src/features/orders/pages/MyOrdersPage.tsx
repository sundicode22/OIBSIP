import { useState } from "react";
import { Pizza, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import { OrdersTable } from "../components/OrdersTable";
import { useMyOrders } from "../hooks/useOrders";

export function MyOrdersPage() {
  const { data: orders, isLoading, isError, error, refetch } = useMyOrders();
  const [viewingId, setViewingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My orders"
        description="Track the status of everything you've ordered."
        actions={
          <Button asChild>
            <Link to="/menu">
              <Pizza />
              Order again
            </Link>
          </Button>
        }
      />

      {isLoading && <LoadingRows />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {orders && orders.length === 0 && (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Your orders will show up here once you place one."
          action={
            <Button asChild>
              <Link to="/menu">Browse the menu</Link>
            </Button>
          }
        />
      )}
      {orders && orders.length > 0 && (
        <OrdersTable orders={orders} onView={(order) => setViewingId(order.id)} />
      )}

      <OrderDetailsModal orderId={viewingId} onClose={() => setViewingId(null)} />
    </div>
  );
}
