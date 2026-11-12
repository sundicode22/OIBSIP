import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma, OrderStatus } from "../configs";
import { constants } from "../configs/constants";
import { updateStockSchema, updateOrderStatusSchema } from "../schema";
import { successResponse, NotFoundError, ValidationError } from "../utils";

export const getInventoryDashboard = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const ingredients = await prisma.ingredient.findMany({
      include: { type: true },
      orderBy: { stock: "asc" },
    });

    const lowStockItems = ingredients.filter(
      (item) => item.stock < constants.LOW_STOCK_THRESHOLD,
    );

    // Group items into bases, sauces, cheeses, vegetables
    const categories: Record<string, typeof ingredients> = {
      bases: [],
      sauces: [],
      cheeses: [],
      vegetables: [],
      other: [],
    };

    for (const item of ingredients) {
      const typeName = item.type?.name?.toLowerCase() || "";
      if (typeName.includes("base")) {
        categories.bases.push(item);
      } else if (typeName.includes("sauce")) {
        categories.sauces.push(item);
      } else if (typeName.includes("cheese")) {
        categories.cheeses.push(item);
      } else if (typeName.includes("veg")) {
        categories.vegetables.push(item);
      } else {
        categories.other.push(item);
      }
    }

    successResponse(res, 200, {
      totalItems: ingredients.length,
      threshold: constants.LOW_STOCK_THRESHOLD,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      categories,
      items: ingredients,
    });
  },
);

export const updateInventoryStock = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { stock } = await updateStockSchema.parseAsync(req.body);

    const existing = await prisma.ingredient.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Inventory item not found");
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: { stock },
      include: { type: true },
    });

    successResponse(res, 200, updated, `Stock for ${updated.name} updated to ${stock}`);
  },
);

export const getAllOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { status, page = "1", limit = "20" } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new ValidationError("Invalid order status filter", [
        { field: "status", message: `Unknown status "${String(status)}"` },
      ]);
    }
    const where = status ? { status: status as OrderStatus } : {};

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          address: true,
          pizzas: true,
          ingredients: { include: { type: true } },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    successResponse(res, 200, {
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  },
);

export const updateOrderStatus = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = await updateOrderStatusSchema.parseAsync(req.body);

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Order not found");
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        pizzas: true,
        ingredients: true,
      },
    });

    successResponse(
      res,
      200,
      updated,
      `Order #${id.slice(-6)} status updated to ${status}`,
    );
  },
);
