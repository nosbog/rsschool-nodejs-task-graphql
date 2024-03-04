import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { createLoaders } from './dataLoaders.js';
import { schema } from './schema.js';
import depthLimit from 'graphql-depth-limit';

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
      const dataLoader = createLoaders(prisma);
      const validateQuery = validate(schema, parse(query), [depthLimit(5)]);
      if (validateQuery.length > 0) {
        return {
          errors: validateQuery,
        };
      }
      const res = await graphql({
        schema,
        source: query,
        contextValue: { prisma, dataLoader },
        variableValues: variables,
      });
      return res;
    },
  });
};

export default plugin;
