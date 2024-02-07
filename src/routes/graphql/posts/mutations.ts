import {
  ChangePostInputType,
  CreatePostInputType,
  EmptyResponse,
  PostType,
} from '../schemas.js';
import { GraphQLString, GraphQLID } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createPostMutation = {
  type: PostType,
  args: { dto: { type: CreatePostInputType } },
  resolve: async (parent, { dto }, context, info) => {
    const newPost = await context.prisma.post.create({
      data: dto,
    });

    return newPost;
  },
};

export const deletePostMutation = {
  type: EmptyResponse,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context, info) => {
    await context.prisma.post.delete({
      where: { id },
    });

    return null;
  },
};

export const changePostMutation = {
  type: PostType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangePostInputType },
  },
  resolve: async (parent, { id, dto }, context, info) => {
    const updatedPost = await context.prisma.post.update({
      where: { id },
      data: dto,
    });

    return updatedPost;
  },
};
