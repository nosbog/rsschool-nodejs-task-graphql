import { UserType } from '../schemas.js';
import { GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { getUserSubscribers, getUserSubscriptions } from './helpers.js';

export const usersQuery = {
  type: new GraphQLList(UserType),
  resolve: async (parent, args, context, info) => {
    const users = await context.prisma.user.findMany({
      include: {
        profile: {
          include: {
            memberType: true,
          },
        },
        posts: true,
      },
    });

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const userSubscribedTo = await getUserSubscriptions(context.prisma, user.id);
        const subscribedToUser = await getUserSubscribers(context.prisma, user.id);

        return {
          ...user,
          userSubscribedTo,
          subscribedToUser,
        };
      }),
    );

    return updatedUsers;
  },
};

export const userQuery = {
  type: UserType,
  args: { id: { type: UUIDType } },
  resolve: async (parent, { id }, context, info) => {
    const user = await context.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            memberType: true,
          },
        },
        posts: true,
      },
    });

    if (!user) {
      return null;
    }

    const userSubscribedTo = await getUserSubscriptions(context.prisma, user.id);
    const subscribedToUser = await getUserSubscribers(context.prisma, user.id);

    return { ...user, userSubscribedTo, subscribedToUser };
  },
};
