import {
  prisma,
  IngredientCreateInput,
  IngredientUpdateInput,
  IngredientTypeCreateInput,
  IngredientTypeUpdateInput,
} from "../configs";

export const getIngredientById = async (id: string) => {
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });
  return ingredient;
};

export const createIngredient = async (ingredient: IngredientCreateInput) => {
  const newIngredient = await prisma.ingredient.create({
    data: ingredient,
  });
  return newIngredient;
};

export const updateIngredient = async (
  id: string,
  ingredient: IngredientUpdateInput,
) => {
  const updatedIngredient = await prisma.ingredient.update({
    where: { id },
    data: ingredient,
  });
  return updatedIngredient;
};

export const deleteIngredient = async (id: string) => {
  const deletedIngredient = await prisma.ingredient.delete({
    where: { id },
  });
  return deletedIngredient;
};

export const getIngredientsByOrderId = async (orderId: string) => {
  const ingredients = await prisma.ingredient.findMany({
    where: { orderId },
  });
  return ingredients;
};

export const getIngredientsByPizzaId = async (pizzaId: string) => {
  const ingredients = await prisma.ingredient.findMany({
    where: { pizzaId },
  });
  return ingredients;
};

export const getIngredientsByTypeId = async (typeId: string) => {
  const ingredients = await prisma.ingredient.findMany({
    where: { typeId },
  });
  return ingredients;
};

// ingredient type service
export const getIngredientTypeById = async (id: string) => {
  const ingredientType = await prisma.ingredientType.findUnique({
    where: { id },
  });
  return ingredientType;
};

export const createIngredientType = async (
  ingredientType: IngredientTypeCreateInput,
) => {
  const newIngredientType = await prisma.ingredientType.create({
    data: ingredientType,
  });
  return newIngredientType;
};

export const updateIngredientType = async (
  id: string,
  ingredientType: IngredientTypeUpdateInput,
) => {
  const updatedIngredientType = await prisma.ingredientType.update({
    where: { id },
    data: ingredientType,
  });
  return updatedIngredientType;
};

export const deleteIngredientType = async (id: string) => {
  const deletedIngredientType = await prisma.ingredientType.delete({
    where: { id },
  });
  return deletedIngredientType;
};

export const getIngredientTypes = async () => {
  const ingredientTypes = await prisma.ingredientType.findMany();
  return ingredientTypes;
};

export const getIngredientTypeByName = async (name: string) => {
  const ingredientType = await prisma.ingredientType.findUnique({
    where: { name },
  });
  return ingredientType;
};
