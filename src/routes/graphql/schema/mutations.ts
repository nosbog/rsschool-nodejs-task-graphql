import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {
  CreatePostArgs,
  CreatePostInput,
  PostType,
  ChangePostArgs,
  ChangePostInput,
} from '../types/post.js';
import { PrismaContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import {
  CreateProfileArgs,
  CreateProfileInput,
  ProfileType,
  ChangeProfileArgs,
  ChangeProfileInput,
} from '../types/profile.js';
import {
  CreateUserArgs,
  CreateUserInput,
  ChangeUserArgs,
  ChangeUserInput,
  UserType,
} from '../types/user.js';

interface SubscribeArgs {
  userId: string;
  authorId: string;
}

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (source, { dto }: CreatePostArgs, { prisma }: PrismaContext) => {
        return await prisma.post.create({
          data: dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (source, { id, dto }: ChangePostArgs, { prisma }: PrismaContext) => {
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        await prisma.post.delete({
          where: { id },
        });

        return `Post with ID ${id} was deleted`;
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (source, { dto }: CreateProfileArgs, { prisma }: PrismaContext) => {
        return await prisma.profile.create({
          data: dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        source,
        { id, dto }: ChangeProfileArgs,
        { prisma }: PrismaContext,
      ) => {
        return await prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        await prisma.profile.delete({
          where: { id },
        });

        return `Profile with ID ${id} was deleted`;
      },
    },

    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, { dto }: CreateUserArgs, { prisma }: PrismaContext) => {
        return prisma.user.create({
          data: dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (source, { id, dto }: ChangeUserArgs, { prisma }: PrismaContext) => {
        return prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        await prisma.user.delete({
          where: {
            id,
          },
        });

        return `User with ID ${id} was deleted`;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        source,
        { authorId, userId }: SubscribeArgs,
        { prisma }: PrismaContext,
      ) => {
        const existingSubscription = await prisma.subscribersOnAuthors.findUnique({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        if (existingSubscription) {
          throw new Error('User already subscribed to the Author');
        }

        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });

        return `Subscribed to author with ID ${authorId}`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        source,
        { userId, authorId }: SubscribeArgs,
        { prisma }: PrismaContext,
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return `Unsubscribed from author with ID ${authorId}`;
      },
    },
  },
});
