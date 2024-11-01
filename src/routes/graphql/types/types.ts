import { GraphQLFloat, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

export const memberTypes = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
  }),
});
