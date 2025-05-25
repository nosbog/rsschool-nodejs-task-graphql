import { GraphQLList } from 'graphql';
import { PostGQLType } from './post.type.js';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';

export const PostQuery = {
  posts: {
    description: 'List of all Posts',
    type: new GraphQLList(PostGQLType),
    resolve: async (_parent: unknown, _args: unknown, context: RequestContext) => {
      const posts = await context.prismaClient.post.findMany();
      return posts;
    },
  },

  post: {
    type: PostGQLType,
    description: 'Get single post by id',
    args: { id: { type: UUIDType } },
    resolve: async (_parent: unknown, args: { id: string }, context: RequestContext) => {
      const post = await context.dataLoaders.post.load(args.id);
      return post;
    },
  },
};
