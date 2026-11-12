import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/api";
import type { Ingredient, IngredientType } from "@/types/domain";

export interface IngredientsResponse {
  all: Ingredient[];
  grouped: Record<string, Ingredient[]>;
}

export interface CreateIngredientPayload {
  name: string;
  typeId: string;
  stock: number;
  description: string;
  imageUrl?: string;
}

export const ingredientsApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<IngredientsResponse>>("/ingredients");
    return data.data;
  },

  getTypes: async () => {
    const { data } = await apiClient.get<ApiResponse<IngredientType[]>>("/ingredients/types");
    return data.data;
  },

  createType: async (payload: { name: string }) => {
    const { data } = await apiClient.post<ApiResponse<IngredientType>>("/ingredients/types", payload);
    return data;
  },

  create: async (payload: CreateIngredientPayload) => {
    const { data } = await apiClient.post<ApiResponse<Ingredient>>("/ingredients", payload);
    return data;
  },

  updateStock: async (id: string, stock: number) => {
    const { data } = await apiClient.patch<ApiResponse<Ingredient>>(`/ingredients/${id}/stock`, {
      stock,
    });
    return data;
  },
};
