export const queryKeys = {
  health: ["health"] as const,
  pizzas: {
    all: ["pizzas"] as const,
    detail: (id: string) => ["pizzas", id] as const,
  },
  ingredients: {
    all: ["ingredients"] as const,
    types: ["ingredients", "types"] as const,
  },
  orders: {
    all: ["orders"] as const,
    mine: ["orders", "mine"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    admin: (filters: { status?: string; page: number; limit: number }) =>
      ["orders", "admin", filters] as const,
  },
  inventory: ["inventory"] as const,
} as const;
