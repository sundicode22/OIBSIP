import type { OrderStatus } from "@/types/domain";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number) => currency.format(amount);

export const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const shortId = (id: string) => `#${id.slice(-6).toUpperCase()}`;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Awaiting payment",
  CONFIRMED: "Order received",
  IN_PROGRESS: "In progress",
  SENT_TO_KITCHEN: "In the kitchen",
  READY_FOR_DELIVERY: "Ready for delivery",
  SENT_TO_DELIVERY: "Out for delivery",
  DELIVERED_TO_CUSTOMER: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
  IN_PROGRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  SENT_TO_KITCHEN: "border-orange-200 bg-orange-50 text-orange-700",
  READY_FOR_DELIVERY: "border-teal-200 bg-teal-50 text-teal-700",
  SENT_TO_DELIVERY: "border-violet-200 bg-violet-50 text-violet-700",
  DELIVERED_TO_CUSTOMER: "border-green-200 bg-green-50 text-green-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};
