import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/api";
import type { Pizza } from "@/types/domain";

export interface PizzaPayload {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  ingredientIds: string[];
}

export const pizzasApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Pizza[]>>("/pizzas");
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Pizza>>(`/pizzas/${id}`);
    return data.data;
  },

  create: async (payload: PizzaPayload) => {
    const { data } = await apiClient.post<ApiResponse<Pizza>>("/pizzas", payload);
    return data;
  },

  update: async (id: string, payload: Partial<PizzaPayload>) => {
    const { data } = await apiClient.put<ApiResponse<Pizza>>(`/pizzas/${id}`, payload);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/pizzas/${id}`);
    return data;
  },
};
