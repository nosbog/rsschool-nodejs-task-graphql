import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';
import { Context } from './types/context.js';
import { UUIDType } from './types/uuid.js';

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLString },
  },
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType },
    posts: { type: new GraphQLList(PostType) },
  },
});

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, args, context: Context) => {
        const users = await context.prisma.user.findMany();

        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
        });

        return user;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (_, args: { userId: string }, context: Context) => {
        const users = await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: args.userId,
              },
            },
          },
        });

        return users;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      args: {
        subscriberId: { type: UUIDType },
      },
      resolve: async (_, args: { subscriberId: string }, context: Context) => {
        const users = await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: args.subscriberId,
              },
            },
          },
        });

        return users;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_, args, context: Context) => {
        const memberTypes = await context.prisma.memberType.findMany();

        return memberTypes;
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: MemberTypeIdEnum },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: { id: args.id },
        });

        return memberType;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, args, context: Context) => {
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
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, args, context: Context) => {
        const profiles = await context.prisma.profile.findMany();

        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const profile = await context.prisma.profile.findUnique({
          where: { id: args.id },
        });

        return profile;
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
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
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
      type: PostType,
      args: {
        id: { type: UUIDType },
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
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const post = await context.prisma.post.delete({
          where: { id: args.id },
        });

        return post;
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: UUIDType },
        memberTypeId: { type: GraphQLString },
      },
      resolve: async (
        _,
        args: {
          isMale: boolean;
          yearOfBirth: number;
          userId: string;
          memberTypeId: string;
        },
        context: Context,
      ) => {
        const profile = await context.prisma.profile.create({
          data: args,
        });

        return profile;
      },
    },
    updateProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: GraphQLString },
      },
      resolve: async (
        _,
        args: {
          id: string;
          isMale: boolean;
          yearOfBirth: number;
          memberTypeId: string;
        },
        context: Context,
      ) => {
        const profile = await context.prisma.profile.update({
          where: { id: args.id },
          data: args,
        });

        return profile;
      },
    },
    deleteProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const profile = await context.prisma.profile.delete({
          where: { id: args.id },
        });

        return profile;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberTypeType, PostType, ProfileType],
  query: rootQuery,
  mutation: Mutation,
});
