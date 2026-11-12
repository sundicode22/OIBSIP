import type { CheckoutSession } from "../api/orders.api";

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error: { description: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the Razorpay checkout. Check your connection."));
    document.body.appendChild(script);
  });
}

/** Opens Razorpay Checkout and resolves with the signed payment details. */
export async function openRazorpayCheckout(
  checkout: CheckoutSession,
  customer: { name?: string; email?: string },
): Promise<RazorpaySuccess> {
  await loadScript();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error("Razorpay checkout is unavailable.");

  return new Promise((resolve, reject) => {
    const instance = new Razorpay({
      key: checkout.razorpay.keyId,
      order_id: checkout.razorpay.orderId,
      amount: checkout.razorpay.amount,
      currency: checkout.razorpay.currency,
      name: "Pizza Inc.",
      description: `Order #${checkout.summary.orderId.slice(-6).toUpperCase()}`,
      prefill: customer,
      theme: { color: "#16a34a" },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
    });
    instance.on("payment.failed", (response) => reject(new Error(response.error.description)));
    instance.open();
  });
}
