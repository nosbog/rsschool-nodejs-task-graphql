import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";

export type Context = {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}
