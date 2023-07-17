import { FastifyInstance } from 'fastify';
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSkipDirective,
  GraphQLString,
} from 'graphql';
import {
  createUser,
  updateUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
} from '../../api/userApi.js';
import { GraphQLPostType, GraphQLProfileType, GraphQLUserType } from './queryTypes.js';
import {
  createUserInputType,
  createProfileInputType,
  createPostInputType,
  updateUserInputType,
  updateProfileInputType,
  updatePostInputType,
} from './mutationTypes.js';
import { User, Profile, Post } from '../../types/entityTypes.js';
import { createProfile, updateProfile, deleteProfile } from '../../api/profilesApi.js';
import { createPost, updatePost, deletePost } from '../../api/postApi.js';
import { UUIDType } from '../../types/uuid.js';

export const getMutationType = async (
  fastify: FastifyInstance,
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: { dto: { type: new GraphQLNonNull(createUserInputType) } },
        resolve: async (_, { dto }: { dto: User }) => createUser(dto, fastify),
      },

      changeUser: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(updateUserInputType) },
        },
        resolve: async (_, { id, dto }: { id: string; dto: User }) =>
          updateUser(id, dto, fastify),
      },

      deleteUser: {
        type: GraphQLString,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }) => deleteUser(id, fastify),
      },

      createProfile: {
        type: new GraphQLNonNull(GraphQLProfileType),
        args: { dto: { type: new GraphQLNonNull(createProfileInputType) } },
        resolve: async (_, { dto }: { dto: Profile }) => createProfile(dto, fastify),
      },

      changeProfile: {
        type: new GraphQLNonNull(GraphQLProfileType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(updateProfileInputType) },
        },
        resolve: async (_, { id, dto }: { id: string; dto: Profile }) =>
          updateProfile(id, dto, fastify),
      },

      deleteProfile: {
        type: GraphQLString,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }) => deleteProfile(id, fastify),
      },

      createPost: {
        type: new GraphQLNonNull(GraphQLPostType),
        args: { dto: { type: new GraphQLNonNull(createPostInputType) } },
        resolve: async (_, { dto }: { dto: Post }) => createPost(dto, fastify),
      },

      changePost: {
        type: new GraphQLNonNull(GraphQLPostType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(updatePostInputType) },
        },
        resolve: async (_, { id, dto }: { id: string; dto: Post }) =>
          updatePost(id, dto, fastify),
      },

      deletePost: {
        type: GraphQLString,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }) => deletePost(id, fastify),
      },

      subscribeTo: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) =>
          subscribeTo(userId, authorId, fastify),
      },

      unsubscribeFrom: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) =>
          unsubscribeFrom(userId, authorId, fastify),
      },
    },
  });
