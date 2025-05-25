import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello GraphQL!',
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
});
