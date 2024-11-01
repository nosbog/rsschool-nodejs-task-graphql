import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schema.js';

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
      console.log('variables', variables);
      try {
        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: { prisma },
        });

        return { data: result.data, errors: result.errors };
      } catch (error) {
        req.log.error(error);
        // return { errors: [{ message: error.message }] };
      }
    },
  });
};

export default plugin;
