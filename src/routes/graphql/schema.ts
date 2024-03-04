import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { resolvers } from './resolvers/resolvers.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuryType',
  fields: {
    ...resolvers,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: null,
});
