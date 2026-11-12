export type Role = "ADMIN" | "USER" | "COOK" | "DELIVERY";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "SENT_TO_KITCHEN",
  "READY_FOR_DELIVERY",
  "SENT_TO_DELIVERY",
  "DELIVERED_TO_CUSTOMER",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified?: boolean;
}

export interface IngredientType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  typeId: string;
  type?: IngredientType;
  stock: number;
  imageUrl?: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  ingredientIds: string[];
  ingredients?: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  isCustomOrder: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  address?: Address;
  pizzas?: Pizza[];
  ingredients?: Ingredient[];
  payments?: Payment[];
  user?: { id: string; name: string; email: string; phone?: string | null };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
