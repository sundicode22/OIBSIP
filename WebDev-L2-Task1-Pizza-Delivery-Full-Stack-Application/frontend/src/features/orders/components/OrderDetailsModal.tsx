import type { ReactNode } from "react";
import { Receipt } from "lucide-react";
import { FormModal } from "@/components/shared/FormModal";
import { ErrorState, LoadingRows } from "@/components/shared/QueryState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { useOrder } from "../hooks/useOrders";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export function OrderDetailsModal({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);

  return (
    <FormModal
      open={Boolean(orderId)}
      onOpenChange={(open) => !open && onClose()}
      title={orderId ? `Order ${shortId(orderId)}` : "Order"}
      description="Items, delivery address and payment."
      icon={Receipt}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading && <LoadingRows rows={4} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {order && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Row label="Status">
              <StatusBadge status={order.status} />
            </Row>
            <Row label="Placed">{formatDate(order.createdAt)}</Row>
            <Row label="Type">{order.isCustomOrder ? "Custom pizza" : "Menu order"}</Row>
            {order.user && (
              <Row label="Customer">
                {order.user.name} · {order.user.email}
                {order.user.phone ? ` · ${order.user.phone}` : ""}
              </Row>
            )}
          </div>
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
            <div className="divide-y divide-background overflow-hidden rounded-lg bg-muted/60">
              {order.pizzas?.map((pizza) => (
                <div key={pizza.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="font-medium">{pizza.name}</span>
                  <span>{formatPrice(pizza.price)}</span>
                </div>
              ))}
              {order.isCustomOrder && (
                <div className="space-y-2 px-4 py-3 text-sm">
                  <p className="font-medium">Custom pizza</p>
                  <div className="flex flex-wrap gap-1.5">
                    {order.ingredients?.map((ingredient) => (
                      <Badge key={ingredient.id} variant="secondary" className="font-normal">
                        {ingredient.type?.name ? `${ingredient.type.name}: ` : ""}
                        {ingredient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Row label="Total">
              <span className="text-base text-primary">{formatPrice(order.totalPrice)}</span>
            </Row>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Delivery & payment</h3>
            {order.address && (
              <Row label="Address">
                {[order.address.address, order.address.city, order.address.state, order.address.zip, order.address.country]
                  .filter(Boolean)
                  .join(", ")}
              </Row>
            )}
            <Row label="Payment">
              {order.payments?.length ? (
                order.payments.map((payment) => (
                  <span key={payment.id} className="block">
                    {formatPrice(payment.amount)} · {payment.status.toLowerCase()} · {payment.reference}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">Not paid yet</span>
              )}
            </Row>
          </section>
        </div>
      )}
    </FormModal>
  );
}
