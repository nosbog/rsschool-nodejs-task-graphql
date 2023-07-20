import { GraphQLObjectType } from 'graphql';
import { CreatePostField } from './types/post.js';
import { CreateUserField } from './types/user.js';
import { CreateProfileField } from './types/profile.js';

export const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: CreatePostField,
    createUser: CreateUserField,
    createProfile: CreateProfileField,
  },
});
