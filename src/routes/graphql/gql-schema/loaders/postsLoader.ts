import { Post, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

function postsLoader(prisma: PrismaClient) {
  return new DataLoader<string, Post[]>(async (userIds) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: userIds || [] },
      },
    });
    return userIds.map(userId => posts.filter(post => post.authorId === userId)) as Post[];
  });
}

export default postsLoader;
