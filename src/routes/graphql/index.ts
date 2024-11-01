import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypes, posts, profiles, users } from './types/types.js';

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
          type: new GraphQLList(memberTypes),
          resolve: async () => {
            return prisma.memberType.findMany();
          },
        },
        posts: {
          type: new GraphQLList(posts),
          resolve: async () => {
            return prisma.post.findMany();
          },
        },
        users: {
          type: new GraphQLList(users),
          resolve: async () => {
            return prisma.user.findMany();
          },
        },
        profiles: {
          type: new GraphQLList(profiles),
          resolve: async () => {
            return prisma.profile.findMany();
          },
        },
      },
    }),
  });
};

export default plugin;
