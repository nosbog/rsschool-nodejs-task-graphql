import { GraphQLSchema } from 'graphql';
import { QueryType } from './query.js';
import { MutationType } from './mutations.js';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
