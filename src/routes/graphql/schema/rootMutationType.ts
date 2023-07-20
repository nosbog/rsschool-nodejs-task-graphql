import { GraphQLObjectType } from 'graphql';
import { CreatePostField, DeletePostField } from './types/post.js';
import { CreateUserField, DeleteUserField } from './types/user.js';
import { CreateProfileField, DeleteProfileField } from './types/profile.js';

export const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: CreatePostField,
    createUser: CreateUserField,
    createProfile: CreateProfileField,
    deletePost: DeletePostField,
    deleteUser: DeleteUserField,
    deleteProfile: DeleteProfileField,
  },
});
