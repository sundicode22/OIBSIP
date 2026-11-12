import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { ingredientsApi, type CreateIngredientPayload } from "../api/ingredients.api";

export function useIngredients() {
  return useQuery({ queryKey: queryKeys.ingredients.all, queryFn: ingredientsApi.getAll });
}

export function useIngredientTypes() {
  return useQuery({ queryKey: queryKeys.ingredients.types, queryFn: ingredientsApi.getTypes });
}

function useInvalidateStock() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
    queryClient.invalidateQueries({ queryKey: queryKeys.pizzas.all });
  };
}

export function useCreateIngredientType() {
  const invalidate = useInvalidateStock();
  return useMutation({
    mutationFn: ingredientsApi.createType,
    onSuccess: (res) => {
      toast.success(res.message ?? "Ingredient type created");
      invalidate();
    },
  });
}

export function useCreateIngredient() {
  const invalidate = useInvalidateStock();
  return useMutation({
    mutationFn: (payload: CreateIngredientPayload) => ingredientsApi.create(payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "Ingredient created");
      invalidate();
    },
  });
}

export function useUpdateIngredientStock() {
  const invalidate = useInvalidateStock();
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      ingredientsApi.updateStock(id, stock),
    onSuccess: (res) => {
      toast.success(`${res.data.name} stock set to ${res.data.stock}`);
      invalidate();
    },
  });
}
