import { GraphQLObjectType, GraphQLSchema } from 'graphql';
//import { resolvers } from './resolvers/resolvers.js';

import {
  MemberType,
  PostType,
  ProfileType,
  SubscribersOnAuthorsType,
  UserType,
} from './types/modelTypes.js';
/* import {
  userResolvers,
  memberTypeResolvers,
  postResolvers,
  profileResolvers,
} from './resolvers/resolvers.js'; */
import { resolvers } from './resolvers/resolvers.js';
import { Mutations } from './mutations/mutations.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuryType',
  fields: {
    ...resolvers,
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberType, PostType, ProfileType, SubscribersOnAuthorsType],
  query: RootQuery,
  mutation: Mutations,
});
