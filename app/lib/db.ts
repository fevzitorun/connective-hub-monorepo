import { PrismaClient } from "@/app/generated/prisma/client";

const opts = { datasources: { db: { url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" } } };
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma || new PrismaClient(opts);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
