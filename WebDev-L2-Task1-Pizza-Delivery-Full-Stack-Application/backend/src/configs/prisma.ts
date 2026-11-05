import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client";

const prisma = new PrismaClient();

export { prisma, PrismaClient, Prisma };
export * from "../generated/prisma/models";
export * from "../generated/prisma/enums";
