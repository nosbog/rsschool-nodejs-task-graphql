import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { schema } from './schema.js';
import { contextFactory, GraphQLContext } from './context.js';

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
      const { query, variables } = req.body;
      const contextValue: GraphQLContext = contextFactory(fastify);

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue,
      });

      return {
        data: result.data ?? null,
        errors: result.errors ?? undefined,
      };
    },
  });
};

export default plugin;
