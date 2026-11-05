import { z } from "zod";
import { OrderStatus } from "../configs";

export const createOrderSchema = z.object({
  address: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }),
  isCustomOrder: z.boolean().default(false),
  // For pre-built menu pizzas
  pizzaIds: z.array(z.string()).optional(),
  // For custom pizza builder (5 bases, 5 sauces, cheeses, veggies)
  customPizza: z
    .object({
      baseId: z.string().min(1, "Pizza base is required"),
      sauceId: z.string().min(1, "Pizza sauce is required"),
      cheeseId: z.string().min(1, "Cheese selection is required"),
      vegetableIds: z.array(z.string()).default([]),
    })
    .optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type VerifyPaymentSchema = z.infer<typeof verifyPaymentSchema>;
export type UpdateOrderStatusSchema = z.infer<typeof updateOrderStatusSchema>;
