import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GqlContext, UUID, User } from '../types.js';
import { PostType } from './Post.js';
import { ProfileType } from './Profile.js';
import { UUIDType } from './UUID.js';

export const UserType: GraphQLObjectType<User, GqlContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: ProfileType,
      async resolve(src, _, ctx) {
        return ctx.prisma.profile.findUnique({ where: { userId: src.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(src, _, ctx) {
        return ctx.prisma.post.findMany({ where: { authorId: src.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve(src, _, ctx) {
        const results = await ctx.prisma.subscribersOnAuthors.findMany({
          where: {
            subscriberId: src.id,
          },
          select: {
            author: true,
          },
        });
        return results.map((result) => result.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve(src, _, ctx) {
        const results = await ctx.prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: src.id,
          },
          select: {
            subscriber: true,
          },
        });
        return results.map((result) => result.subscriber);
      },
    },
  }),
});

export const UserQueries = {
  user: {
    type: UserType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    async resolve(_, args, ctx) {
      return ctx.prisma.user.findUnique({ where: { id: args.id } });
    },
  },
  users: {
    type: new GraphQLList(UserType),
    async resolve(_, __, ctx) {
      return ctx.prisma.user.findMany();
    },
  },
} satisfies {
  user: GraphQLFieldConfig<void, GqlContext, { id: UUID }>;
  users: GraphQLFieldConfig<void, GqlContext>;
};
