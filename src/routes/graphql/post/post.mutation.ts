import { GraphQLBoolean } from 'graphql';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { PostDto } from './post.model.js';
import {
  ChangePostInputGQLType,
  CreatePostInputGQLType,
  PostGQLType,
} from './post.type.js';

export const PostMutation = {
  createPost: {
    type: PostGQLType,
    args: { dto: { type: CreatePostInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { dto: PostDto },
      context: RequestContext,
    ) => {
      const post = await context.prismaClient.post.create({ data: args.dto });
      return post;
    },
  },

  changePost: {
    type: PostGQLType,
    args: { id: { type: UUIDType }, dto: { type: ChangePostInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string; dto: PostDto },
      context: RequestContext,
    ) => {
      const post = await context.prismaClient.post.update({
        where: { id: args.id },
        data: args.dto,
      });
      return post;
    },
  },

  deletePost: {
    type: GraphQLBoolean,
    args: { id: { type: UUIDType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string },
      context: RequestContext,
    ) => {
      try {
        await context.prismaClient.post.delete({ where: { id: args.id } });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
