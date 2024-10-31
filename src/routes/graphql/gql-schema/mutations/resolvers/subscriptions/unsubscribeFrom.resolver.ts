import { PrismaClient } from '@prisma/client';

async function unsubscribeFromResolver(args: Record<string, any>, prisma: PrismaClient) {
    return Boolean(await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        },
      }));
}

export default unsubscribeFromResolver;
