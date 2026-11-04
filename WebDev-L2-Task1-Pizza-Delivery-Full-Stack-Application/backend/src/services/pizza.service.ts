import { prisma } from "../configs/index.js";
import {
  PizzaCreateInput,
  PizzaUpdateInput,
} from "../../generated/prisma/client";

export const getPizzaById = async (id: string) => {
  const pizza = await prisma.pizza.findUnique({
    where: { id },
  });
  return pizza;
};

export const createPizza = async (pizza: PizzaCreateInput) => {
  const newPizza = await prisma.pizza.create({
    data: pizza,
  });
  return newPizza;
};

export const updatePizza = async (id: string, pizza: PizzaUpdateInput) => {
  const updatedPizza = await prisma.pizza.update({
    where: { id },
    data: pizza,
  });
  return updatedPizza;
};

export const deletePizza = async (id: string) => {
  const deletedPizza = await prisma.pizza.delete({
    where: { id },
  });
  return deletedPizza;
};

export const getPizzasByOrderId = async (orderId: string) => {
  const pizzas = await prisma.pizza.findMany({
    where: { orderId },
  });
  return pizzas;
};
