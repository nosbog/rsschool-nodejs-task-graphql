import { GraphQLSchema } from 'graphql';
import { QueryType as query } from '../query/query.js';
import { MutationType as mutation } from '../mutation/mutation.js';

export const schema: GraphQLSchema = new GraphQLSchema({ query, mutation });