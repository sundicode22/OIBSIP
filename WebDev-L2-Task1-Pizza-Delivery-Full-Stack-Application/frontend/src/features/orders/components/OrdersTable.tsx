import type { ReactNode } from "react";
import { Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import type { Order } from "@/types/domain";

export function describeItems(order: Order) {
  if (order.isCustomOrder) return "Custom pizza";
  const names = order.pizzas?.map((pizza) => pizza.name) ?? [];
  return names.length ? names.join(", ") : "—";
}

interface OrdersTableProps {
  orders: Order[];
  showCustomer?: boolean;
  onView: (order: Order) => void;
  renderActions?: (order: Order) => ReactNode;
}

export function OrdersTable({ orders, showCustomer, onView, renderActions }: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_3px_rgba(16,24,40,0.06),0_4px_12px_-4px_rgba(16,24,40,0.08)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Order</TableHead>
            {showCustomer && <TableHead>Customer</TableHead>}
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs font-medium">{shortId(order.id)}</TableCell>
              {showCustomer && (
                <TableCell>
                  <div className="font-medium">{order.user?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                </TableCell>
              )}
              <TableCell className="max-w-[260px] truncate">{describeItems(order)}</TableCell>
              <TableCell className="font-medium">{formatPrice(order.totalPrice)}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(order)}>
                    <Eye />
                    View
                  </Button>
                  {renderActions?.(order)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
