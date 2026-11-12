import { useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardList, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/format";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/domain";
import { OrderDetailsModal } from "@/features/orders/components/OrderDetailsModal";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { OrderStatusModal } from "../components/OrderStatusModal";
import { useAdminOrders } from "../hooks/useAdmin";

const PAGE_SIZE = 10;
const ALL = "ALL";

export function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | typeof ALL>(ALL);
  const [page, setPage] = useState(1);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Order | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminOrders({
    status: status === ALL ? undefined : status,
    page,
    limit: PAGE_SIZE,
  });

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Every customer order, newest first."
        actions={
          <>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as OrderStatus | typeof ALL);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[220px] bg-card">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {ORDER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {ORDER_STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => refetch()} aria-label="Refresh orders">
              <RefreshCw className={isFetching ? "animate-spin" : undefined} />
            </Button>
          </>
        }
      />

      {isLoading && <LoadingRows />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No orders found"
          description={status === ALL ? "Orders appear here as customers place them." : "Try another status filter."}
        />
      )}
      {data && data.orders.length > 0 && (
        <>
          <OrdersTable
            orders={data.orders}
            showCustomer
            onView={(order) => setViewingId(order.id)}
            renderActions={(order) => (
              <Button variant="outline" size="sm" onClick={() => setEditing(order)}>
                <RefreshCw />
                Status
              </Button>
            )}
          />
          {pagination && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} orders
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <OrderDetailsModal orderId={viewingId} onClose={() => setViewingId(null)} />
      <OrderStatusModal order={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
