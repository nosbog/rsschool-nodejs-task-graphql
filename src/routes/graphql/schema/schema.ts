import { GraphQLSchema } from 'graphql';
import { QueryType } from './query.js';

export const schema = new GraphQLSchema({
  query: QueryType,
  // mutation
});
