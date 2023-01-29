import { GraphQLSchema } from 'graphql';
import { queryType } from './query/queryType';

// const mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {},
// });

export const graphqlSchema = new GraphQLSchema({
  query: queryType,
  // types: [],
  // mutation,
});
