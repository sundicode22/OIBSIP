import { z } from "zod";

export const createPizzaSchema = z.object({
  name: z.string().min(2, "Pizza name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().positive("Price must be a positive number"),
  imageUrl: z.string().optional(),
  ingredientIds: z.array(z.string()).optional(),
});

export const updatePizzaSchema = createPizzaSchema.partial();

export type CreatePizzaSchema = z.infer<typeof createPizzaSchema>;
export type UpdatePizzaSchema = z.infer<typeof updatePizzaSchema>;
