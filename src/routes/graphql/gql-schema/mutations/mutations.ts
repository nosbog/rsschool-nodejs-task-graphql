import { PrismaClient } from '@prisma/client';
import { ChangePostInputType, CreatePostInputType, PostType } from '../types/post.js';
import { ChangeProfileInputType, CreateProfileInputType, ProfileType } from '../types/profile.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from '../types/user.js';
import { GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import createUserResolver from './resolvers/create/createUser.resolver.js';
import createPostResolver from './resolvers/create/createPost.resolver.js';
import createProfileResolver from './resolvers/create/createProfile.resolver.js';
import deleteUserResolver from './resolvers/delete/deleteUser.resolver.js';
import deletePostResolver from './resolvers/delete/deletePost.resolver.js';
import deleteProfileResolver from './resolvers/delete/deleteProfile.resolver.js';
import changeUserResolver from './resolvers/change/changeUser.resolver.js';
import changePostResolver from './resolvers/change/changePost.resolver.js';
import changeProfileResolver from './resolvers/change/changeProfile.resolver.js';
import subscribeToResolver from './resolvers/subscriptions/subscribeTo.resolver.js';
import unsubscribeFromResolver from './resolvers/subscriptions/unsubscribeFrom.resolver.js';

const mutations = (prisma: PrismaClient) =>
  new GraphQLObjectType({
    name: 'mutations',
    fields: {

      // ---> create

      createUser: {
        type: UserType,
        args: {
          dto: { type: CreateUserInputType },
        },
        resolve: async (_parent, args) => await createUserResolver(args, prisma),
      },
    
      createPost: {
        type: PostType,
        args: {
          dto: { type: CreatePostInputType },
        },
        resolve: async (_parent, args) => await createPostResolver(args, prisma),
      },

      createProfile: {
        type: ProfileType,
        args: {
          dto: { type: CreateProfileInputType },
        },
        resolve: async (_parent, args) => await createProfileResolver(args, prisma),
      },

      // ---> delete

      deleteUser: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async (_parent, args) => await deleteUserResolver(args, prisma),
      },

      deletePost: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async (_parent, args) => await deletePostResolver(args, prisma),
      },

      deleteProfile: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async (_, args) => await deleteProfileResolver(args, prisma),
      },

      // ---> change

      changeUser: {
        type: UserType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeUserInputType },
        },
        resolve: async (_parent, args) => await changeUserResolver(args, prisma),
      },

      changePost: {
        type: PostType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangePostInputType },
        },
        resolve: async (_parent, args) => await changePostResolver(args, prisma),
      },

      changeProfile: {
        type: ProfileType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeProfileInputType },
        },
        resolve: async (_parent, args) => await changeProfileResolver(args, prisma),
      },

      // ---> subscriptions

      subscribeTo: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async (_parent, args) => await subscribeToResolver(args, prisma),
      },

      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async (_parent, args) => await unsubscribeFromResolver(args, prisma),
      },
    },
  });

export default mutations;
