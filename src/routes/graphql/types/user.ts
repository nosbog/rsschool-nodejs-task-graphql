import { GraphQLString, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';
import { PostType } from './post.js';
import { Context, ID } from './common.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',

  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (source: ID, args, { prisma }: Context) =>
        await prisma.profile.findUnique({ where: { userId: source.id } }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source: ID, args, { prisma }: Context) =>
        await prisma.post.findMany({ where: { authorId: source.id } }),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source: ID, args, { prisma }: Context) =>
        await prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: source.id } } },
        }),
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source: ID, args, { prisma }: Context) =>
        await prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: source.id } } },
        }),
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});