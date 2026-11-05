import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma, OrderStatus, PaymentStatus } from "../configs";
import { constants } from "../configs/constants";
import { createOrderSchema, verifyPaymentSchema } from "../schema";
import {
  successResponse,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../utils";

export const createOrder = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;

    const { address, isCustomOrder, pizzaIds, customPizza } =
      await createOrderSchema.parseAsync(req.body);

    // 1. Create or connect Address
    const userAddress = await prisma.address.create({
      data: {
        userId,
        address: address.address,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
    });

    let totalPrice = 0;
    const ingredientIdsToDecrement: string[] = [];
    const connectedPizzaIds: string[] = [];

    if (isCustomOrder && customPizza) {
      // Custom Pizza Builder flow
      const selectedIngredientIds = [
        customPizza.baseId,
        customPizza.sauceId,
        customPizza.cheeseId,
        ...customPizza.vegetableIds,
      ];

      const ingredients = await prisma.ingredient.findMany({
        where: { id: { in: selectedIngredientIds } },
      });

      // Verify stock availability
      for (const item of ingredients) {
        if (item.stock < 1) {
          throw new BadRequestError(`Sorry, ingredient "${item.name}" is currently out of stock`);
        }
        ingredientIdsToDecrement.push(item.id);
      }

      // Base custom pizza price calculation: base 250 INR + 30 per veggie
      const veggieCount = customPizza.vegetableIds.length;
      totalPrice = 250 + veggieCount * 30;
    } else if (pizzaIds && pizzaIds.length > 0) {
      // Menu preset pizzas
      const selectedPizzas = await prisma.pizza.findMany({
        where: { id: { in: pizzaIds } },
        include: { ingredients: true },
      });

      if (selectedPizzas.length === 0) {
        throw new BadRequestError("No valid pizzas selected");
      }

      for (const p of selectedPizzas) {
        totalPrice += p.price;
        connectedPizzaIds.push(p.id);
        for (const ing of p.ingredients) {
          if (ing.stock < 1) {
            throw new BadRequestError(`Ingredient "${ing.name}" for pizza "${p.name}" is out of stock`);
          }
          ingredientIdsToDecrement.push(ing.id);
        }
      }
    } else {
      throw new BadRequestError("Please select either a menu pizza or build a custom pizza");
    }

    // 2. Decrement stock & Create Order in database transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement ingredient stocks automatically
      for (const id of ingredientIdsToDecrement) {
        await tx.ingredient.update({
          where: { id },
          data: { stock: { decrement: 1 } },
        });
      }

      return tx.order.create({
        data: {
          userId,
          addressId: userAddress.id,
          totalPrice,
          isCustomOrder,
          status: OrderStatus.PENDING,
          ...(connectedPizzaIds.length > 0 && {
            pizzas: {
              connect: connectedPizzaIds.map((id) => ({ id })),
            },
          }),
          ...(ingredientIdsToDecrement.length > 0 && {
            ingredients: {
              connect: ingredientIdsToDecrement.map((id) => ({ id })),
            },
          }),
        },
        include: {
          address: true,
          pizzas: true,
          ingredients: { include: { type: true } },
        },
      });
    });

    // 3. Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amount: totalPrice,
      receipt: `receipt_${order.id.slice(-8)}`,
      notes: { orderId: order.id, userId },
    });

    // 4. Return Order Summary + Checkout details
    successResponse(
      res,
      201,
      {
        order,
        summary: {
          orderId: order.id,
          totalPrice,
          itemsCount: order.pizzas.length || 1,
          isCustomOrder,
          address: order.address,
        },
        razorpay: {
          keyId: constants.RAZORPAY_KEY_ID,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      },
      "Order created. Please proceed to payment.",
    );
  },
);

export const verifyPayment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await verifyPaymentSchema.parseAsync(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      throw new BadRequestError("Payment verification failed: Invalid signature");
    }

    // Record Payment & update Order status to CONFIRMED
    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          orderId: order.id,
          userId: req.user!.id,
          amount: order.totalPrice,
          status: PaymentStatus.COMPLETED,
          reference: razorpayPaymentId,
        },
      });

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
        include: {
          payments: true,
          address: true,
          pizzas: true,
          ingredients: true,
        },
      });
    });

    successResponse(
      res,
      200,
      updatedOrder,
      "Payment successful! Order has been received and confirmed.",
    );
  },
);

export const getMyOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        address: true,
        pizzas: true,
        ingredients: { include: { type: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    successResponse(res, 200, orders);
  },
);

export const getOrderById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
        pizzas: true,
        ingredients: { include: { type: true } },
        payments: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    successResponse(res, 200, order);
  },
);
