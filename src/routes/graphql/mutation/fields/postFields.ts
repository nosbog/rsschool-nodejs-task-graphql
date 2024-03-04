import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ChangePost, CreatePost, ID } from '../../types/common.js';
import { PostType, CreatePostInputType, ChangePostInputType } from '../../types/post.js';
import { UUIDType } from '../../types/uuid.js';

export const postFields = {
  createPost: {
    type: PostType,
    args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
    resolve: async (source, { dto }: CreatePost, { prisma }) =>
      await prisma.post.create({ data: dto }),
  },

  changePost: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInputType) },
    },
    resolve: async (source, { id, dto }: ChangePost, { prisma }) =>
      await prisma.post.update({ where: { id }, data: dto }),
  },

  deletePost: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (source, { id }: ID, { prisma }) =>
      !!(await prisma.post.delete({ where: { id } })),
  },
};