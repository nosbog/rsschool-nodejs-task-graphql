import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

interface Context {
  prisma: PrismaClient;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const context: Context = {
    prisma: prisma,
  };

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
      return graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: context,
      });
    },
  });
};

export default plugin;

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC',
    },
    BUSINESS: {
      value: 'BUSINESS',
    },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeId),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: MemberType,
      resolve: async (profile: { memberTypeId: string }, _args, context: Context) => {
        return context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: Profile,
      resolve: async (user: { id: string }, _args, context: Context) => {
        return context.prisma.profile.findUnique({ where: { userId: user.id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (user: { id: string }, _args, context: Context) => {
        return context.prisma.post.findMany({ where: { authorId: user.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (user: { id: string }, _args, context: Context) => {
        return context.prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: user.id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (user: { id: string }, _args, context: Context) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: { authorId: user.id },
            },
          },
        });
      },
    },
  }),
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'createUser',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'changeUser',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'createPost',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  }),
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'changePost',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'createProfile',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
    },
  }),
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'changeProfile',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async (_parent, _args, context: Context) => {
          return context.prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: {
            type: new GraphQLNonNull(MemberTypeId),
          },
        },
        resolve: async (_parent, args: { id: string }, context: Context) => {
          return context.prisma.memberType.findUnique({ where: { id: args.id } });
        },
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(User)),
        resolve: async (_parent, _args, context: Context) => {
          return context.prisma.user.findMany({
            include: {
              profile: true,
              posts: true,
            },
          });
        },
      },
      user: {
        type: User as GraphQLOutputType,
        args: {
          id: {
            type: new GraphQLNonNull(UUIDType),
          },
        },
        resolve: async (_parent, args: { id: string }, context: Context) => {
          return context.prisma.user.findUnique({
            where: { id: args.id },
            include: {
              profile: true,
              posts: true,
            },
          });
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: async (_parent, _args, context: Context) => {
          return context.prisma.post.findMany();
        },
      },
      post: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(UUIDType),
          },
        },
        resolve: async (_parent, args: { id: string }, context: Context) => {
          return context.prisma.post.findUnique({ where: { id: args.id } });
        },
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
        resolve: async (_parent, _args, context: Context) => {
          return context.prisma.profile.findMany();
        },
      },
      profile: {
        type: Profile,
        args: {
          id: {
            type: new GraphQLNonNull(UUIDType),
          },
        },
        resolve: async (_parent, args: { id: string }, context: Context) => {
          return context.prisma.profile.findUnique({ where: { id: args.id } });
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: () => ({
      createUser: {
        type: new GraphQLNonNull(User),
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: (
          _parent,
          { dto }: { dto: { name: string; balance: number } },
          context: Context,
        ) => {
          return context.prisma.user.create({ data: dto });
        },
      },
      changeUser: {
        type: new GraphQLNonNull(User),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: {
            type: new GraphQLNonNull(ChangeUserInput),
          },
        },
        resolve: (
          _parent,
          { id, dto }: { id: string; dto: { name: string; balance: number } },
          context: Context,
        ) => {
          return context.prisma.user.update({ where: { id }, data: dto });
        },
      },
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_parent, { id }: { id: string }, context: Context) => {
          return context.prisma.user.delete({ where: { id } });
        },
      },
      createPost: {
        type: new GraphQLNonNull(Post),
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },
        resolve: (
          _parent,
          { dto }: { dto: { title: string; content: string; authorId: string } },
          context: Context,
        ) => {
          return context.prisma.post.create({ data: dto });
        },
      },
      changePost: {
        type: new GraphQLNonNull(Post),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: (
          _parent,
          { id, dto }: { id: string; dto: { title: string; content: string } },
          context: Context,
        ) => {
          return context.prisma.post.update({ where: { id }, data: dto });
        },
      },
      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_parent, { id }: { id: string }, context) => {
          return context.prisma.post.delete({ where: { id } });
        },
      },
      createProfile: {
        type: new GraphQLNonNull(Profile),
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },
        resolve: (
          _parent,
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
          context: Context,
        ) => {
          return context.prisma.profile.create({ data: dto });
        },
      },
      changeProfile: {
        type: new GraphQLNonNull(Profile),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: (
          _parent,
          {
            id,
            dto,
          }: {
            id: string;
            dto: {
              isMale: boolean;
              yearOfBirth: number;
              userId: string;
              memberTypeId: string;
            };
          },
          context: Context,
        ) => {
          return context.prisma.profile.update({ where: { id }, data: dto });
        },
      },
      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_parent, { id }: { id: string }, context) => {
          return context.prisma.profile.delete({ where: { id } });
        },
      },
      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: {
            type: new GraphQLNonNull(UUIDType),
          },
          authorId: {
            type: new GraphQLNonNull(UUIDType),
          },
        },
        resolve: (
          _parent,
          { userId, authorId }: { userId: string; authorId: string },
          context: Context,
        ) => {
          return context.prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId: authorId,
            },
          });
        },
      },
      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: {
            type: new GraphQLNonNull(UUIDType),
          },
          authorId: {
            type: new GraphQLNonNull(UUIDType),
          },
        },
        resolve: (
          _parent,
          { userId, authorId }: { userId: string; authorId: string },
          context: Context,
        ) => {
          return context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId: authorId,
              },
            },
          });
        },
      },
    }),
  }),
});
