import { prisma } from "../configs/index.js";
import { UserCreateInput } from "../../generated/prisma/client";

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const createUser = async (user: UserCreateInput) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
};