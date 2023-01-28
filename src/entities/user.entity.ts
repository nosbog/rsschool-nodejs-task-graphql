import {
  GraphQLList, GraphQLObjectType, GraphQLString,
} from 'graphql/type';

export const userEntity = new GraphQLObjectType({
  name: 'UserEntity',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  },
});
