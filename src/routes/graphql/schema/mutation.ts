import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { ChangeUserInput, CreateUserInput, UserType } from '../types/user.js';
import {
  createUser,
  deleteUser,
  subscribeTo,
  updateUser,
} from '../resolvers/User.resolver.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileType,
} from '../types/profile.js';
import {
  createProfile,
  deleteProfile,
  updateProfile,
} from '../resolvers/Profile.resolver.js';
import { ChangePostInput, CreatePostInput, PostType } from '../types/post.js';
import {
  createPost,
  deletePost,
  updatePost,
} from '../resolvers/Post.resolver.js';
import { UUIDType } from '../types/uuid.js';

export const MutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  description: 'Root Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      description: 'Create a new user',
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: createUser,
    },
    createPost: {
      type: PostType,
      description: 'Create a new post',
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: createPost,
    },
    createProfile: {
      type: ProfileType,
      description: 'Create a new profile',
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: createProfile,
    },
    changePost: {
      type: PostType,
      description: 'Update a post',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: updatePost,
    },
    changeProfile: {
      type: ProfileType,
      description: 'Update a profile',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: updateProfile,
    },
    changeUser: {
      type: UserType,
      description: 'Update a user',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: updateUser,
    },
    deleteUser: {
      type: GraphQLString,
      description: 'Delete a user',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: deleteUser,
    },
    deletePost: {
      type: GraphQLString,
      description: 'Delete a post',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: deletePost,
    },
    deleteProfile: {
      type: GraphQLString,
      description: 'Delete a profile',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: deleteProfile,
    },
    subscribeTo: {
      type: GraphQLString,
      description: 'Subscribe a user to an author',
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: subscribeTo,
    },
    unsubscribeFrom: {
      type: GraphQLString,
      description: 'Unsubscribe a user from an author',
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: subscribeTo,
    },
  }),
});
