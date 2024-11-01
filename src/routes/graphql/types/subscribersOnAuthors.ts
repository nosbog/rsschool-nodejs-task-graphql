import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';


export const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: "SubscribersOnAuthors",
  fields: () => ({
    subscriber: { type: UserType },
    subscriberId: { type: UUIDType }, 
    author: { type: UserType },
    authorId: { type: UUIDType }, 
  }),
});