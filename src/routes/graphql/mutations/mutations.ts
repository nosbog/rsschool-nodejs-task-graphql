import { PrismaClient } from "@prisma/client";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import { UUIDType } from "../types/uuid.js";
import { userType } from "../types/entities/user-type.js";
import { profileType } from "../types/entities/profile-type.js"
import { postType } from "../types/entities/post-type.js";
import { changeUserInputType, createUserInputType } from "../types/mutations/user-mutations.js";
import { changeProfileInputType, createProfileInput } from "../types/mutations/profile-mutations.js";
import { changePostInputType, createPostInputType } from "../types/mutations/post-mutations.js";
import type {
  CreateUserParams,
  ChangeUserParams,
  UserSubscribedParams,
  CreateProfileParams,
  ChangeProfileParams,
  CreatePostParams,
  ChangePostParams
} from "../types/mutation-params.js";

export const mutations = (prisma: PrismaClient) => {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createUser: {
        type: userType,
        args: {
          dto: { type: new GraphQLNonNull(createUserInputType) },
        },
        resolve: async (_, { dto: { name, balance } }: { dto: CreateUserParams }) => {

          return await prisma.user.create({
            data: { name, balance },
          });
        },
      },

      changeUser: {
        type: userType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: changeUserInputType },
        },
        resolve: async (_, { id, dto }: { id: string; dto: ChangeUserParams }) => {

          return await prisma.user.update({
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
        resolve: async (_, { id }: { id: string }) => {
          try {
            await prisma.user.delete({ where: { id } });

            return 'User deleted successfully';
          } catch (e) {
            throw new Error('User not found');
          }
        },
      },

      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }: UserSubscribedParams) => {
          try {
            await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              userSubscribedTo: {
                create: {
                  authorId: authorId,
                },
              },
            },
          });

            return 'Subscribed successfully';
          } catch (e) {
            throw new Error('Failed to subscribe');
          }
        },
      },

      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }: UserSubscribedParams) => {
          try {
            await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId: authorId,
              },
            },
          });

            return 'Unsubscribed successfully';
          } catch (e) {
            throw new Error('Failed to unsubscribe');
          }
        },
      },

      createProfile: {
        type: profileType,
        args: {
          dto: { type: new GraphQLNonNull(createProfileInput) },
        },
        resolve: async (_, { dto }: { dto: CreateProfileParams }) => {

          return await prisma.profile.create({
            data: dto,
          });
        },
      },

      changeProfile: {
        type: profileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: changeProfileInputType },
        },
        resolve: async (_, { id, dto }: { id: string; dto: ChangeProfileParams }) => {

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
        resolve: async (_, { id }: { id: string }) => {
          try {
            await prisma.profile.delete({ where: { id } });

            return 'User deleted successfully';
          } catch (e) {
            throw new Error('User not found');
          }
        },
      },

      createPost: {
        type: postType,
        args: {
          dto: { type: new GraphQLNonNull(createPostInputType) },
        },
        resolve: async (_, { dto }: { dto: CreatePostParams }) => {

          return await prisma.post.create({ data: dto });
        },
      },

      changePost: {
        type: postType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(changePostInputType) }
        },
        resolve: async (_, { id, dto }: { id: string; dto: ChangePostParams }) => {

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
        resolve: async (_, { id }: { id: string}) => {
          try {
            await prisma.post.delete({ where: { id } });
            
            return 'User deleted successfully';
          } catch (e) {
            throw new Error('User not found');
          }
        },
      },
    }),
  });
};