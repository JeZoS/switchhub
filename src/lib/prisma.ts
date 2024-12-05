import { PrismaClient } from "@prisma/client";

declare global {
    interface Global {
        prisma: PrismaClient | undefined;
    }
}

const globalWithPrisma = global as typeof globalThis & { prisma?: PrismaClient };

export const client = globalWithPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalWithPrisma.prisma = client;
}
