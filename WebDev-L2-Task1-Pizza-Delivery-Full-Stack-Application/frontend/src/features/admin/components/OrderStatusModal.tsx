import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "@/components/shared/FormAlert";
import { FormModal } from "@/components/shared/FormModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyServerErrors } from "@/lib/api";
import { formatPrice, ORDER_STATUS_LABELS, shortId } from "@/lib/format";
import { ORDER_STATUSES, type Order } from "@/types/domain";
import { describeItems } from "@/features/orders/components/OrdersTable";
import { useUpdateOrderStatus } from "../hooks/useAdmin";

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    errorMap: () => ({ message: "Choose a status" }),
  }),
});

type StatusFormData = z.infer<typeof statusSchema>;

const FORM_ID = "order-status-form";

export function OrderStatusModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const updateStatus = useUpdateOrderStatus();

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
  });

  useEffect(() => {
    if (order) {
      form.reset({ status: order.status });
      setServerError(null);
    }
  }, [order, form]);

  const onSubmit = ({ status }: StatusFormData) => {
    if (!order) return;
    if (status === order.status) {
      form.setError("status", { message: "Pick a different status to update the order" });
      return;
    }
    setServerError(null);
    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: onClose,
        onError: (error) => setServerError(applyServerErrors(form, error)),
      },
    );
  };

  return (
    <FormModal
      open={Boolean(order)}
      onOpenChange={(open) => !open && onClose()}
      title={order ? `Update order ${shortId(order.id)}` : "Update order"}
      description="Move the order through the kitchen and delivery stages."
      icon={RefreshCw}
      containerClassName="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={updateStatus.isPending}>
            <Save />
            {updateStatus.isPending ? "Saving..." : "Update status"}
          </Button>
        </>
      }
    >
      {order && (
        <Form {...form}>
          <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormAlert message={serverError} title="Could not update the order" />

            <div className="space-y-2 rounded-lg bg-muted/60 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{order.user?.name ?? "Customer"}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-muted-foreground">
                {describeItems(order)} · {formatPrice(order.totalPrice)}
              </p>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {ORDER_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The customer sees this status on their orders page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </FormModal>
  );
}
