import { PrismaClient } from "@prisma/client";

export type ContextType = { prisma: PrismaClient }

export type GetResByIdResolverArgs = { id: string }