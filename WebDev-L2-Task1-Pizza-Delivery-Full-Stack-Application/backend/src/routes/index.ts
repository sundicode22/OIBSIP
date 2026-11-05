import { Router } from "express";
import { authRouter } from "./auth.routes";
import { pizzaRouter } from "./pizza.routes";
import { ingredientRouter } from "./ingredient.routes";
import { orderRouter } from "./order.routes";
import { adminRouter } from "./admin.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/pizzas", pizzaRouter);
rootRouter.use("/ingredients", ingredientRouter);
rootRouter.use("/orders", orderRouter);
rootRouter.use("/admin", adminRouter);

// Health check endpoint
rootRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { rootRouter };
