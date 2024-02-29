import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLBoolean, graphql } from 'graphql';
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import {MemberTypeIdType} from './types/types.js';
import {MemberType, ProfileType, PostType, UserType, CreateUserInput, CreateProfileInput, CreatePostInput, ChangeProfileInput, ChangeUserInput, ChangePostInput} from './types/types.js';
import {memberLoader, postLoader, profileLoader, subscribedToUserLoader, userSubscribedToLoader} from './loader.js';
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

          deleteUser: {
            type: GraphQLBoolean,
            args: {
              id: { type: UUIDType },
            },
            resolve: async (parent, { id }) => {
              try {
                await prisma.user.delete({
                  where: { id: id } });
                return true;
              } catch (error) {
                console.log(error);
                return false;
              }
            },
          },

          changeUser: {
            type: UserType,
            args: {
              id: { type: UUIDType },
              dto: { type: ChangeUserInput },
            },
            resolve: async (parent, { id, dto }) => {
              return await prisma.user.update({ where: { id: id }, data: dto });
            },
          },

          createProfile: {
            type: ProfileType,
            args: {
              dto: { type: CreateProfileInput },
            },

            resolve: async (parents, { dto }) => {
              try {
                return prisma.profile.create({ data: dto });
              } catch (error) {
                console.log(error);
              }
            },
          },

          deleteProfile: {
            type: GraphQLBoolean,
            args: { id: { type: UUIDType } },
            resolve: async (parent, { id }) => {
              try {
                await prisma.profile.delete({
                  where: { id: id } });
                return true;
              } catch (error) {
                console.log(error);
                return false;
              }
            },
          },

          changeProfile: {
            type: ProfileType,
            args: {
              id: { type: UUIDType },
              dto: { type: ChangeProfileInput },
            },
            resolve: async (parent, { id, dto }) => {
              return await prisma.profile.update({ where: { id: id }, data: dto });
            },
          },

          createPost: {
            type: PostType,
            args: {
              dto: { type: CreatePostInput },
            },
            resolve: async (parent, { dto }) => {
              return prisma.post.create({ data: dto });
            },
          },

          deletePost: {
            type: GraphQLBoolean,
            args: { id: { type: UUIDType } },
            resolve: async (parent, { id }) => {
              try {
                await prisma.post.delete({ where: { id: id } });
                return true;
              } catch (error) {
                console.log(error);
                return false;
              }
            },
          },

          changePost: {
            type: PostType,
            args: {
              id: { type: UUIDType },
              dto: { type: ChangePostInput },
            },
            resolve: async (parent, { id, dto }) => {
              return await prisma.post.update({ where: { id: id }, data: dto });
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
            profileLoader: profileLoader(prisma),
            postLoader: postLoader(prisma),
            userSubscribedToLoader: userSubscribedToLoader(prisma),
            subscribedToUserLoader: subscribedToUserLoader(prisma)
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