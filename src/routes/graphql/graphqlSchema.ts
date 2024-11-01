import { PrismaClient } from '@prisma/client';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberIdType, MemberType } from './types/memberTypes.js';
import { ChangeUserInput, CreateUserInput, User } from './types/users.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { UUIDType } from './types/uuid.js';
import { ChangePostInput, CreatePostInput, Post } from './types/posts.js';
import { ChangeProfileInput, CreateProfileInput, Profile } from './types/profiles.js';
import {
  createMemberTypeLoader,
  createPostLoader,
  createProfileLoader,
  createUserLoader,
} from './data-loaders.js';
import { HttpErrors } from '@fastify/sensible';

interface IncludeFieldsPrisma {
  userSubscribedTo?: boolean;
  subscribedToUser?: boolean;
}

interface IContext {
  prisma: PrismaClient;
  httpErrors: HttpErrors;
  userLoader: ReturnType<typeof createUserLoader>;
  memberTypeLoader: ReturnType<typeof createMemberTypeLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
  profileLoader: ReturnType<typeof createProfileLoader>;
}

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, context) => {
        const memberTypes = await context.prisma.memberType.findMany();
        memberTypes.forEach((memberType) =>
          (context as IContext).memberTypeLoader.prime(memberType.id, memberType),
        );

        return memberTypes;
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
      resolve: async (_obj, _args, context, info) => {
        const parsedResolveInfo = parseResolveInfo(info);
        const fields = parsedResolveInfo?.fieldsByTypeName.User;
        const include: IncludeFieldsPrisma = {};
        if (fields && 'userSubscribedTo' in fields) {
          include.userSubscribedTo = true;
        }
        if (fields && 'subscribedToUser' in fields) {
          include.subscribedToUser = true;
        }

        const users = await context.prisma.user.findMany({
          include,
        });
        users.forEach((user) => (context as IContext).userLoader.prime(user.id, user));
        return users;
      },
    },

    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, context) => {
        return await (context as IContext).userLoader.load(args.id);
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_obj, _args, context) => {
        const posts = await context.prisma.post.findMany();
        posts.forEach((post) => (context as IContext).postLoader.prime(post.id, post));

        return posts;
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
      resolve: async (_obj, _args, context) => {
        const profiles = await context.prisma.profile.findMany();
        profiles.forEach((profile) =>
          (context as IContext).profileLoader.prime(profile.id, profile),
        );

        return profiles;
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
      resolve: async (_, args, { prisma }) => {
        const { name, balance } = args.dto;
        return await prisma.user.create({
          data: { name, balance },
        });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.profile.create({
          data: args.dto,
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.post.create({
          data: args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, args, { prisma }) => {
        return await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, args, { prisma }) => {
        return await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, args, context) => {
        (context as IContext).userLoader.clear(args.id);

        return await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, context) => {
        (context as IContext).userLoader.clear(args.id);

        await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return null;
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, { prisma }) => {
        await prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return null;
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, { prisma }) => {
        await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return null;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, context) => {
        (context as IContext).userLoader.clear(args.id);

        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return `User with id ${args.userId} subscribed to author with id ${args.authorId}`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, context) => {
        (context as IContext).userLoader.clear(args.id);

        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return `User with id ${args.userId} unsubscribed from author with id ${args.authorId}`;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export { schema };
