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
import { Prisma, PrismaClient, Post, Profile, MemberType, User } from '@prisma/client';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    profile: true;
    posts: true;
    userSubscribedTo: { include: { author: true } };
    subscribedToUser: { include: { subscriber: true } };
  };
}>;

type SubscriptionWithAuthor = {
  subscriberId: string;
  authorId: string;
  author: User;
};

type SubscriptionWithSubscriber = {
  subscriberId: string;
  authorId: string;
  subscriber: User;
};

interface GraphQLContext {
  prisma: PrismaClient;
  loaders: {
    user: DataLoader<string, UserWithRelations | null>;
    post: DataLoader<string, Post | null>;
    profile: DataLoader<string, Profile | null>;
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
    return ids.map(
      (id) => users.find((user) => user.id === id) || null,
    ) as (UserWithRelations | null)[];
  }),
  post: new DataLoader<string, Post | null>(async (ids) => {
    const posts = await prisma.post.findMany({ where: { id: { in: ids as string[] } } });
    return ids.map((id) => posts.find((post) => post.id === id) || null);
  }),
  profile: new DataLoader<string, Profile | null>(async (ids) => {
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
      resolve: async (profile: Profile, _: unknown, { loaders }: GraphQLContext) => {
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
      resolve: (user: UserWithRelations) => {
        const result = (user.userSubscribedTo || [])
          .map((sub) => sub.author)
          .filter(
            (author): author is UserWithRelations =>
              author !== null && author !== undefined,
          );
        console.log('Resolver userSubscribedTo: userId=', user.id, 'result=', result);
        return result;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user: UserWithRelations) => {
        const result = (user.subscribedToUser || [])
          .map((sub) => sub.subscriber)
          .filter(
            (subscriber): subscriber is UserWithRelations =>
              subscriber !== null && subscriber !== undefined,
          );
        console.log('Resolver subscribedToUser: userId=', user.id, 'result=', result);
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
            profile: includeProfile ? { include: { memberType: true } } : false,
            posts: includePosts,
            userSubscribedTo: includeUserSubscribedTo
              ? { include: { author: true } }
              : false,
            subscribedToUser: includeSubscribedToUser
              ? { include: { subscriber: true } }
              : false,
          },
        });

        users.forEach((user) => {
          const userWithRelations: UserWithRelations = {
            ...user,
            profile: includeProfile ? user.profile : null,
            posts: includePosts ? user.posts : [],
            userSubscribedTo: includeUserSubscribedTo
              ? (user.userSubscribedTo as SubscriptionWithAuthor[])
              : [],
            subscribedToUser: includeSubscribedToUser
              ? (user.subscribedToUser as SubscriptionWithSubscriber[])
              : [],
          };
          loaders.user.prime(user.id, userWithRelations);
          if (includeProfile && user.profile) {
            loaders.profile.prime(user.profile.id, user.profile);
          }
        });

        console.log('Resolver users: users=', users);
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            profile: true,
            posts: true,
            userSubscribedTo: {
              include: {
                author: {
                  include: {
                    profile: true,
                    posts: true,
                    userSubscribedTo: { include: { author: true } },
                    subscribedToUser: { include: { subscriber: true } },
                  },
                },
              },
            },
            subscribedToUser: {
              include: {
                subscriber: {
                  include: {
                    profile: true,
                    posts: true,
                    userSubscribedTo: { include: { author: true } },
                    subscribedToUser: { include: { subscriber: true } },
                  },
                },
              },
            },
          },
        });
        console.log('Resolver user: id=', id, 'result=', user);
        return user;
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
          loaders.profile.prime(profile.id, profile);
          loaders.memberType.prime(profile.memberType.id, profile.memberType);
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
            profile: true,
            posts: true,
            userSubscribedTo: { include: { author: true } },
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        loaders.user.prime(user.id, user);
        return user;
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
        loaders.profile.prime(profile.id, profile);
        loaders.memberType.prime(profile.memberType.id, profile.memberType);
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
            profile: true,
            posts: true,
            userSubscribedTo: { include: { author: true } },
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        console.log('Resolver user: id=', id, 'result=', user);
        loaders.user.prime(user.id, user);
        return user;
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
        loaders.profile.prime(profile.id, profile);
        loaders.memberType.prime(profile.memberType.id, profile.memberType);
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
        console.log(
          'subscribeTo: created subscription userId=',
          userId,
          'authorId=',
          authorId,
        );
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
