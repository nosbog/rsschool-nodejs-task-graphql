import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLInt,
    },
  }),
});
