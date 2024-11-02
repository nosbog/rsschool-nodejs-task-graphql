import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { CreatePostInput, PostType, UpdatePostInput } from '../types/post.js';
import { PrismaContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { CreateProfileInput, ProfileType, UpdateProfileInput } from '../types/profile.js';
import { CreateUserInput, UpdateUserInput, UserType } from '../types/user.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        post: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    updatePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        post: { type: new GraphQLNonNull(UpdatePostInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    deletePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        profile: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    updateProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        profile: { type: new GraphQLNonNull(UpdateProfileInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    deleteProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },

    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        user: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    updateUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        user: { type: new GraphQLNonNull(UpdateUserInput) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
    },
    deleteUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, { prisma }: PrismaContext) => {},
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
