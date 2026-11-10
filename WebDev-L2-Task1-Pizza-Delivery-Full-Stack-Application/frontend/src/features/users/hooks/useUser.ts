import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import { queryKeys } from "@/lib/queryKeys";

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}
