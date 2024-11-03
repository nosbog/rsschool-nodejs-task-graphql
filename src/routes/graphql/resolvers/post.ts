import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

const prisma = new PrismaClient();

export const PostResolver = {
  post: async ({ id }: { id: UUID }) => {
    const post = await prisma.post.findUnique({ where: { id } });
    return post;
  },
  posts: async () => {
    return await prisma.post.findMany();
  },
};
