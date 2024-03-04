import { GraphQLSchema } from 'graphql';
import { rootQuery } from './query.js';
import { rootMutation } from './mutation.js';

export const resolvers = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
})