import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { UserType } from './userType.ts';
import { PrismaClient } from '@prisma/client';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

interface Context {
  prisma: PrismaClient;
}

interface MemberType {
  id: string;
  name: string;
  description: string;
}

const MemberType = new GraphQLObjectType<MemberType, Context>({
  name: 'MemberType',
  description: 'MemberType object type',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const MemberTypeIdType = new GraphQLNonNull(GraphQLID);

export const RootQuery = new GraphQLObjectType<unknown, Context>({
  name: 'Query',
  description: 'Root Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_obj, args, ctx) => {
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
