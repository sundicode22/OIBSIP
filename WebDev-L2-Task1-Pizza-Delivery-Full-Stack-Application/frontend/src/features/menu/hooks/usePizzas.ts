import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { pizzasApi, type PizzaPayload } from "../api/pizzas.api";

export function usePizzas() {
  return useQuery({ queryKey: queryKeys.pizzas.all, queryFn: pizzasApi.getAll });
}

export function usePizza(id: string | null) {
  return useQuery({
    queryKey: queryKeys.pizzas.detail(id ?? ""),
    queryFn: () => pizzasApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useSavePizza() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: PizzaPayload }) =>
      id ? pizzasApi.update(id, payload) : pizzasApi.create(payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "Pizza saved");
      queryClient.invalidateQueries({ queryKey: queryKeys.pizzas.all });
    },
  });
}

export function useDeletePizza() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pizzasApi.remove(id),
    onSuccess: (res) => {
      toast.success(res.message ?? "Pizza deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.pizzas.all });
    },
  });
}
