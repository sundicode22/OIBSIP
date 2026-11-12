import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/api";
import type { Ingredient, Order, OrderStatus, Pagination } from "@/types/domain";

export interface InventoryDashboard {
  totalItems: number;
  threshold: number;
  lowStockCount: number;
  lowStockItems: Ingredient[];
  categories: Record<"bases" | "sauces" | "cheeses" | "vegetables" | "other", Ingredient[]>;
  items: Ingredient[];
}

export interface AdminOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface AdminOrderFilters {
  status?: OrderStatus;
  page: number;
  limit: number;
}

export const adminApi = {
  getInventory: async () => {
    const { data } = await apiClient.get<ApiResponse<InventoryDashboard>>("/admin/inventory");
    return data.data;
  },

  updateInventoryStock: async (id: string, stock: number) => {
    const { data } = await apiClient.patch<ApiResponse<Ingredient>>(`/admin/inventory/${id}`, {
      stock,
    });
    return data;
  },

  getOrders: async ({ status, page, limit }: AdminOrderFilters) => {
    const { data } = await apiClient.get<ApiResponse<AdminOrdersResponse>>("/admin/orders", {
      params: { page, limit, ...(status ? { status } : {}) },
    });
    return data.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
      status,
    });
    return data;
  },
};
