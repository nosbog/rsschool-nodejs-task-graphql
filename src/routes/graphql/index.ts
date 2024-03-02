import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { getDataLoaders } from './dataLoaders/dataLoaders.js';
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

      const validationResults = validate(schema, parse(query), [depthLimit(5)]);

      if (validationResults.length) {
        return {
          errors: validationResults,
        };
      }

      const dataLoaders = getDataLoaders(prisma);

      return await graphql({
        schema,
        source: query,
        contextValue: {
          prisma,
          dataLoaders,
        },
        variableValues: variables,
      });
    },
  });
};

export default plugin;
