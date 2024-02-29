import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import {MemberTypeIdType} from './types/types.js';
import {MemberType, ProfileType, PostType, UserType, CreateUserInput} from './types/types.js';
import {memberLoader, profileLoader} from './loader.js';
import {UUIDType} from './types/uuid.js';

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
      const query = new GraphQLObjectType({
        name: 'query',
        fields: {
          memberType: {
            type: MemberType,
            args: { id: { type: MemberTypeIdType } },
            resolve: async (parent, { id }) => {
              return await prisma.memberType.findFirst({ where: { id: id } });
            },
          },

          memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async () => {
              return await prisma.memberType.findMany();
            },
          },

          profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async () => {
              return await prisma.profile.findMany();
            },
          },

          posts: {
            type: new GraphQLList(PostType),
            resolve: async () => {
              return await prisma.post.findMany();
            },
          },

          users: {
            type: new GraphQLList(UserType),
            resolve: async (source, args, context, resolveInfo) => {
              const fragment = simplifyParsedResolveInfoFragmentWithType( parseResolveInfo(resolveInfo) as ResolveTree, UserType );

              const users = await context.prisma.user.findMany({
                include: {
                  userSubscribedTo: !!fragment.fields.hasOwnProperty('userSubscribedTo'),
                  subscribedToUser: !!fragment.fields.hasOwnProperty('subscribedToUser'),
                },
              });

              if (fragment.fields.hasOwnProperty('subscribedToUser')) {
                const map = new Map();
                users.map((user: { id: any; subscribedToUser: any[]; }) =>
                    map.set(
                        user.id,
                        user.subscribedToUser.map((subscriber: any) => {
                          const subscriberId = subscriber.subscriberId;
                          return users.find((user: any) => user.id === subscriberId);
                        }),
                    ),
                );
                context.data.subscribers = map;
              } else {
                context.data.subscribers = null;
              }

              if (fragment.fields.hasOwnProperty('userSubscribedTo')) {
                const subscriptions = new Map();
                users.map((user: { id: any; userSubscribedTo: any[]; }) =>
                    subscriptions.set(
                        user.id,
                        user.userSubscribedTo.map((sub: { authorId: any; }) => {
                          const authorId = sub.authorId;
                          return users.find((user: { id: any; }) => user.id === authorId);
                        }),
                    ),
                );
                context.data.subscriptions = subscriptions;
                return users;
              } else {
                context.data.subscriptions = null;
              }
              return users;
            },
          },

          user: {
            type: UserType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, { id }) => {
              return await prisma.user.findFirst({
                where: { id: id } });
            },
          },

          post: {
            type: PostType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, { id }) => {
              return await prisma.post.findFirst({ where: { id: id },
              });
            },
          },

          profile: {
            type: ProfileType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, { id }) => {
              return await prisma.profile.findFirst({ where: { id: id } });
            },
          },
        },
      });

      const mutation = new GraphQLObjectType({
        name: 'mutation',
        fields: {
          createUser: {
            type: UserType,
            args: { dto: { type: CreateUserInput } },
            resolve: async (parent, { dto }) => {
              return prisma.user.create({ data: dto });
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query,
        mutation,
      });

      const result = await graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          loaders: {
            memberLoader: memberLoader(prisma),
            profileLoader: profileLoader(prisma)
          },
          data: {},
          prisma: prisma,
        },
      });
      return { data: result.data, errors: result.errors };
    },
  });
};

export default plugin;
