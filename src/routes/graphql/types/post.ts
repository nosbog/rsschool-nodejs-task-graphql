import { GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UserType.getFields().id.type },
  }),
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInputType',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UserType.getFields().id.type },
  },
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInputType',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UserType.getFields().id.type },
  },
});
