import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberIdType, MemberType } from './types/memberTypes.js';

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_obj, _args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: new GraphQLList(MemberType),
      args: { userId: { type: new GraphQLNonNull(MemberIdType) } },
      resolve: (_obj, args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: Mutations
});

export { schema };
