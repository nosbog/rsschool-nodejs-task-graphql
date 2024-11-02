import { PrismaClient, Post, Profile, MemberType, User } from "@prisma/client";
import DataLoader from "dataloader";

export const createPostsLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as string[] } },
    });


    const postsMap = new Map<string, Post[]>();

    posts.forEach((post) => {
      postsMap.set(post.authorId, [...postsMap.get(post.authorId) || [], post]);
    });

    return authorIds.map((id) => postsMap.get(id) || []);
  });
};


export const createProfilesLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Profile | null>(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
    });

    const profilesMap = new Map<string, Profile>();
    profiles.forEach((profile) => {
      profilesMap.set(profile.userId, profile);
    });

    return userIds.map((id) => profilesMap.get(id) || null);
  });
};

export const createMemberTypesLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, MemberType | null>(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: memberTypeIds as string[] } },
    });

    const memberTypesMap = new Map<string, MemberType>();
    memberTypes.forEach((memberType) => {
      memberTypesMap.set(memberType.id, memberType);
    });

    return memberTypeIds.map((id) => memberTypesMap.get(id) || null);
  });
};


export const createUserSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    // Fetch subscriptions where the user is the subscriber
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: userIds as string[] } },
      include: { author: true },
    });

    // Map user IDs to the users they are subscribed to
    const userToAuthorsMap = new Map<string, User[]>();
    userIds.forEach((id) => userToAuthorsMap.set(id, []));

    subscriptions.forEach((subscription) => {
      const list = userToAuthorsMap.get(subscription.subscriberId);
      if (list) {
        list.push(subscription.author);
      }
    });

    return userIds.map((id) => userToAuthorsMap.get(id) || []);
  });
};

export const createSubscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    // Fetch subscriptions where the user is the author
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true },
    });

    // Map user IDs to the users who are subscribed to them
    const userToSubscribersMap = new Map<string, User[]>();
    userIds.forEach((id) => userToSubscribersMap.set(id, []));

    subscriptions.forEach((subscription) => {
      const list = userToSubscribersMap.get(subscription.authorId);
      if (list) {
        list.push(subscription.subscriber);
      }
    });

    return userIds.map((id) => userToSubscribersMap.get(id) || []);
  });
};