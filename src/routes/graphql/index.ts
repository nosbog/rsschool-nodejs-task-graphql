import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { schema } from '../../graphql/schema';
import { resolvers, createLoaders } from '../../graphql/resolvers';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

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
    async handler(req, reply) {
      const { query, variables } = req.body;
      const context = {
        prisma: fastify.prisma,
        loaders: createLoaders(fastify.prisma),
      };

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        rootValue: resolvers,
        contextValue: context,
        validationRules: [depthLimit(5)],
      });

      return result;
    },
  });
};

export default plugin;
