import {
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GqlContext, Post, UUID } from '../types.js';
import { UUIDType } from './UUID.js';

export const PostType: GraphQLObjectType<Post, GqlContext> = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});

export const PostQueries = {
  post: {
    type: PostType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    async resolve(_, args, ctx) {
      return ctx.prisma.post.findUnique({ where: { id: args.id } });
    },
  },
  posts: {
    type: new GraphQLList(PostType),
    async resolve(_, __, ctx) {
      return ctx.prisma.post.findMany();
    },
  },
} satisfies {
  post: GraphQLFieldConfig<void, GqlContext, { id: UUID }>;
  posts: GraphQLFieldConfig<void, GqlContext>;
};
