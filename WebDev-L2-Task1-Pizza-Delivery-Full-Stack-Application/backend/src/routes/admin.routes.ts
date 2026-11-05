import { Router } from "express";
import {
  getInventoryDashboard,
  updateInventoryStock,
  getAllOrders,
  updateOrderStatus,
} from "../controller/admin.controller";
import { requireAuth, requireRoles } from "../middleware";
import { Roles } from "../configs";

const adminRouter = Router();

// Protect all admin routes with authentication & ADMIN role
adminRouter.use(requireAuth, requireRoles(Roles.ADMIN));

adminRouter.get("/inventory", getInventoryDashboard);
adminRouter.patch("/inventory/:id", updateInventoryStock);
adminRouter.get("/orders", getAllOrders);
adminRouter.patch("/orders/:id/status", updateOrderStatus);

export { adminRouter };
