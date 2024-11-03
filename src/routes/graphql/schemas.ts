import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLBoolean,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const prisma = new PrismaClient();

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

const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: memberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const postType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  },
});

const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: async (currentProfile: Record<string, string>) =>
        await prisma.memberType.findUnique({
          where: { id: currentProfile.memberTypeId },
        }),
    },
  },
});

const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      resolve: async (currentUser: Record<string, string>) =>
        await prisma.profile.findUnique({ where: { userId: currentUser.id } }),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (currentUser) =>
        await prisma.post.findMany({
          where: { authorId: currentUser.id },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (currentUser) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: currentUser.id },
          include: { author: true },
        });
        return subscribers.map((sub) => sub.author);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (currentUser) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: currentUser.id },
          include: { subscriber: true },
        });
        return subscriptions.map((s) => s.subscriber);
      },
    },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'root query',
  fields: {
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: async () => await prisma.memberType.findMany(),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async () => await prisma.post.findMany(),
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async () => await prisma.user.findMany(),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async () => await prisma.profile.findMany(),
    },
    memberType: {
      type: memberType,
      args: { id: { type: memberTypeId } },
      resolve: async (root, args: Record<string, string>) =>
        await prisma.memberType.findUnique({ where: { id: args.id } }),
    },
    post: {
      type: postType,
      args: { id: { type: UUIDType } },
      resolve: async (root, args: Record<string, string>) =>
        await prisma.post.findUnique({ where: { id: args.id } }),
    },
    user: {
      type: userType as GraphQLObjectType,
      args: { id: { type: UUIDType } },
      resolve: async (root, args: Record<string, string>) =>
        await prisma.user.findUnique({ where: { id: args.id } }),
    },
    profile: {
      type: profileType,
      args: { id: { type: UUIDType } },
      resolve: async (root, args: Record<string, string>) =>
        await prisma.profile.findUnique({ where: { id: args.id } }),
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
});
