import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormAlert } from "@/components/shared/FormAlert";
import { FormModal } from "@/components/shared/FormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { applyServerErrors, getErrorMessage } from "@/lib/api";
import { formatPrice, shortId } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { CheckoutSession, CustomPizzaPayload } from "../api/orders.api";
import { useCreateOrder, useVerifyPayment } from "../hooks/useOrders";
import { openRazorpayCheckout } from "../lib/razorpay";
import { addressSchema, emptyAddress, type AddressFormData } from "../schemas/address.schema";
import { AddressFields } from "./AddressFields";

export interface CheckoutLine {
  label: string;
  detail?: string;
  price?: number;
}

export type CheckoutRequest =
  | { kind: "menu"; pizzaIds: string[]; lines: CheckoutLine[]; estimatedTotal: number }
  | { kind: "custom"; customPizza: CustomPizzaPayload; lines: CheckoutLine[]; estimatedTotal: number };

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: CheckoutRequest | null;
  onCompleted?: () => void;
}

type Step = "address" | "payment" | "done";

const FORM_ID = "checkout-address-form";

export function CheckoutModal({ open, onOpenChange, request: liveRequest, onCompleted }: CheckoutModalProps) {
  const navigate = useNavigate();
  const { user } = useSession();
  const [step, setStep] = useState<Step>("address");
  const [placedRequest, setPlacedRequest] = useState<CheckoutRequest | null>(null);
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyAddress,
  });

  useEffect(() => {
    if (open) {
      setStep("address");
      setPlacedRequest(null);
      setCheckout(null);
      setError(null);
    }
  }, [open]);

  // Once an order is placed, keep showing it even if the caller clears its selection.
  const request = step === "address" ? liveRequest : placedRequest;
  if (!request) return null;

  const submitAddress = ({ address, city, state, zip, country }: AddressFormData) => {
    setError(null);
    const addressPayload = {
      address,
      city,
      ...(state && { state }),
      ...(zip && { zip }),
      ...(country && { country }),
    };
    const payload =
      request.kind === "menu"
        ? { address: addressPayload, isCustomOrder: false as const, pizzaIds: request.pizzaIds }
        : { address: addressPayload, isCustomOrder: true as const, customPizza: request.customPizza };

    createOrder.mutate(payload, {
      onSuccess: (res) => {
        setPlacedRequest(request);
        setCheckout(res.data);
        setStep("payment");
      },
      onError: (err) => setError(applyServerErrors(form, err)),
    });
  };

  const pay = async () => {
    if (!checkout) return;
    setError(null);
    setIsPaying(true);
    try {
      const payment = checkout.razorpay.simulated
        ? {
            razorpay_order_id: checkout.razorpay.orderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: "simulated_success",
          }
        : await openRazorpayCheckout(checkout, { name: user?.name, email: user?.email });

      await verifyPayment.mutateAsync({
        orderId: checkout.summary.orderId,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });
      toast.success("Payment successful – your order is confirmed!");
      form.reset(emptyAddress);
      setStep("done");
      onCompleted?.();
    } catch (err) {
      setError(getErrorMessage(err, "Payment failed. Please try again."));
    } finally {
      setIsPaying(false);
    }
  };

  const total = checkout?.summary.totalPrice ?? request.estimatedTotal;

  const footer =
    step === "address" ? (
      <>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" form={FORM_ID} disabled={createOrder.isPending}>
          <MapPin />
          {createOrder.isPending ? "Placing order..." : "Continue to payment"}
        </Button>
      </>
    ) : step === "payment" ? (
      <>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPaying}>
          Pay later
        </Button>
        <Button onClick={pay} disabled={isPaying}>
          <CreditCard />
          {isPaying ? "Processing..." : `Pay ${formatPrice(total)}`}
        </Button>
      </>
    ) : (
      <>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button
          onClick={() => {
            onOpenChange(false);
            navigate("/orders");
          }}
        >
          <ShoppingBag />
          View my orders
        </Button>
      </>
    );

  return (
    <FormModal
      open={open}
      onOpenChange={(next) => !isPaying && onOpenChange(next)}
      title={step === "done" ? "Order confirmed" : "Checkout"}
      description={
        step === "address"
          ? "Where should we deliver your order?"
          : step === "payment"
            ? "Review your order and pay securely."
            : "Thanks! We'll start preparing your pizza right away."
      }
      icon={step === "done" ? CheckCircle2 : ShoppingBag}
      footer={footer}
    >
      <div className="space-y-6">
        <FormAlert message={error} title={step === "payment" ? "Payment failed" : "Could not place order"} />

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Order summary</h3>
          <div className="divide-y divide-background overflow-hidden rounded-lg bg-muted/60">
            {request.lines.map((line) => (
              <div key={line.label} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-medium">{line.label}</p>
                  {line.detail && <p className="text-sm text-muted-foreground">{line.detail}</p>}
                </div>
                {line.price !== undefined && <span className="text-sm">{formatPrice(line.price)}</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="font-medium">Total</span>
            <span className="text-lg font-semibold text-primary">{formatPrice(total)}</span>
          </div>
        </section>

        {step === "address" && (
          <Form {...form}>
            <form id={FORM_ID} onSubmit={form.handleSubmit(submitAddress)} noValidate>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">Delivery address</h3>
              <AddressFields control={form.control} />
            </form>
          </Form>
        )}

        {step !== "address" && checkout && (
          <section className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order</span>
              <span className="font-medium">{shortId(checkout.summary.orderId)}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Deliver to</span>
              <span className="text-right">
                {[checkout.summary.address.address, checkout.summary.address.city, checkout.summary.address.zip]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            {step === "payment" && checkout.razorpay.simulated && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="secondary">Razorpay test mode – no real charge</Badge>
              </div>
            )}
            {step === "done" && (
              <FormAlert
                variant="success"
                title="Payment received"
                message="Your order has been sent to the kitchen. Track its status from My orders."
              />
            )}
          </section>
        )}
      </div>
    </FormModal>
  );
}
