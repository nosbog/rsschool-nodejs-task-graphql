import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId } from './types/memberTypes.js';
import { PostType } from './types/postTypes.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: (profile, args, ctx) => {
        return ctx.prisma.memberType.findUnique({
          where: {
            id: profile.memberTypeId,
          },
        });
      },
    },
  },
});

const SubscribersOnAuthors = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: {
    subscriberId: { type: GraphQLString },
    authorId: { type: GraphQLString },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: (user, args, ctx) => {
        try {
          return ctx.prisma.profile.findUnique({
            where: {
              userId: user.id,
            },
          });
        } catch {
          return null;
        }
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, args, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            authorId: user.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, args, ctx) => {
        return ctx.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
          include: { subscribedToUser: true },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, args, ctx) => {
        return ctx.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
          include: { userSubscribedTo: true },
        });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: (_, args, ctx) => {
        return ctx.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_, args, ctx) => {
        return await ctx.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_, args, ctx) => {
        return ctx.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, ctx) => {
        try {
          return ctx.prisma.post.findUnique({
            where: {
              id: args.id,
            },
          });
        } catch {
          return null;
        }
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_, arg, ctx) => {
        return ctx.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, ctx) => {
        try {
          return ctx.prisma.user.findUnique({
            where: {
              id: args.id,
            },
          });
        } catch {
          return null;
        }
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_, arg, ctx) => {
        return ctx.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, ctx) => {
        try {
          return ctx.prisma.profile.findUnique({
            where: {
              id: args.id,
            },
          });
        } catch {
          return null;
        }
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutatuin
});
