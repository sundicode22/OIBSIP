import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/domain";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", ORDER_STATUS_STYLES[status])}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

export function StockBadge({ stock, threshold = 20 }: { stock: number; threshold?: number }) {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }
  if (stock < threshold) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700">
        Low · {stock}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700">
      {stock} in stock
    </Badge>
  );
}
