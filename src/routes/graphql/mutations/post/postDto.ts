import { Static } from '@fastify/type-provider-typebox';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { createPostSchema } from '../../../posts/schemas.js';
import { UUIDType } from '../../types/uuid.js';

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

export type CreatePostDto = Static<(typeof createPostSchema)['body']>;

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export type ChangePostDto = Static<(typeof createPostSchema)['body']>;
