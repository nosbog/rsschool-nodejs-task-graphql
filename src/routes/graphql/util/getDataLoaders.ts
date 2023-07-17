import DataLoader = require('dataloader');
import { FastifyInstance } from 'fastify';
import { MemberType, Post, Profile, User } from '../types/entityTypes.js';

export const getDataLoaders = (fastify: FastifyInstance) => {
  const getUserPostsLoader = new DataLoader<string, Post[]>(
    async (ids: readonly string[]) => {
      const posts = await fastify.prisma.post.findMany({
        where: {
          authorId: { in: ids as string[] },
        },
      });

      const groupedPosts = ids.map((id) => posts.filter((post) => post.authorId === id));
      return groupedPosts;
    },
  );

  const getUserProfilesLoader = new DataLoader<string, Profile[]>(
    async (ids: readonly string[]) => {
      const profiles = await fastify.prisma.profile.findMany({
        where: {
          userId: { in: ids as string[] },
        },
      });

      const groupedProfiles = ids.map((id) =>
        profiles.filter((profile) => profile.userId === id),
      );
      return groupedProfiles;
    },
  );

  const getProfileMemberType = new DataLoader<string, MemberType[]>(
    async (ids: readonly string[]) => {
      const memberTypes = await fastify.prisma.memberType.findMany({
        where: {
          id: { in: ids as string[] },
        },
      });

      const groupedMemberTypes = ids.map((id) =>
        memberTypes.filter((type) => type.id === id),
      );
      return groupedMemberTypes;
    },
  );

  const getUserSubscribedTo = new DataLoader<string, User[]>(
    async (ids: readonly string[]) => {
      const users = await fastify.prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: { in: ids as string[] },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });

      const groupedUsers = ids.map((id) =>
        users.filter((user) =>
          user.subscribedToUser.some((sub) => sub.subscriberId === id),
        ),
      );
      return groupedUsers;
    },
  );

  const getUserSubscribedToUser = new DataLoader<string, User[]>(
    async (ids: readonly string[]) => {
      const users = await fastify.prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: { in: ids as string[] },
            },
          },
        },
        include: {
          userSubscribedTo: true,
        },
      });

      const groupedUsers = ids.map((id) =>
        users.filter((user) => user.userSubscribedTo.some((sub) => sub.authorId === id)),
      );
      return groupedUsers;
    },
  );

  return {
    getUserPostsLoader,
    getUserProfilesLoader,
    getProfileMemberType,
    getUserSubscribedTo,
    getUserSubscribedToUser,
  };
};
