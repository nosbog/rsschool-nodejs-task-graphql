import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { MemberTypes, Posts, Profiles, Users } from './types.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: MemberTypes,
      resolve: async (_, __, context: PrismaClient) => {
        return context.memberType.findMany();
      },
    },
    posts: {
      type: Posts,
      resolve: async (_, __, context) => {
        return context.post.findMany();
      },
    },
    users: {
      type: Users,
      resolve: async (_, __, context) => {
        return context.user.findMany();
      },
    },
    profiles: {
      type: Profiles,
      resolve: async (_, __, context) => {
        return context.profile.findMany();
      },
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    memberTypes: {
      type: MemberTypes,
      resolve: () => {
        return [{}];
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
