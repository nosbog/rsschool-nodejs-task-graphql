import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

/* 
export const postFields = {
  id: Type.String({
    format: 'uuid',
  }),
  title: Type.String(),
  content: Type.String(),
  authorId: userFields.id,
};
*/

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    // authorId ?
  },
});
