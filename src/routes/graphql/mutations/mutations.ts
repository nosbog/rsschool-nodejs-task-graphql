import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { PostType, ProfileType, UserType } from '../types/modelTypes.js';
import {
  createPost,
  createProfile,
  createUser,
  updatePost,
  updateProfile,
  updateUser,
} from './mutationModelTypes.js';

export const Mutations = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(createPost) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.post.create({
          data: args.dto,
        });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(createProfile) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.profile.create({
          data: args.dto,
        });
      },
    },
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(createUser) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.user.create({
          data: args.dto,
        });
      },
    },

    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        const res = await prisma.post.delete({
          where: { id: args.id },
        });
        return !!res;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        const res = await prisma.profile.delete({
          where: { id: args.id },
        });
        return !!res;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        const res = await prisma.user.delete({
          where: { id: args.id },
        });
        return !!res;
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(updatePost) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(updateProfile) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(updateUser) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        return await prisma.user.update({
          where: { id: args.userId },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.authorId,
              },
            },
          },
        });
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        const res = await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return !!res;
      },
    },
  }),
});
