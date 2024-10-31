import { PrismaClient } from '@prisma/client';

async function subscribeToResolver(args: Record<string, any>, prisma: PrismaClient) {
    return Boolean(await prisma.user.update({
        where: {
          id: args.userId,
        },
        data: {
          userSubscribedTo: {
            create: {
              authorId: args.authorId,
            },
          },
        },
      }));
}

export default subscribeToResolver;
