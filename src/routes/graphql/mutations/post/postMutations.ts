import { GraphQLBoolean } from 'graphql';
import { PostType } from '../../models/post.js';
import { Context } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';
import {
  ChangePostDto,
  ChangePostInput,
  CreatePostDto,
  CreatePostInput,
} from './postDto.js';

export const postMutations = {
  createPost: {
    type: PostType,
    args: {
      dto: {
        type: CreatePostInput,
      },
    },
    resolve: async (_, args: { dto: CreatePostDto }, context: Context) => {
      const post = await context.prisma.post.create({
        data: args.dto,
      });

      return post;
    },
  },
  changePost: {
    type: PostType,
    args: {
      id: { type: UUIDType },
      dto: {
        type: ChangePostInput,
      },
    },
    resolve: async (_, args: { id: string; dto: ChangePostDto }, context: Context) => {
      const post = await context.prisma.post.update({
        where: { id: args.id },
        data: args.dto,
      });

      return post;
    },
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      await context.prisma.post.delete({
        where: { id: args.id },
      });
    },
  },
};
