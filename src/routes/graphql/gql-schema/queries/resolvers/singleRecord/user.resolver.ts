import { PrismaClient, Profile, Post, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

async function userResolver(
  args: Record<string, any>,
  postsLoader: DataLoader<string, Post[], string>,
  profileLoader: DataLoader<string, Profile | null, string>,
  memberTypeLoader: DataLoader<string, MemberType | null, string>,
  prisma: PrismaClient
) {
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
    
  const profile = await profileLoader.load(user.id);

  const profileWithMemberType = profile ? {
    ...profile,
    memberType: await memberTypeLoader.load(profile.id),
  }: null;

  const posts: Post[] = await postsLoader.load(user.id);

  return {
    ...user,
    profile: profileWithMemberType,
    posts,
    userSubscribedTo: [...userAuthors],
    subscribedToUser: [...userSubscribers],
  };
};

export default userResolver;
