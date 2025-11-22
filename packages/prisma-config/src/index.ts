// packages/prisma-config/src/index.ts
import { PrismaClient } from "../generated/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// Export the Prisma Client type and any generated types/enums

export * from "../generated/client";
