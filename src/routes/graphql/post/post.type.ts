import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostModel } from './post.model.js';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { UserGQLType } from '../user/user.type.js';

export const PostGQLType: GraphQLObjectType<PostModel, RequestContext> =
  new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: UUIDType },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      authorId: { type: UUIDType },
      author: {
        type: UserGQLType,
        resolve: async (parent: PostModel, _noArgs: unknown, context: RequestContext) => {
          const user = await context.dataLoaders.user.load(parent.authorId);
          return user;
        },
      },
    }),
  });

export const CreatePostInputGQLType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const ChangePostInputGQLType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});
