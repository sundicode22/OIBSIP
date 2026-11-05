import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma } from "../configs";
import { createPizzaSchema, updatePizzaSchema } from "../schema";
import { successResponse, NotFoundError } from "../utils";

export const getAllPizzas = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const pizzas = await prisma.pizza.findMany({
      include: {
        ingredients: {
          include: { type: true },
        },
      },
    });
    successResponse(res, 200, pizzas);
  },
);

export const getPizzaById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const pizza = await prisma.pizza.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: { type: true },
        },
      },
    });

    if (!pizza) {
      throw new NotFoundError("Pizza variety not found");
    }

    successResponse(res, 200, pizza);
  },
);

export const createPizza = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = await createPizzaSchema.parseAsync(req.body);
    const { ingredientIds, ...pizzaData } = data;

    const newPizza = await prisma.pizza.create({
      data: {
        ...pizzaData,
        ...(ingredientIds && ingredientIds.length > 0 && {
          ingredients: {
            connect: ingredientIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        ingredients: true,
      },
    });

    successResponse(res, 201, newPizza, "Pizza variety created successfully");
  },
);

export const updatePizza = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await updatePizzaSchema.parseAsync(req.body);
    const { ingredientIds, ...pizzaData } = data;

    const existing = await prisma.pizza.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Pizza not found");
    }

    const updated = await prisma.pizza.update({
      where: { id },
      data: {
        ...pizzaData,
        ...(ingredientIds && {
          ingredients: {
            set: ingredientIds.map((item) => ({ id: item })),
          },
        }),
      },
      include: { ingredients: true },
    });

    successResponse(res, 200, updated, "Pizza updated successfully");
  },
);

export const deletePizza = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const existing = await prisma.pizza.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Pizza not found");
    }

    await prisma.pizza.delete({ where: { id } });
    successResponse(res, 200, null, "Pizza deleted successfully");
  },
);
