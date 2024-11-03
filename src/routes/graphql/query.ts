import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql';
  import { UUIDType } from './types/uuid.js';
  import { UUID } from 'crypto';
  import { MemberTypeId } from '../member-types/schemas.js';
  import { UserModel, ProfileModel } from './types/models.js';
  import { Context } from './types/interfaces.js';
  
  export const GraphQLMemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      basic: { value: MemberTypeId.BASIC },
      business: { value: MemberTypeId.BUSINESS },
    },
  });
  
  export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: GraphQLMemberTypeId },
      discount: { type: GraphQLFloat },
      postsLimitPerMonth: { type: GraphQLInt },
    }),
  });
  
  export const Post = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: UUIDType },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      authorId: { type: UUIDType },
    }),
  });
  
  export const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
      profile: {
        type: Profile,
        resolve: async (root: UserModel, args, context: Context) =>
          await context.prisma.profile.findUnique({
            where: { userId: root.id },
          }),
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: async (root: UserModel, args, context: Context) =>
          await context.prisma.post.findMany({
            where: { authorId: root.id },
          }),
      },
      userSubscribedTo: {
        type: new GraphQLList(User),
        resolve: async (root: UserModel, args, context: Context) =>
          await context.prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: {
                  subscriberId: root.id,
                },
              },
            },
          }),
      },
      subscribedToUser: {
        type: new GraphQLList(User),
        resolve: async (root: UserModel, args, context: Context) =>
          await context.prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: root.id,
                },
              },
            },
          }),
      },
    }),
  });
  
  export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: UUIDType },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      userId: { type: UUIDType },
      memberTypeId: { type: GraphQLMemberTypeId },
      memberType: {
        type: MemberType,
        resolve: async (root: ProfileModel, args, context: Context) =>
          await context.prisma.memberType.findUnique({
            where: { id: root.memberTypeId },
          }),
      },
    }),
  });
  
  export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      // MemberType
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (root, args, context: Context) =>
          await context.prisma.memberType.findMany(),
      },
      memberType: {
        type: MemberType,
        args: { id: { type: GraphQLMemberTypeId } },
        resolve: async (root, args: { id: MemberTypeId }, context: Context) =>
          await context.prisma.memberType.findUnique({
            where: { id: args.id },
          }),
      },
  
      // Post
      posts: {
        type: new GraphQLList(Post),
        resolve: async (root, args, context: Context) =>
          await context.prisma.post.findMany(),
      },
      post: {
        type: Post,
        args: { id: { type: UUIDType } },
        resolve: async (root, args: { id: UUID }, context: Context) =>
          await context.prisma.post.findUnique({
            where: { id: args.id },
          }),
      },
  
      // User
      users: {
        type: new GraphQLList(User),
        resolve: async (root, args, context: Context) =>
          await context.prisma.user.findMany(),
      },
      user: {
        type: User,
        args: { id: { type: UUIDType } },
        resolve: async (root, args: { id: UUID }, context: Context) =>
          await context.prisma.user.findUnique({
            where: { id: args.id },
          }),
      },
  
      // Profile
      profiles: {
        type: new GraphQLList(Profile),
        resolve: async (root, args, context: Context) =>
          await context.prisma.profile.findMany(),
      },
      profile: {
        args: { id: { type: UUIDType } },
        type: Profile,
        resolve: async (root, args: { id: UUID }, context: Context) =>
          await context.prisma.profile.findUnique({
            where: { id: args.id },
          }),
      },
    }),
  });
  