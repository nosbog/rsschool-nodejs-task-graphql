import { GraphQLObjectType } from 'graphql';
import { userType, profileType, postType } from '../entities/entitiesTypes';
import { createUser, createProfile, createPost } from './resolvers';
import {
  newUserInputType,
  newProfileInputType,
  newPostInputType,
} from './inputTypes';

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: { input: { type: newUserInputType } },
      resolve: createUser,
    },
    createProfile: {
      type: profileType,
      args: { input: { type: newProfileInputType } },
      resolve: createProfile,
    },
    createPost: {
      type: postType,
      args: { input: { type: newPostInputType } },
      resolve: createPost,
    },
  },
});
