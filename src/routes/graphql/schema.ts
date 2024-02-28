import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { Context } from './types/context.js';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const MemberTypesType = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: {
    id: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const Posts = new GraphQLObjectType({
  name: 'Posts',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLID },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: UserType,
      resolve: async (_, args, context: Context) => {
        const users = await context.prisma.user.findMany();

        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
        });

        return user;
      },
    },
    memberTypes: {
      type: MemberTypesType,
      resolve: async (_, args, context: Context) => {
        const memberTypes = await context.prisma.memberType.findMany();

        return memberTypes;
      },
    },
    memberType: {
      type: MemberTypesType,
      args: {
        // TODO use MemberTypeId enum
        id: { type: GraphQLString },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: { id: args.id },
        });

        return memberType;
      },
    },
    posts: {
      type: Posts,
      resolve: async (_, args, context: Context) => {
        const posts = await context.prisma.post.findMany();

        return posts;
      },
    },
    post: {
      type: Posts,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id },
        });

        return post;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
      },
      resolve: async (_, args: { name: string; balance: number }, context: Context) => {
        const user = await context.prisma.user.create({
          data: args,
        });

        return user;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.delete({
          where: { id: args.id },
        });

        return user;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
      },
      resolve: async (
        _,
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
    createPost: {
      type: Posts,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve: async (
        _,
        args: { title: string; content: string; authorId: string },
        context: Context,
      ) => {
        const post = await context.prisma.post.create({
          data: args,
        });

        return post;
      },
    },
    updatePost: {
      type: Posts,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: async (
        _,
        args: { id: string; title: string; content: string },
        context: Context,
      ) => {
        const post = await context.prisma.post.update({
          where: { id: args.id },
          data: args,
        });

        return post;
      },
    },
    deletePost: {
      type: Posts,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const post = await context.prisma.post.delete({
          where: { id: args.id },
        });

        return post;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberTypesType],
  query: rootQuery,
  mutation: Mutation,
});
