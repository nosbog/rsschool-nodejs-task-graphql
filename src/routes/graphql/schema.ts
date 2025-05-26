// src/routes/graphql/schema.ts
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLID,
} from 'graphql';
import type { PrismaClient } from '@prisma/client';

interface GraphQLContext {
  prisma: PrismaClient;
}

const UUID = GraphQLID;

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProfileType = new GraphQLObjectType<{
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
  };
}>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUID) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: (parent) => parent.memberType,
    },
  }),
});

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent: { id: string }, _args, context: GraphQLContext) => {
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
          include: { memberType: true },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent: { id: string }, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany({ where: { authorId: parent.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: { id: string }, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: { subscriberId: parent.id },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: { id: string }, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: { authorId: parent.id },
            },
          },
        });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany();
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany();
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.profile.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.memberType.findMany();
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.user.delete({ where: { id: args.id } });
        return `Deleted user ${args.id}`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.post.delete({ where: { id: args.id } });
        return `Deleted post ${args.id}`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.profile.delete({ where: { id: args.id } });
        return `Deleted profile ${args.id}`;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUID) },
        authorId: { type: new GraphQLNonNull(UUID) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.user.update({
          where: { id: args.userId },
          data: {
            subscribedToUser: {
              connect: {
                subscriberId_authorId: {
                  subscriberId: args.userId,
                  authorId: args.authorId,
                },
              },
            },
          },
        });
        return `User ${args.userId} subscribed to ${args.authorId}`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUID) },
        authorId: { type: new GraphQLNonNull(UUID) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.user.update({
          where: { id: args.userId },
          data: {
            subscribedToUser: {
              disconnect: {
                subscriberId_authorId: {
                  subscriberId: args.userId,
                  authorId: args.authorId,
                },
              },
            },
          },
        });
        return `User ${args.userId} unsubscribed from ${args.authorId}`;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
