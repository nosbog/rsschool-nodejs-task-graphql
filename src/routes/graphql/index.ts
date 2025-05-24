import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  graphql,
  ExecutionResult,
  parse,
  validate,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import DataLoader from 'dataloader';
import depthLimit from 'graphql-depth-limit';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { Prisma, PrismaClient, Post, Profile, MemberType } from '@prisma/client';

type ProfileWithMemberType = Profile & { memberType: MemberType | null };

type UserWithRelations = {
  id: string;
  name: string;
  balance: number;
  profile: ProfileWithMemberType | null;
  posts: Post[];
  userSubscribedTo: Prisma.SubscribersOnAuthorsGetPayload<{
    include: { author: true };
  }>[];
  subscribedToUser: Prisma.SubscribersOnAuthorsGetPayload<{
    include: { subscriber: true };
  }>[];
};

interface GraphQLContext {
  prisma: PrismaClient;
  loaders: {
    user: DataLoader<string, UserWithRelations | null>;
    post: DataLoader<string, Post | null>;
    profile: DataLoader<string, ProfileWithMemberType | null>;
    memberType: DataLoader<string, MemberType | null>;
  };
}

type UserGraphQLType = GraphQLObjectType<UserWithRelations, GraphQLContext>;

const createLoaders = (prisma: PrismaClient): GraphQLContext['loaders'] => ({
  user: new DataLoader<string, UserWithRelations | null>(async (ids) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        profile: { include: { memberType: true } },
        posts: true,
        userSubscribedTo: { include: { author: true } },
        subscribedToUser: { include: { subscriber: true } },
      },
    });
    return ids.map((id) => {
      const user = users.find((u) => u.id === id) || null;
      if (!user) return null;
      return {
        ...user,
        profile: user.profile as ProfileWithMemberType | null,
        posts: user.posts || [],
        userSubscribedTo: user.userSubscribedTo || [],
        subscribedToUser: user.subscribedToUser || [],
      };
    });
  }),
  post: new DataLoader<string, Post | null>(async (ids) => {
    const posts = await prisma.post.findMany({ where: { id: { in: ids as string[] } } });
    return ids.map((id) => posts.find((post) => post.id === id) || null);
  }),
  profile: new DataLoader<string, ProfileWithMemberType | null>(async (ids) => {
    const profiles = await prisma.profile.findMany({
      where: { id: { in: ids as string[] } },
      include: { memberType: true },
    });
    return ids.map((id) => profiles.find((profile) => profile.id === id) || null);
  }),
  memberType: new DataLoader<string, MemberType | null>(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });
    return ids.map((id) => memberTypes.find((mt) => mt.id === id) || null);
  }),
});

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (
        profile: ProfileWithMemberType,
        _: unknown,
        { loaders }: GraphQLContext,
      ) => {
        return loaders.memberType.load(profile.memberTypeId);
      },
    },
  }),
});

const UserType: UserGraphQLType = new GraphQLObjectType<
  UserWithRelations,
  GraphQLContext
