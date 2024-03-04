import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import {
  MemberType,
  MemberTypeIdEnum,
  PostType,
  ProfileType,
  UserType,
} from '../types/modelTypes.js';
import { Context } from '../context.js';
import { UUIDType } from '../types/uuid.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { User } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export const resolvers = {
  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_, _args, context: Context) => {
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
  users: {
    type: new GraphQLList(UserType),
    resolve: async (
      _,
      _args,
      { prisma, dataLoaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const parsedInfo = parseResolveInfo(info) as ResolveTree;

      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parsedInfo,
        new GraphQLList(UserType),
      );
      //subs
      const subscribedTo = 'userSubscribedTo' in fields;
      const subscribedToUser = 'subscribedToUser' in fields;

      const users = await prisma.user.findMany({
        include: {
          userSubscribedTo: subscribedTo,
          subscribedToUser: subscribedToUser,
        },
      });

      if (subscribedTo || subscribedToUser) {
        const usersMap = new Map<string, User>();

        users.forEach((user) => {
          usersMap.set(user.id, user);
        });

        users.forEach((user) => {
          if (subscribedTo) {
            dataLoaders.userSubscribedTo.prime(
              user.id,
              user.userSubscribedTo.map((sub) => usersMap.get(sub.authorId) as User),
            );
          }

          if (subscribedToUser) {
            dataLoaders.userSubLoader.prime(
              user.id,
              user.subscribedToUser.map((sub) => usersMap.get(sub.subscriberId) as User),
            );
          }
        });
      }

      return users;
    },
  },
  memberType: {
    type: MemberType,
    args: {
      id: { type: MemberTypeIdEnum },
    },
    resolve: async (_, args: { id: MemberTypeId }, context: Context) => {
      const memberType = await context.prisma.memberType.findUnique({
        where: { id: args.id },
      });

      return memberType;
    },
  },
  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async (parent, _args, context: Context) => {
      const memberTypes = await context.prisma.memberType.findMany();

      return memberTypes;
    },
  },
  post: {
    type: PostType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (parent, args: { id: string }, context: Context) => {
      const post = await context.prisma.post.findUnique({
        where: { id: args.id },
      });

      return post;
    },
  },
  posts: {
    type: new GraphQLList(PostType),
    resolve: async (parent, _args, context: Context) => {
      const posts = await context.prisma.post.findMany();

      return posts;
    },
  },
};
