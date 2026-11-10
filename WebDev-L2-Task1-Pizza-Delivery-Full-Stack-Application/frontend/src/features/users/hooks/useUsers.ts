import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import { queryKeys } from "@/lib/queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: usersApi.getAll,
  });
}