>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: (user: UserWithRelations) => user.profile || null,
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (user: UserWithRelations) => user.posts || [],
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        user: UserWithRelations,
        _: unknown,
        { loaders }: GraphQLContext,
      ) => {
        if (!user) return [];
        const authorIds = (user.userSubscribedTo || [])
          .map((sub) => sub.author?.id)
          .filter((id): id is string => id !== null && id !== undefined);
        const authors = await loaders.user.loadMany(authorIds);
        const result = authors.filter(
          (author): author is UserWithRelations => author !== null,
        );
        return result;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        user: UserWithRelations,
        _: unknown,
        { loaders }: GraphQLContext,
      ) => {
        if (!user) return [];
        const subscriberIds = (user.subscribedToUser || [])
          .map((sub) => sub.subscriber?.id)
          .filter((id): id is string => id !== null && id !== undefined);
        const subscribers = await loaders.user.loadMany(subscriberIds);
        const result = subscribers.filter(
          (subscriber): subscriber is UserWithRelations => subscriber !== null,
        );
        return result;
      },
    },
  }),
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (_: unknown, __: unknown, { prisma, loaders }: GraphQLContext) => {
        const memberTypes = await prisma.memberType.findMany();
        memberTypes.forEach((mt) => loaders.memberType.prime(mt.id, mt));
        return memberTypes;
      },
    },
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: (_: unknown, { id }: { id: string }, { loaders }: GraphQLContext) =>
        loaders.memberType.load(id),
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        _: unknown,
        __: unknown,
        { prisma, loaders }: GraphQLContext,
        info,
      ) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree | undefined;
        const includeUserSubscribedTo =
          !!parsedInfo?.fieldsByTypeName?.User?.userSubscribedTo;
        const includeSubscribedToUser =
          !!parsedInfo?.fieldsByTypeName?.User?.subscribedToUser;
        const includeProfile = !!parsedInfo?.fieldsByTypeName?.User?.profile;
        const includePosts = !!parsedInfo?.fieldsByTypeName?.User?.posts;

        const users = await prisma.user.findMany({
          include: {
            profile: includeProfile ? { include: { memberType: true } } : undefined,
            posts: includePosts,
            userSubscribedTo: includeUserSubscribedTo
              ? { include: { author: true } }
              : undefined,
            subscribedToUser: includeSubscribedToUser
              ? { include: { subscriber: true } }
              : undefined,
          },
        });

        const usersWithRelations = users.map((user) => {
          const userWithRelations: UserWithRelations = {
            ...user,
            profile: includeProfile
              ? (user.profile as ProfileWithMemberType | null)
              : null,
            posts: includePosts ? user.posts : [],
            userSubscribedTo: includeUserSubscribedTo
              ? (user.userSubscribedTo as Prisma.SubscribersOnAuthorsGetPayload<{
                  include: { author: true };
                }>[])
              : [],
            subscribedToUser: includeSubscribedToUser
              ? (user.subscribedToUser as Prisma.SubscribersOnAuthorsGetPayload<{
                  include: { subscriber: true };
                }>[])
              : [],
          };
          loaders.user.prime(user.id, userWithRelations);
          if (includeProfile && user.profile && 'memberType' in user.profile) {
            loaders.profile.prime(user.profile.id, user.profile as ProfileWithMemberType);
            if ((user.profile as ProfileWithMemberType).memberType) {
              loaders.memberType.prime(
                user.profile.memberTypeId,
                (user.profile as ProfileWithMemberType).memberType,
              );
            }
          }
          return userWithRelations;
        });
        return usersWithRelations;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        { id }: { id: string },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            profile: { include: { memberType: true } },
            posts: true,
            userSubscribedTo: { include: { author: true } },
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        if (!user) return null;
        const userWithRelations: UserWithRelations = {
          ...user,
          profile: user.profile as ProfileWithMemberType | null,
          posts: user.posts || [],
          userSubscribedTo: user.userSubscribedTo || [],
          subscribedToUser: user.subscribedToUser || [],
        };
        loaders.user.prime(id, userWithRelations);

        return userWithRelations;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_: unknown, __: unknown, { prisma, loaders }: GraphQLContext) => {
        const posts = await prisma.post.findMany();
        posts.forEach((post) => loaders.post.prime(post.id, post));
        return posts;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_: unknown, { id }: { id: string }, { loaders }: GraphQLContext) =>
        loaders.post.load(id),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_: unknown, __: unknown, { prisma, loaders }: GraphQLContext) => {
        const profiles = await prisma.profile.findMany({ include: { memberType: true } });
        profiles.forEach((profile) => {
          loaders.profile.prime(profile.id, profile as ProfileWithMemberType);
          if (profile.memberType) {
            loaders.memberType.prime(profile.memberType.id, profile.memberType);
          }
        });
        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_: unknown, { id }: { id: string }, { loaders }: GraphQLContext) =>
        loaders.profile.load(id),
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (
        _: unknown,
        { dto }: { dto: { name: string; balance: number } },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const user = await prisma.user.create({
          data: dto,
          include: {
            profile: { include: { memberType: true } },
            posts: true,
            userSubscribedTo: { include: { author: true } },
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        const userWithRelations: UserWithRelations = {
          ...user,
          profile: user.profile as ProfileWithMemberType | null,
          posts: user.posts || [],
          userSubscribedTo: user.userSubscribedTo || [],
          subscribedToUser: user.subscribedToUser || [],
        };
        loaders.user.prime(user.id, userWithRelations);
        return userWithRelations;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (
        _: unknown,
        {
          dto,
        }: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const profile = await prisma.profile.create({
          data: dto,
          include: { memberType: true },
        });
        loaders.profile.prime(profile.id, profile as ProfileWithMemberType);
        if (profile.memberType) {
          loaders.memberType.prime(profile.memberType.id, profile.memberType);
        }
        return profile;
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (
        _: unknown,
        { dto }: { dto: { title: string; content: string; authorId: string } },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const post = await prisma.post.create({ data: dto });
        loaders.post.prime(post.id, post);
        return post;
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _: unknown,
        { id, dto }: { id: string; dto: { name?: string; balance?: number } },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const user = await prisma.user.update({
          where: { id },
          data: dto,
          include: {
            profile: { include: { memberType: true } },
            posts: true,
            userSubscribedTo: { include: { author: true } },
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        const userWithRelations: UserWithRelations = {
          ...user,
          profile: user.profile as ProfileWithMemberType | null,
          posts: user.posts || [],
          userSubscribedTo: user.userSubscribedTo || [],
          subscribedToUser: user.subscribedToUser || [],
        };
        loaders.user.prime(user.id, userWithRelations);
        return userWithRelations;
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        _: unknown,
        {
          id,
          dto,
        }: {
          id: string;
          dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: string };
        },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const profile = await prisma.profile.update({
          where: { id },
          data: dto,
          include: { memberType: true },
        });
        loaders.profile.prime(profile.id, profile as ProfileWithMemberType);
        if (profile.memberType) {
          loaders.memberType.prime(profile.memberType.id, profile.memberType);
        }
        return profile;
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _: unknown,
        { id, dto }: { id: string; dto: { title?: string; content?: string } },
        { prisma, loaders }: GraphQLContext,
      ) => {
        const post = await prisma.post.update({ where: { id }, data: dto });
        loaders.post.prime(post.id, post);
        return post;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
        await prisma.user.delete({ where: { id } });
        return id;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _: unknown,
        { id }: { id: string },
        { prisma, loaders }: GraphQLContext,
      ) => {
        await prisma.profile.delete({ where: { id } });
        loaders.profile.clear(id);
        return id;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _: unknown,
        { id }: { id: string },
        { prisma, loaders }: GraphQLContext,
      ) => {
        await prisma.post.delete({ where: { id } });
        loaders.post.clear(id);
        return id;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: GraphQLContext,
      ) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const author = await prisma.user.findUnique({ where: { id: authorId } });
        if (!user || !author) {
          throw new Error(
            `User or author not found: userId=${userId}, authorId=${authorId}`,
          );
        }
        const existingSubscription = await prisma.subscribersOnAuthors.findUnique({
          where: {
            subscriberId_authorId: { subscriberId: userId, authorId },
          },
        });
        if (existingSubscription) {
          return `${userId} already subscribed to ${authorId}`;
        }
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return `${userId} subscribed to ${authorId}`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: GraphQLContext,
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId: userId, authorId } },
        });
        return `${userId} unsubscribed from ${authorId}`;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body as {
        query: string;
        variables?: Record<string, unknown>;
      };
      const loaders = createLoaders(prisma);
      const source = parse(query);
      const validationErrors = validate(schema, source, [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return {
          errors: validationErrors.map((err) => ({
            message: err.message,
            locations: err.locations?.map((loc) => ({
              line: loc.line,
              column: loc.column,
            })),
            path: err.path ? [...err.path] : undefined,
          })),
        };
      }

      const result: ExecutionResult = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, loaders },
      });

      return {
        data: result.data,
        errors: result.errors?.map((err) => ({
          message: err.message,
          locations: err.locations?.map((loc) => ({
            line: loc.line,
            column: loc.column,
          })),
          path: err.path ? [...err.path] : undefined,
        })),
      };
    },
  });
};

export default plugin;
