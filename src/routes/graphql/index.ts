import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
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
        const queryErrors = validate(schema, parse(source), [depthLimit(5)]);

        if (queryErrors.length) {
          return { errors: queryErrors };
        }

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
