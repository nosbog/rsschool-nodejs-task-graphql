import { PostType } from '../schemas.js';
import { GraphQLID, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const postsQuery = {
  type: new GraphQLList(PostType),
  resolve: async (parent, args, context, info) => {
    const posts = await context.prisma.post.findMany();
    return posts;
  },
};

export const postQuery = {
  type: PostType,
  args: { id: { type: UUIDType } },
  resolve: async (parent, { id }, context, info) => {
    const post = await context.prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      return null;
    }

    return post;
  },
};
