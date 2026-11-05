import { Router } from "express";
import {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} from "../controller/pizza.controller";
import { requireAuth, requireRoles } from "../middleware";
import { Roles } from "../configs";

const pizzaRouter = Router();

pizzaRouter.get("/", getAllPizzas);
pizzaRouter.get("/:id", getPizzaById);
pizzaRouter.post("/", requireAuth, requireRoles(Roles.ADMIN), createPizza);
pizzaRouter.put("/:id", requireAuth, requireRoles(Roles.ADMIN), updatePizza);
pizzaRouter.delete("/:id", requireAuth, requireRoles(Roles.ADMIN), deletePizza);

export { pizzaRouter };
