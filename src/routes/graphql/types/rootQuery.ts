/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './userType.ts';
import { PrismaClient } from '@prisma/client';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { MemberType, MemberTypeIdType } from './memberType.ts';

export interface Context {
  profileLoader: any;
  postLoader: any;
  userSubscribedTo: any;
  subscribedToUser: any;
  prisma: PrismaClient;
}

export const RootQuery = new GraphQLObjectType<unknown, Context>({
  name: 'Query',
  description: 'Root Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_obj, _args, ctx) => {
        return ctx.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeIdType),
        },
      },
      resolve: async (_obj, args: { id: string }, ctx) => {
        return ctx.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_obj, args, ctx, info) => {
        const data = parseResolveInfo(info);
        const isSubscribed = Object.keys(data?.fieldsByTypeName?.User ?? {}).includes(
          'subscribedToUser',
        );

        const isUserSubscribed = Object.keys(data?.fieldsByTypeName?.User ?? {}).includes(
          'userSubscribedTo',
        );

        const users = await ctx.prisma.user.findMany({
          include: {
            subscribedToUser: isSubscribed,
            userSubscribedTo: isUserSubscribed,
          },
        });

        if (isSubscribed || isUserSubscribed) {
          return users.map((user) => ({
            ...user,
            subscribedToUser: isSubscribed ? user.subscribedToUser : undefined,
            userSubscribedTo: isUserSubscribed ? user.userSubscribedTo : undefined,
          }));
        }

        return users;
      },
    },
  },
});
