import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType }, 
  }),
});