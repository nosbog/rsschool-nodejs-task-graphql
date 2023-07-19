import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './rootQueryType.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
});
