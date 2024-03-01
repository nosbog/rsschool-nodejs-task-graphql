import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { GraphQLArgs, graphql } from 'graphql';
import { Context } from './types/types.js';
import { getLoaders } from './types/loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
      const { query: source, variables: variableValues } = req.body;
      const { prisma } = fastify;
      const contextValue: Context = {
        prisma,
        ...getLoaders(prisma)
      };

      return graphql({
        source,
        variableValues,
        contextValue,
        schema,
      });
    },
  });
};

export default plugin;
