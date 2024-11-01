import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds as string[] },
      },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const usersMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((userId) => usersMap.get(userId) || null);
  });
};

const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (memberTypesIds: readonly string[]) => {
    const users = await prisma.memberType.findMany({
      where: {
        id: { in: memberTypesIds as string[] },
      },
    });

    const memberTypesMap = new Map(
      users.map((memberType) => [memberType.id, memberType]),
    );
    return memberTypesIds.map(
      (usermemberTypeId) => memberTypesMap.get(usermemberTypeId) || null,
    );
  });
};

const createPostLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (authorsIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: authorsIds as string[] },
      },
    });

    const postsMap = new Map<string, Post[]>();
    posts.forEach((post) => {
      if (!postsMap.has(post.authorId)) {
        postsMap.set(post.authorId, []);
      }
      const authorPosts = postsMap.get(post.authorId);
      authorPosts && authorPosts.push(post);
    });

    return authorsIds.map((authorId) => postsMap.get(authorId) || []);
  });
};

const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: ids as string[] },
      },
    });

    const profilesMap = new Map(profiles.map((profile) => [profile.userId, profile]));
    return ids.map((id) => profilesMap.get(id));
  });
};

export {
  createUserLoader,
  createMemberTypeLoader,
  createPostLoader,
  createProfileLoader,
};
