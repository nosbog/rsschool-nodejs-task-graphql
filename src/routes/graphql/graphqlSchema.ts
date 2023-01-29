import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { queryType } from './queryType';

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {},
});

export const graphqlSchema = new GraphQLSchema({
  query: queryType,
  // types: [],
  mutation,
});
