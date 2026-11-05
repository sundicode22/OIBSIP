import {
  prisma,
  OrderCreateInput,
  OrderStatus,
  OrderUpdateInput,
} from "../configs";

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      ingredients: true,
      pizzas: true,
      user: true,
      payments: true,
    },
  });
  return order;
};

export const createOrder = async (order: OrderCreateInput) => {
  const newOrder = await prisma.order.create({
    data: order,
  });
  return newOrder;
};

export const updateOrder = async (id: string, order: OrderUpdateInput) => {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: order,
  });
  return updatedOrder;
};

export const deleteOrder = async (id: string) => {
  const deletedOrder = await prisma.order.delete({
    where: { id },
  });
  return deletedOrder;
};

export const getOrdersByUserId = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      address: true,
      ingredients: true,
      pizzas: true,
      user: true,
      payments: true,
    },
  });
  return orders;
};

export const getOrders = async (
  page: number,
  limit: number,
  search: string,
  sort: string,
  sortBy: string,
  status: OrderStatus,
) => {
  const count = await prisma.order.count({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sort,
    },
    where: {
      status: status,
      OR: [
        { id: { contains: search, mode: "insensitive" } },
        { userId: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  const orders = await prisma.order.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sort,
    },
    include: {
      user: true,
    },
    where: {
      status: status,
      OR: [
        { id: { contains: search, mode: "insensitive" } },
        { userId: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  return {
    orders,
    total: count,
    page,
    limit,
  };
};

export const getOrdersCount = async (search: string) => {
  const count = await prisma.order.count({
    where: {
      OR: [
        { id: { contains: search, mode: "insensitive" } },
        { userId: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  return count;
};
