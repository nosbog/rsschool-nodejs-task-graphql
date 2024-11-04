import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { idFieldType } from './util.js';
import { Static } from '@sinclair/typebox';
import { postSchema } from '../../posts/schemas.js';

export type Post = Static<typeof postSchema>;

const postFields = {
  title: { type: new GraphQLNonNull(GraphQLString) },
  content: { type: new GraphQLNonNull(GraphQLString) },
  authorId: { type: new GraphQLNonNull(UUIDType) },
};

const postFieldsPartial = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: UUIDType },
};

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    ...idFieldType,
    ...postFields,
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    ...postFields,
  },
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    ...postFieldsPartial,
  },
});
