import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient) {
  return {
    membersLoader: new DataLoader(async (memberId: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: { in: Array.from(memberId) },
        },
      });
      const foundId = memberId.map((id) =>
        memberTypes.find((memberTypes) => memberTypes.id === id),
      );
      return foundId;
    }),
    profilesLoader: new DataLoader(async (userId: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: {
          userId: { in: Array.from(userId) },
        },
      });
      const foundId = userId.map((id) =>
        profiles.find((profile) => profile.userId === id),
      );
      return foundId;
    }),
    postsLoader: new DataLoader(async (postIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: Array.from(postIds) },
        },
      });

      const postsObj = {};

      posts.forEach((post) => {
        if (!postsObj[post.authorId]) {
          postsObj[post.authorId] = [];
        }
        postsObj[post.authorId].push(post);
      });
      const post = postIds.map((id) => postsObj[id]);
      return post;
    }),
    userSubLoader: new DataLoader(async (userId: readonly string[]) => {
      const subs = await prisma.user.findMany({
        where: { id: { in: Array.from(userId) } },
        include: { userSubscribedTo: { select: { author: true } } },
      });

      const subsObj = {};

      subs.forEach((user) => {
        const subscribed = user.userSubscribedTo.map(
          (subscription) => subscription.author,
        );
        subsObj[user.id] = subscribed;
      });
      const user = userId.map((id) => subsObj[id]);
      return user;
    }),
    userSubscribedTo: new DataLoader(async (userId: readonly string[]) => {
      const subs = await prisma.user.findMany({
        where: { id: { in: Array.from(userId) } },
        include: { subscribedToUser: { select: { subscriber: true } } },
      });

      const subsObj = {};

      subs.forEach((user) => {
        if (!subsObj[user.id]) {
          subsObj[user.id] = [];
        }
        let subscribers = user.subscribedToUser.map((sub) => sub.subscriber);
        subsObj[user.id] = subsObj[user.id].concat(subscribers);
      });
      const user = userId.map((id) => subsObj[id]);
      return user;
    }),
  };
}
