import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/api";
import type { Address, Order } from "@/types/domain";

export interface AddressPayload {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface CustomPizzaPayload {
  baseId: string;
  sauceId: string;
  cheeseId: string;
  vegetableIds: string[];
}

export type CreateOrderPayload =
  | { address: AddressPayload; isCustomOrder: false; pizzaIds: string[] }
  | { address: AddressPayload; isCustomOrder: true; customPizza: CustomPizzaPayload };

export interface CheckoutSession {
  order: Order;
  summary: {
    orderId: string;
    totalPrice: number;
    itemsCount: number;
    isCustomOrder: boolean;
    address: Address;
  };
  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    simulated: boolean;
  };
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const ordersApi = {
  create: async (payload: CreateOrderPayload) => {
    const { data } = await apiClient.post<ApiResponse<CheckoutSession>>("/orders", payload);
    return data;
  },

  verifyPayment: async (payload: VerifyPaymentPayload) => {
    const { data } = await apiClient.post<ApiResponse<Order>>("/orders/verify", payload);
    return data;
  },

  getMine: async () => {
    const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders/my-orders");
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },
};
