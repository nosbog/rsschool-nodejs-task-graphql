import graphql from 'graphql';
import { UUIDType } from './uuid.js';
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});
