import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const getDataLoaders = (prisma: PrismaClient) => ({
  // usersLoader: new DataLoader(async (ids: readonly string[]) => {
  //   const users = await prisma.user.findMany({
  //     where: {
  //       id: {
  //         in: Array.from(ids),
  //       },
  //     },
  //   });

  //   const usersMap = new Map<string, { id: string; name: string }>();

  //   users.forEach((user) => {
  //     usersMap.set(user.id, user);
  //   });

  //   return ids.map((id) => usersMap.get(id));
  // }),

  profilesLoader: new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: Array.from(ids) },
      },
    });

    const sortedInIdsOrder = ids.map((id) =>
      profiles.find((profile) => profile.userId === id),
    );

    return sortedInIdsOrder;
  }),

  postsLoader: new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: Array.from(ids) },
      },
    });

    const userPostsMap = new Map<
      string,
      { id: string; title: string; content: string }[]
    >();

    posts.forEach((post) => {
      if (!userPostsMap.has(post.authorId)) {
        userPostsMap.set(post.authorId, []);
      }
      userPostsMap.get(post.authorId)?.push(post);
    });

    return ids.map((id) => userPostsMap.get(id));
  }),

  membersLoader: new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: Array.from(ids) },
      },
    });

    const sortedInIdsOrder = ids.map((id) =>
      memberTypes.find((memberType) => memberType.id === id),
    );

    return sortedInIdsOrder;
  }),

  userSubscribedToLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithAuthors = await prisma.user.findMany({
      where: { id: { in: Array.from(ids) } },
      include: { userSubscribedTo: { select: { author: true } } },
    });

    const subscribedAuthorsMap = new Map<string, { id: string; name: string }[]>();

    usersWithAuthors.forEach((user) => {
      const subscribedAuthors = user.userSubscribedTo.map(
        (subscription) => subscription.author,
      );
      subscribedAuthorsMap.set(user.id, subscribedAuthors);
    });

    return ids.map((id) => subscribedAuthorsMap.get(id));
  }),

  subscribedToUserLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithSubs = await prisma.user.findMany({
      where: { id: { in: Array.from(ids) } },
      include: { subscribedToUser: { select: { subscriber: true } } },
    });

    const subscribersMap = new Map<string, { id: string; name: string }[]>();

    usersWithSubs.forEach((user) => {
      if (!subscribersMap.has(user.id)) {
        subscribersMap.set(user.id, []);
      }

      subscribersMap
        .get(user.id)
        ?.push(...user.subscribedToUser.map((sub) => sub.subscriber));
    });

    return ids.map((id) => subscribersMap.get(id));
  }),
});
