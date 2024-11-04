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
  GraphQLInputObjectType,
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

const postInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  },
});

const userInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const profileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberTypeId },
  },
});

const changePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeId },
  },
});

const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'root mutation',
  fields: {
    createPost: {
      type: postType,
      args: { dto: { type: postInput } },
      resolve: async (root, args) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.post.create({ data: args.dto }),
    },
    createUser: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: userType,
      args: { dto: { type: userInput } },
      resolve: async (root, args) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.user.create({ data: args.dto }),
    },
    createProfile: {
      type: profileType,
      args: { dto: { type: profileInput } },
      resolve: async (root, args) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.profile.create({ data: args.dto }),
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.post.delete({ where: { id: args.id } });
        return true;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.profile.delete({ where: { id: args.id } });
        return true;
      },
    },
    deleteUser: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await prisma.user.delete({ where: { id: args.id } });
        return true;
      },
    },
    changePost: {
      type: postType,
      args: { id: { type: UUIDType }, dto: { type: changePostInput } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return await prisma.post.update({ where: { id: args.id }, data: args.dto });
      },
    },
    changeProfile: {
      type: profileType,
      args: { id: { type: UUIDType }, dto: { type: changeProfileInput } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return await prisma.profile.update({ where: { id: args.id }, data: args.dto });
      },
    },
    changeUser: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: userType,
      args: { id: { type: UUIDType }, dto: { type: changeUserInput } },
      resolve: async (root, args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return await prisma.user.update({ where: { id: args.id }, data: args.dto });
      },
    },
    subscribeTo: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (root, args) => {
        await prisma.user.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            id: args.userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                authorId: args.authorId,
              },
            },
          },
        });
        return true;
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (root, args) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              subscriberId: args.userId,authorId: args.authorId,
            },
          },
        });
        return true;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
