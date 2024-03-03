import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { MemberTypeId } from '../member-types/schemas.js';
import { MemberTypeIdEnum, MemberTypeType } from './models/memberType.js';
import { PostType } from './models/post.js';
import { ProfileType } from './models/profile.js';
import { SubscribersOnAuthorsType } from './models/subscribersOnAuthors.js';
import { User, UserType } from './models/user.js';
import { postMutations } from './mutations/post/postMutations.js';
import { profileMutations } from './mutations/profile/profileMutations.js';
import { userMutations } from './mutations/user/userMutations.js';
import { Context } from './types/context.js';
import { UUIDType } from './types/uuid.js';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, _args, { prisma, dataLoaders }: Context, info) => {
        const parsedResolveInfo = parseResolveInfo(info) as ResolveTree;

        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfo,
          new GraphQLList(UserType),
        );

        const shouldIncludeUserSubscribedTo = 'userSubscribedTo' in fields;
        const shouldIncludeSubscribedToUser = 'subscribedToUser' in fields;

        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: shouldIncludeUserSubscribedTo,
            subscribedToUser: shouldIncludeSubscribedToUser,
          },
        });

        if (shouldIncludeUserSubscribedTo || shouldIncludeSubscribedToUser) {
          const usersMap = new Map<string, User>();

          users.forEach((user) => {
            usersMap.set(user.id, user);
          });

          users.forEach((user) => {
            if (shouldIncludeUserSubscribedTo) {
              dataLoaders.userSubscribedToLoader.prime(
                user.id,
                user.userSubscribedTo.map((sub) => usersMap.get(sub.authorId) as User),
              );
            }

            if (shouldIncludeSubscribedToUser) {
              dataLoaders.subscribedToUserLoader.prime(
                user.id,
                user.subscribedToUser.map(
                  (sub) => usersMap.get(sub.subscriberId) as User,
                ),
              );
            }
          });
        }

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
      resolve: async (_, args: { id: MemberTypeId }, context: Context) => {
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
    ...userMutations,
    ...postMutations,
    ...profileMutations,
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberTypeType, PostType, ProfileType, SubscribersOnAuthorsType],
  query: rootQuery,
  mutation: Mutation,
});
