import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { ordersApi, type CreateOrderPayload, type VerifyPaymentPayload } from "../api/orders.api";

export function useMyOrders() {
  return useQuery({ queryKey: queryKeys.orders.mine, queryFn: ordersApi.getMine });
}

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id ?? ""),
    queryFn: () => ordersApi.getById(id!),
    enabled: Boolean(id),
  });
}

function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
  };
}

export function useCreateOrder() {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useVerifyPayment() {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => ordersApi.verifyPayment(payload),
    onSuccess: invalidate,
  });
}
