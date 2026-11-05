import { Router } from "express";
import {
  getAllIngredients,
  getIngredientTypes,
  createIngredientType,
  createIngredient,
  updateIngredientStock,
} from "../controller/ingredient.controller";
import { requireAuth, requireRoles } from "../middleware";
import { Roles } from "../configs";

const ingredientRouter = Router();

ingredientRouter.get("/", getAllIngredients);
ingredientRouter.get("/types", getIngredientTypes);
ingredientRouter.post(
  "/types",
  requireAuth,
  requireRoles(Roles.ADMIN),
  createIngredientType,
);
ingredientRouter.post(
  "/",
  requireAuth,
  requireRoles(Roles.ADMIN),
  createIngredient,
);
ingredientRouter.patch(
  "/:id/stock",
  requireAuth,
  requireRoles(Roles.ADMIN),
  updateIngredientStock,
);

export { ingredientRouter };
