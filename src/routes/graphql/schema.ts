import { GraphQLFloat, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { Context } from './types/context.js';

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: User,
      resolve: async (source, args, context: Context) => {
        const users = await context.prisma.user.findMany();

        return users;
      },
    },
    user: {
      type: User,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (source, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
        });

        return user;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
      },
      resolve: async (
        source,
        args: { name: string; balance: number },
        context: Context,
      ) => {
        const user = await context.prisma.user.create({
          data: args,
        });

        return user;
      },
    },
    deleteUser: {
      type: User,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (source, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.delete({
          where: { id: args.id },
        });

        return user;
      },
    },
    updateUser: {
      type: User,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
      },
      resolve: async (
        source,
        args: { id: string; name: string; balance: number },
        context: Context,
      ) => {
        const user = await context.prisma.user.update({
          where: { id: args.id },
          data: args,
        });

        return user;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  types: [User],
  query: Query,
  mutation: Mutation,
});
