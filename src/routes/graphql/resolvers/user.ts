import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

const prisma = new PrismaClient();

export const UserResolver = {
  user: async ({ id }: { id: UUID }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  },
  users: async () => {
    return await prisma.user.findMany();
  },
};
