import { GraphQLList } from 'graphql';
import { PostType } from '../models/post.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

export const postResolvers = {
  posts: {
    type: new GraphQLList(PostType),
    resolve: async (_, _args, context: Context) => {
      const posts = await context.prisma.post.findMany();

      return posts;
    },
  },
  post: {
    type: PostType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      const post = await context.prisma.post.findUnique({
        where: { id: args.id },
      });

      return post;
    },
  },
};
