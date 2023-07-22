import graphql from 'graphql';
import { UUIDType } from './uuid.js';
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat } = graphql;

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    // profile: {},
    // posts: {},
    // userSubscribedTo: {},
    // subscribedToUser: {},
  }),
});
