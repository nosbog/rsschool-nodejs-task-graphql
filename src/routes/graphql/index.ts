import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

import { schema } from './schema/schema.js';

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
      try {
        const { query: source, variables: variableValues } = req.body;

        return graphql({
          schema,
          source,
          variableValues,
          contextValue: { prisma },
        });
      } catch (error) {
        return {
          errors: [{ message: 'Internal server error' }],
          prisma,
        };
      }
    },
  });
};

export default plugin;
