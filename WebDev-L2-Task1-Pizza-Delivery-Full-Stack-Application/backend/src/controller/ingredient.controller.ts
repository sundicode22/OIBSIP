import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma } from "../configs";
import {
  createIngredientSchema,
  createIngredientTypeSchema,
  updateStockSchema,
} from "../schema";
import { successResponse, NotFoundError } from "../utils";

export const getAllIngredients = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const ingredients = await prisma.ingredient.findMany({
      include: { type: true },
      orderBy: { name: "asc" },
    });

    // Group ingredients by type for the custom pizza builder steps
    const grouped = ingredients.reduce((acc, item) => {
      const typeName = item.type?.name?.toLowerCase() || "other";
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(item);
      return acc;
    }, {} as Record<string, typeof ingredients>);

    successResponse(res, 200, {
      all: ingredients,
      grouped,
    });
  },
);

export const getIngredientTypes = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const types = await prisma.ingredientType.findMany({
      include: {
        ingredients: true,
      },
    });
    successResponse(res, 200, types);
  },
);

export const createIngredientType = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = await createIngredientTypeSchema.parseAsync(req.body);
    const newType = await prisma.ingredientType.create({
      data,
    });
    successResponse(res, 201, newType, "Ingredient type created");
  },
);

export const createIngredient = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = await createIngredientSchema.parseAsync(req.body);
    const newIngredient = await prisma.ingredient.create({
      data,
      include: { type: true },
    });
    successResponse(res, 201, newIngredient, "Ingredient created successfully");
  },
);

export const updateIngredientStock = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { stock } = await updateStockSchema.parseAsync(req.body);

    const existing = await prisma.ingredient.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Ingredient not found");
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: { stock },
      include: { type: true },
    });

    successResponse(res, 200, updated, "Stock updated successfully");
  },
);
