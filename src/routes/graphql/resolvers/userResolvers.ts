import { User } from '@prisma/client';
import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { UserType } from '../models/user.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

export const userResolvers = {
  users: {
    type: new GraphQLList(UserType),
    resolve: async (
      _,
      _args,
      { prisma, dataLoaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const parsedResolveInfo = parseResolveInfo(info) as ResolveTree;

      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfo,
        new GraphQLList(UserType),
      );

      const shouldIncludeUserSubscribedTo = 'userSubscribedTo' in fields;
      const shouldIncludeSubscribedToUser = 'subscribedToUser' in fields;

      const users = await prisma.user.findMany({
        include: {
          userSubscribedTo: shouldIncludeUserSubscribedTo,
          subscribedToUser: shouldIncludeSubscribedToUser,
        },
      });

      if (shouldIncludeUserSubscribedTo || shouldIncludeSubscribedToUser) {
        const usersMap = new Map<string, User>();

        users.forEach((user) => {
          usersMap.set(user.id, user);
        });

        users.forEach((user) => {
          if (shouldIncludeUserSubscribedTo) {
            dataLoaders.userSubscribedToLoader.prime(
              user.id,
              user.userSubscribedTo.map((sub) => usersMap.get(sub.authorId) as User),
            );
          }

          if (shouldIncludeSubscribedToUser) {
            dataLoaders.subscribedToUserLoader.prime(
              user.id,
              user.subscribedToUser.map((sub) => usersMap.get(sub.subscriberId) as User),
            );
          }
        });
      }

      return users;
    },
  },
  user: {
    type: UserType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      const user = await context.prisma.user.findUnique({
        where: { id: args.id },
      });

      return user;
    },
  },
};
