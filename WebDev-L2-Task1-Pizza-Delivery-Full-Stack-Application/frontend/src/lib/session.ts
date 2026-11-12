import { useMemo, useSyncExternalStore } from "react";
import type { SessionUser } from "@/types/domain";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function parseUser(raw: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => parseUser(localStorage.getItem(USER_KEY)),
  set(token: string, user: SessionUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notify();
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notify();
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useSession() {
  const rawUser = useSyncExternalStore(subscribe, () => localStorage.getItem(USER_KEY));
  const token = useSyncExternalStore(subscribe, () => localStorage.getItem(TOKEN_KEY));
  const user = useMemo(() => parseUser(rawUser), [rawUser]);

  return {
    user: token ? user : null,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(token && user?.role === "ADMIN"),
  };
}
