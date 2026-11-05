import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} from "../controller/order.controller";
import { requireAuth } from "../middleware";

const orderRouter = Router();

orderRouter.post("/", requireAuth, createOrder);
orderRouter.post("/verify", requireAuth, verifyPayment);
orderRouter.get("/my-orders", requireAuth, getMyOrders);
orderRouter.get("/:id", requireAuth, getOrderById);

export { orderRouter };
