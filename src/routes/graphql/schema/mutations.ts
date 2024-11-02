import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {
  CreatePostArgs,
  CreatePostInput,
  PostType,
  UpdatePostArgs,
  UpdatePostInput,
} from '../types/post.js';
import { PrismaContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import {
  CreateProfileArgs,
  CreateProfileInput,
  ProfileType,
  UpdateProfileArgs,
  UpdateProfileInput,
} from '../types/profile.js';
import {
  CreateUserArgs,
  CreateUserInput,
  UpdateUserArgs,
  UpdateUserInput,
  UserType,
} from '../types/user.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        post: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (source, { post }: CreatePostArgs, { prisma }: PrismaContext) => {
        return await prisma.post.create({
          data: post,
        });
      },
    },
    updatePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        post: { type: new GraphQLNonNull(UpdatePostInput) },
      },
      resolve: async (
        source,
        { id, post }: UpdatePostArgs,
        { prisma }: PrismaContext,
      ) => {
        return await prisma.post.update({
          where: { id },
          data: post,
        });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        return await prisma.post.delete({
          where: { id },
        });
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        profile: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (
        source,
        { profile }: CreateProfileArgs,
        { prisma }: PrismaContext,
      ) => {
        return await prisma.profile.create({
          data: profile,
        });
      },
    },
    updateProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        profile: { type: new GraphQLNonNull(UpdateProfileInput) },
      },
      resolve: async (
        source,
        { id, profile }: UpdateProfileArgs,
        { prisma }: PrismaContext,
      ) => {
        return await prisma.profile.update({
          where: { id },
          data: profile,
        });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        return await prisma.profile.delete({
          where: { id },
        });
      },
    },

    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        user: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, { user }: CreateUserArgs, { prisma }: PrismaContext) => {
        return prisma.user.create({
          data: user,
        });
      },
    },
    updateUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        user: { type: new GraphQLNonNull(UpdateUserInput) },
      },
      resolve: async (
        source,
        { id, user }: UpdateUserArgs,
        { prisma }: PrismaContext,
      ) => {
        return prisma.user.update({
          where: { id },
          data: user,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string }, { prisma }: PrismaContext) => {
        return await prisma.user.delete({
          where: {
            id,
          },
        });
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
  },
});
