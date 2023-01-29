import { GraphQLObjectType, GraphQLID } from 'graphql';
import { userType, profileType, postType } from '../entities/entitiesTypes';
import {
  createUser,
  createProfile,
  createPost,
  updateUser,
  updateProfile,
} from './resolvers';
import {
  newUserInputType,
  newProfileInputType,
  newPostInputType,
  updatedUserInputType,
  updatedProfileInputType,
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
    updateUser: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        input: { type: updatedUserInputType },
      },
      resolve: updateUser,
    },
    updateProfile: {
      type: profileType,
      args: {
        id: { type: GraphQLID },
        input: { type: updatedProfileInputType },
      },
      resolve: updateProfile,
    },
  },
});
