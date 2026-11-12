import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { OrderStatus } from "@/types/domain";
import { adminApi, type AdminOrderFilters } from "../api/admin.api";

export function useInventory() {
  return useQuery({ queryKey: queryKeys.inventory, queryFn: adminApi.getInventory });
}

export function useUpdateInventoryStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      adminApi.updateInventoryStock(id, stock),
    onSuccess: (res) => {
      toast.success(res.message ?? "Stock updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
    },
  });
}

export function useAdminOrders(filters: AdminOrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.admin(filters),
    queryFn: () => adminApi.getOrders(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.message ?? "Order status updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
