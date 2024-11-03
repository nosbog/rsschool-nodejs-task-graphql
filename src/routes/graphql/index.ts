import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { memberType, MemberTypeId, post, profile, user } from './types/types.js';
import { FastifyRequest } from 'fastify';
import { UUIDType } from './types/uuid.js';

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
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
    },
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: new GraphQLList(memberType),
          resolve: async () => {
            return prisma.memberType.findMany();
          },
        },
        posts: {
          type: new GraphQLList(post),
          resolve: async () => {
            return prisma.post.findMany();
          },
        },
        users: {
          type: new GraphQLList(user),
          resolve: async () => {
            return prisma.user.findMany();
          },
        },
        profiles: {
          type: new GraphQLList(profile),
          resolve: async () => {
            return prisma.profile.findMany();
          },
        },
        memberType: {
          type: memberType,
          args: {
            id: {
              type: MemberTypeId,
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.memberType.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
        post: {
          type: post,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.post.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
        user: {
          type: user,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            const user = await prisma.user.findUnique({
              where: {
                id: args.id,
              },
            });
            const profile = await prisma.profile.findUnique({
              where: {
                id: args.id,
              },
            });
            if (!user) return null;
            return { ...user, ...profile };
          },
        },
        profile: {
          type: profile,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.profile.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
      },
    }),
  });
};

export default plugin;
