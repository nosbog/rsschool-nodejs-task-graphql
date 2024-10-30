import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberIdType, MemberType } from './types/memberTypes.js';
import { CreateUserInput, User } from './types/users.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { UUIDType } from './types/uuid.js';
import { CreatePostInput, Post } from './types/posts.js';
import { CreateProfileInput, Profile } from './types/profiles.js';

interface IncludeFieldsPrisma {
  userSubscribedTo?: boolean;
  subscribedToUser?: boolean;
}

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberIdType) } },
      resolve: (_, args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (_obj, _args, { prisma }, info) => {
        const parsedResolveInfo = parseResolveInfo(info);
        const fields = parsedResolveInfo?.fieldsByTypeName.User;
        const include: IncludeFieldsPrisma = {};
        if (fields && 'userSubscribedTo' in fields) {
          include.userSubscribedTo = true;
        }
        if (fields && 'subscribedToUser' in fields) {
          include.subscribedToUser = true;
        }

        return prisma.user.findMany({
          include,
        });
      },
    },

    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: (_obj, _args, { prisma }) => {
        return prisma.post.findMany();
      },
    },

    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: (_obj, _args, { prisma }) => {
        return prisma.profile.findMany();
      },
    },

    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
  }),
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: (_, args, { prisma }) => {
        const { name, balance } = args.dto;
        return prisma.user.create({
          data: { name, balance },
        });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: (_, args, { prisma }) => {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: (_, args, { prisma }) => {
        return prisma.post.create({
          data: args.dto,
        });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export { schema };
