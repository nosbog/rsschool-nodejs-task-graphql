import { GraphQLSchema } from 'graphql';
import { QueryType as query } from './query.js';

export const schema: GraphQLSchema = new GraphQLSchema({ query });