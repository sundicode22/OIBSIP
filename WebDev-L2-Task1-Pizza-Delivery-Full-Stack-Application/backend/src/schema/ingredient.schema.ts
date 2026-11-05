import { z } from "zod";

export const createIngredientTypeSchema = z.object({
  name: z.string().min(2, "Type name must be at least 2 characters"),
});

export const createIngredientSchema = z.object({
  name: z.string().min(2, "Ingredient name must be at least 2 characters"),
  typeId: z.string().min(1, "Ingredient type ID is required"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  description: z.string().default(""),
  imageUrl: z.string().optional(),
});

export const updateStockSchema = z.object({
  stock: z.number().int().nonnegative("Stock must be 0 or greater"),
});

export type CreateIngredientTypeSchema = z.infer<typeof createIngredientTypeSchema>;
export type CreateIngredientSchema = z.infer<typeof createIngredientSchema>;
export type UpdateStockSchema = z.infer<typeof updateStockSchema>;
