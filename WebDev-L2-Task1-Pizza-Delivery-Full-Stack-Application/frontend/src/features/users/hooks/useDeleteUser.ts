import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { User } from "../types/user.types";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: (_data, deletedId) => {
      // Optimistically update list cache
      queryClient.setQueryData<User[]>(queryKeys.users.lists(), (old) =>
        old?.filter((u) => u.id !== deletedId) ?? [],
      );
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(deletedId) });
      toast.success(`User #${deletedId} removed successfully.`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user record.");
    },
  });
}
