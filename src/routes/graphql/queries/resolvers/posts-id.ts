import { PrismaClient } from '@prisma/client';

interface PostsIdArgs {
  postId: string;
}

export const postsIdResolver = async ({ postId }: PostsIdArgs, prisma: PrismaClient) => 
  await prisma.post.findUnique({ where: { id: postId } });
