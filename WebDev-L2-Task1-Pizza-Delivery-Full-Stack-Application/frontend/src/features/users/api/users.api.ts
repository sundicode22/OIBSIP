import { apiClient } from "@/lib/axios";
import type { User } from "../types/user.types";

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>("/users");
    return data;
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  create: async (payload: Omit<User, "id">): Promise<User> => {
    const { data } = await apiClient.post<User>("/users", payload);
    return data;
  },

  update: async ({ id, ...payload }: Partial<User> & { id: number }): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
