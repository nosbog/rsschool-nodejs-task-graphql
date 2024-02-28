import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { schema } from './schema.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

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
      const { query, variables } = req.body;

      return await graphql({
        schema,
        source: query,
        contextValue: { prisma },
        variableValues: variables,
      });
    },
  });
};

export default plugin;
