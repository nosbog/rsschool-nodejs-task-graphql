import { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { MemberType } from './types/memberType.js';
import { PrismaClient } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
}

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: new GraphQLList(MemberType),
          args: {},
          resolve: async (parent, args, {prisma}: Context) => prisma.memberType.findMany(),
        },
      },
    }),
  });
  