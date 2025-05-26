import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { GraphQLContext } from './context.js';



// --- Post ---
const PostType = new GraphQLObjectType<
  { id: string; title: string; content: string },
  GraphQLContext
>({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// --- Profile ---
interface ProfileParent {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}
const ProfileType = new GraphQLObjectType<ProfileParent, GraphQLContext>({
  name: 'Profile',
  fields: (): GraphQLFieldConfigMap<ProfileParent, GraphQLContext> => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve: (parent: ProfileParent, _args, ctx) =>
        ctx.prisma.user.findUnique({ where: { id: parent.userId } }),
    },
    memberType: {
      type: MemberType,
      resolve: (parent: ProfileParent, _args, ctx) =>
        ctx.prisma.memberType.findUnique({ where: { id: parent.memberTypeId } }),
    },
  }),
});

// --- MemberType ---
const MemberType = new GraphQLObjectType<
  { id: string; discount: number; postsLimitPerMonth: number },
  GraphQLContext
>({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (parent: { id: string }, _args, ctx) =>
        ctx.prisma.profile.findMany({ where: { memberTypeId: parent.id } }),
    },
  },
});

// --- User ---
interface UserParent {
  id: string;
  name: string;
  balance: number;
}
const UserType = new GraphQLObjectType<UserParent, GraphQLContext>({
  name: 'User',
  fields: (): GraphQLFieldConfigMap<UserParent, GraphQLContext> => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent: UserParent, _args, ctx) =>
        ctx.prisma.post.findMany({ where: { authorId: parent.id } }),
    },
    profile: {
      type: ProfileType,
      resolve: (parent: UserParent, _args, ctx) =>
        ctx.prisma.profile.findUnique({ where: { userId: parent.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: UserParent, _args, ctx) => {
        const subs = await ctx.prisma.subscribersOnAuthors.findMany({ where: { subscriberId: parent.id } });
        const authorIds = subs.map((s) => s.authorId);
        return ctx.prisma.user.findMany({ where: { id: { in: authorIds } } });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: UserParent, _args, ctx) => {
        const subs = await ctx.prisma.subscribersOnAuthors.findMany({ where: { authorId: parent.id } });
        const subscriberIds = subs.map((s) => s.subscriberId);
        return ctx.prisma.user.findMany({ where: { id: { in: subscriberIds } } });
      },
    },
  }),
});

// --- Query ---
const QueryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_, __, ctx) => ctx.prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_parent, args: { id: string }, ctx) =>
        ctx.prisma.memberType.findUnique({ where: { id: args.id } }),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_, __, ctx) => ctx.prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_parent, args: { id: string }, ctx) =>
        ctx.prisma.post.findUnique({ where: { id: args.id } }),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_parent, _args, ctx) => ctx.prisma.user.findMany(),
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_parent, args: { id: string }, ctx) =>
        ctx.prisma.user.findUnique({ where: { id: args.id } }),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_, __, ctx) => ctx.prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_parent, args: { id: string }, ctx) =>
        ctx.prisma.profile.findUnique({ where: { id: args.id } }),
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
});
