import { PrismaClient, Post } from '@prisma/client';

async function postResolver(args: Record<string, any>, prisma: PrismaClient): Promise<Post | null> {
  return await prisma.post.findUnique({ where: { id: args.id } });
};

export default postResolver;
