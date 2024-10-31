import { PrismaClient, User, Profile, Post } from '@prisma/client';

async function userResolver(args: Record<string, any>, prisma: PrismaClient) {
  const user = await prisma.user.findUnique({ where: { id: args.id } });
  if (!user) return null;

  let subscriptionData = await prisma.subscribersOnAuthors.findMany({ where: { subscriberId: user.id } });

  const userAuthors = await Promise.all(
    (await prisma.user.findMany({
      where: {
        id: {
          in: subscriptionData.map((subscr) => subscr.authorId),
        },
      },
    })).map(async (author) => {
      const authorSubscripions = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: author.id },
      });
      const subscribedToUser = await prisma.user.findMany({
        where: {
          id: {
            in: authorSubscripions.map((subscr) => subscr.subscriberId),
          },
        },
      });
      return { ...author, subscribedToUser };
    })
  );

  subscriptionData = await prisma.subscribersOnAuthors.findMany({ where: { authorId: user.id } });
    
  const userSubscribers = await Promise.all(
    (await prisma.user.findMany({
      where: {
        id: {
          in: subscriptionData.map((subscr) => subscr.subscriberId),
        },
      },
    })).map(async (subscriber) => {
      const authorSubscripions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: subscriber.id },
      });
      const userSubscribedTo = await prisma.user.findMany({
        where: {
          id: {
            in: authorSubscripions.map((subscr) => subscr.authorId),
          },
        },
      });
      return { ...subscriber, userSubscribedTo };
    })
  );
    
  const profile: Profile | null = await prisma.profile.findUnique({ where: { userId: user.id } });

  const posts: Post[] = await prisma.post.findMany({ where: { authorId: user.id } });

  return {
    ...user,
    profile: profile ? { ...profile, memberType: { id: profile.memberTypeId } } : null,
    posts,
    userSubscribedTo: [...userAuthors],
    subscribedToUser: [...userSubscribers],
  };
};

export default userResolver;
