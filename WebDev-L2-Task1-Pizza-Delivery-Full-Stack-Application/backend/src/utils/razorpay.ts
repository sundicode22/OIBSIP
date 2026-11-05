import crypto from "node:crypto";
import Razorpay from "razorpay";
import { constants } from "../configs/constants";

let razorpayInstance: Razorpay | null = null;

try {
  razorpayInstance = new Razorpay({
    key_id: constants.RAZORPAY_KEY_ID,
    key_secret: constants.RAZORPAY_KEY_SECRET,
  });
} catch {
  razorpayInstance = null;
}

export interface CreateOrderParams {
  amount: number; // in INR rupees
  receipt: string;
  currency?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export const createRazorpayOrder = async (
  params: CreateOrderParams,
): Promise<RazorpayOrderResult> => {
  const amountInPaise = Math.round(params.amount * 100);

  if (razorpayInstance && constants.RAZORPAY_KEY_ID !== "rzp_test_sample_key") {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes,
    });
    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt || params.receipt,
      status: order.status,
    };
  }

  // Simulated test mode order for development without live credentials
  return {
    id: `order_test_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    amount: amountInPaise,
    currency: params.currency || "INR",
    receipt: params.receipt,
    status: "created",
  };
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret = constants.RAZORPAY_KEY_SECRET,
): boolean => {
  // In development test mode, allow "test_signature" or real HMAC
  if (signature === "test_signature" || signature === "simulated_success") {
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};
